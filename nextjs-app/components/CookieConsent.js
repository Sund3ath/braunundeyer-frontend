'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, BarChart, X } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Apply saved preferences
      try {
        const savedPrefs = JSON.parse(consent);
        setPreferences(savedPrefs);
        if (savedPrefs.analytics) {
          initializeAnalytics();
        }
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
  }, []);

  const initializeAnalytics = () => {
    // Initialize analytics tracking
    if (typeof window !== 'undefined') {
      // Track page view
      trackPageView();
      
      // Set up visitor tracking
      trackVisitor();
    }
  };

  const trackPageView = () => {
    const data = {
      page: window.location.pathname,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      userAgent: navigator.userAgent,
    };

    // Send to backend
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(err => console.error('Analytics error:', err));
  };

  const trackVisitor = () => {
    // Get or create visitor ID
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = generateVisitorId();
      localStorage.setItem('visitorId', visitorId);
      
      // Track new visitor
      fetch('/api/analytics/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          firstVisit: new Date().toISOString(),
          referrer: document.referrer,
          landingPage: window.location.pathname,
        }),
      }).catch(err => console.error('Analytics error:', err));
    }
    
    // Update session
    fetch('/api/analytics/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        sessionStart: new Date().toISOString(),
        page: window.location.pathname,
      }),
    }).catch(err => console.error('Analytics error:', err));
  };

  const generateVisitorId = () => {
    return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(newPreferences);
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    initializeAnalytics();
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    if (preferences.analytics) {
      initializeAnalytics();
    }
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(newPreferences);
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white shadow-2xl border-t border-gray-200"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-heading font-medium">Cookie-Einstellungen</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern und 
                  anonyme Statistiken zu erfassen. Sie können Ihre Einstellungen jederzeit ändern.
                </p>
                
                {!showDetails && (
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-sm text-accent hover:underline"
                  >
                    Weitere Informationen
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Einstellungen
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>

            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="necessary"
                      checked={preferences.necessary}
                      disabled
                      className="mt-1 cursor-not-allowed opacity-50"
                    />
                    <div className="flex-1">
                      <label htmlFor="necessary" className="flex items-center gap-2 font-medium text-sm cursor-not-allowed">
                        <Shield className="w-4 h-4" />
                        Notwendige Cookies
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="mt-1 cursor-pointer"
                    />
                    <div className="flex-1">
                      <label htmlFor="analytics" className="flex items-center gap-2 font-medium text-sm cursor-pointer">
                        <BarChart className="w-4 h-4" />
                        Analyse-Cookies
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                        indem anonyme Informationen gesammelt werden.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="mt-1 cursor-pointer"
                    />
                    <div className="flex-1">
                      <label htmlFor="marketing" className="flex items-center gap-2 font-medium text-sm cursor-pointer">
                        <Cookie className="w-4 h-4" />
                        Marketing-Cookies
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Werden verwendet, um Besuchern relevante Werbung und Marketing-Kampagnen anzubieten.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    onClick={handleAcceptSelected}
                    className="px-4 py-2 text-sm bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors font-medium"
                  >
                    Auswahl speichern
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}