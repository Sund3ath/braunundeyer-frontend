'use client';

import { useEffect, useRef, useState } from 'react';
import { OPEN_COOKIE_SETTINGS } from './site/CookieSettingsButton';

// Analytics calls after consent (unchanged from the previous banner).
function trackPageView() {
  const data = {
    page: window.location.pathname,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
    userAgent: navigator.userAgent,
  };
  fetch('/api/analytics/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch((err) => console.error('Analytics error:', err));
}

function trackVisitor() {
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem('visitorId', visitorId);
    fetch('/api/analytics/visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        firstVisit: new Date().toISOString(),
        referrer: document.referrer,
        landingPage: window.location.pathname,
      }),
    }).catch((err) => console.error('Analytics error:', err));
  }
  fetch('/api/analytics/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      sessionStart: new Date().toISOString(),
      page: window.location.pathname,
    }),
  }).catch((err) => console.error('Analytics error:', err));
}

function initializeAnalytics() {
  trackPageView();
  trackVisitor();
}

/**
 * Cookie consent banner. Behaviour is unchanged from the previous version:
 * same localStorage keys (`cookieConsent`, `cookieConsentDate`, `visitorId`),
 * same analytics calls after consent. New: plain styling without animation
 * library, localised copy, and the footer's "Cookie-Einstellungen" link
 * re-opens the panel with the detailed choices.
 */
export default function CookieConsent({ copy, privacyHref }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({ necessary: true, analytics: false, marketing: false });
  const headingRef = useRef(null);

  useEffect(() => {
    let consent = null;
    try { consent = localStorage.getItem('cookieConsent'); } catch { /* storage blocked */ }
    if (!consent) {
      const t = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(t);
    }
    try {
      const saved = JSON.parse(consent);
      setPreferences(saved);
      if (saved.analytics) initializeAnalytics();
    } catch (e) {
      console.error('Error parsing cookie consent:', e);
    }
    return undefined;
  }, []);

  // Footer link: re-open with the detailed choices.
  useEffect(() => {
    const open = () => {
      setShowDetails(true);
      setShowBanner(true);
      requestAnimationFrame(() => headingRef.current?.focus());
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, open);
  }, []);

  const save = (prefs, startAnalytics) => {
    setPreferences(prefs);
    try {
      localStorage.setItem('cookieConsent', JSON.stringify(prefs));
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
    } catch { /* storage blocked */ }
    setShowBanner(false);
    if (startAnalytics) initializeAnalytics();
  };

  const handleAcceptAll = () => save({ necessary: true, analytics: true, marketing: true }, true);
  const handleAcceptSelected = () => save(preferences, preferences.analytics);
  const handleRejectAll = () => save({ necessary: true, analytics: false, marketing: false }, false);

  if (!showBanner) return null;

  return (
    <section className="consent" aria-labelledby="consent-title">
      <div className="wrap consent-inner">
        <div>
          <h2 id="consent-title" ref={headingRef} tabIndex={-1}>{copy.title}</h2>
          <p className="mt-2">
            {copy.text}{' '}
            {privacyHref && <a className="link" href={privacyHref}>{copy.privacyLink}</a>}
          </p>
        </div>
        <div className="consent-actions">
          <button type="button" className="btn btn--ghost" onClick={handleRejectAll}>{copy.necessaryOnly}</button>
          <button type="button" className="btn btn--ghost" aria-expanded={showDetails} aria-controls="consent-details" onClick={() => setShowDetails((v) => !v)}>
            {copy.settings}
          </button>
          <button type="button" className="btn" onClick={handleAcceptAll}>{copy.acceptAll}</button>
        </div>
        {showDetails && (
          <>
            <fieldset id="consent-details">
              <legend>{copy.group}</legend>
              <div className="check">
                <input type="checkbox" id="cc-necessary" checked disabled aria-describedby="cc-necessary-d" />
                <label htmlFor="cc-necessary">{copy.necessary}</label>
                <p id="cc-necessary-d">{copy.necessaryText}</p>
              </div>
              <div className="check">
                <input
                  type="checkbox"
                  id="cc-analytics"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences((p) => ({ ...p, analytics: e.target.checked }))}
                  aria-describedby="cc-analytics-d"
                />
                <label htmlFor="cc-analytics">{copy.analytics}</label>
                <p id="cc-analytics-d">{copy.analyticsText}</p>
              </div>
              <div className="check">
                <input
                  type="checkbox"
                  id="cc-marketing"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences((p) => ({ ...p, marketing: e.target.checked }))}
                  aria-describedby="cc-marketing-d"
                />
                <label htmlFor="cc-marketing">{copy.marketing}</label>
                <p id="cc-marketing-d">{copy.marketingText}</p>
              </div>
            </fieldset>
            <div className="consent-save">
              <button type="button" className="btn" onClick={handleAcceptSelected}>{copy.save}</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
