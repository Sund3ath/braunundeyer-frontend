'use client';

/** Re-opens the cookie consent panel (components/CookieConsent.js). */
export const OPEN_COOKIE_SETTINGS = 'cookie-settings:open';

export default function CookieSettingsButton({ children }) {
  return (
    <button type="button" className="f-btn" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}>
      {children}
    </button>
  );
}
