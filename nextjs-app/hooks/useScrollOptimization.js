'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for scroll optimization
 * Provides debounced scroll position and visibility detection
 */
export function useScrollOptimization() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isScrolling, setIsScrolling] = useState(false);
  let scrollTimeout;
  let lastScrollY = 0;

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Determine scroll direction
    if (currentScrollY > lastScrollY) {
      setScrollDirection('down');
    } else {
      setScrollDirection('up');
    }
    
    lastScrollY = currentScrollY;
    setScrollY(currentScrollY);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set scrolling to false after scroll stops
    scrollTimeout = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [handleScroll]);

  return {
    scrollY,
    scrollDirection,
    isScrolling
  };
}

/**
 * Hook to check if an element is in viewport
 */
export function useInViewport(ref, options = {}) {
  const [isInViewport, setIsInViewport] = useState(false);
  const [hasBeenInViewport, setHasBeenInViewport] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasBeenInViewport(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        ...options
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options.threshold, options.rootMargin]);

  return { isInViewport, hasBeenInViewport };
}