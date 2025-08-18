'use client';

import { useEffect } from 'react';

/**
 * Performance monitoring component
 * Tracks Core Web Vitals and reports them
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        const sendToAnalytics = (metric) => {
          // Send to your analytics endpoint
          const body = JSON.stringify({
            name: metric.name,
            value: metric.value,
            delta: metric.delta,
            id: metric.id,
            url: window.location.href,
            timestamp: new Date().toISOString()
          });

          // Use sendBeacon for reliability
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics/performance', body);
          } else {
            fetch('/api/analytics/performance', {
              method: 'POST',
              body,
              headers: { 'Content-Type': 'application/json' },
              keepalive: true
            });
          }

          // Log to console in development
          if (process.env.NODE_ENV === 'development') {
            console.log('[Performance]', metric.name, metric.value);
          }
        };

        getCLS(sendToAnalytics);
        getFID(sendToAnalytics);
        getFCP(sendToAnalytics);
        getLCP(sendToAnalytics);
        getTTFB(sendToAnalytics);
      });
    }

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Performance] Page Load Time:', loadTime, 'ms');
      }

      // Check for slow load
      if (loadTime > 3000) {
        console.warn('[Performance] Slow page load detected:', loadTime, 'ms');
      }
    });

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('[Performance] Long task detected:', entry.duration, 'ms');
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task observer not supported
      }
    }

    // Monitor memory usage (Chrome only)
    if (performance.memory) {
      setInterval(() => {
        const memoryInfo = {
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576),
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        };

        if (memoryInfo.usedJSHeapSize > memoryInfo.totalJSHeapSize * 0.9) {
          console.warn('[Performance] High memory usage detected:', memoryInfo);
        }
      }, 30000); // Check every 30 seconds
    }
  }, []);

  return null; // This component doesn't render anything
}