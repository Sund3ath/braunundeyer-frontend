'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * LazySection component that only renders content when it comes into viewport
 * Improves performance by deferring rendering of off-screen content
 */
export default function LazySection({ 
  children, 
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
  className = '',
  animateIn = true,
  once = true // Only trigger animation once
}) {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            setHasBeenInView(true);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once]);

  const shouldRender = once ? hasBeenInView : isInView;

  return (
    <div ref={sectionRef} className={className}>
      {!shouldRender && fallback ? (
        fallback
      ) : shouldRender ? (
        animateIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        ) : (
          children
        )
      ) : (
        // Placeholder to maintain layout
        <div style={{ minHeight: '200px' }} />
      )}
    </div>
  );
}