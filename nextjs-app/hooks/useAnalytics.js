'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if analytics cookies are accepted
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) return;

    try {
      const { analytics } = JSON.parse(consent);
      if (!analytics) return;

      // Track page view
      trackPageView(pathname);
    } catch (e) {
      console.error('Analytics error:', e);
    }
  }, [pathname]);

  const trackPageView = async (path) => {
    try {
      const visitorId = localStorage.getItem('visitorId') || 'anonymous';
      
      const data = {
        visitorId,
        path,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        userAgent: navigator.userAgent,
        // Additional data
        title: document.title,
        url: window.location.href,
        queryParams: window.location.search,
      };

      // Send to our API route
      await fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  };

  const trackEvent = async (eventName, eventData = {}) => {
    try {
      const consent = localStorage.getItem('cookieConsent');
      if (!consent) return;

      const { analytics } = JSON.parse(consent);
      if (!analytics) return;

      const visitorId = localStorage.getItem('visitorId') || 'anonymous';
      
      const data = {
        visitorId,
        eventName,
        eventData,
        path: pathname,
        timestamp: new Date().toISOString(),
      };

      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  return { trackEvent };
}