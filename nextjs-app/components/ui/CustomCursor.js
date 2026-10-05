'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mouseHistory, setMouseHistory] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let localCounter = 0;
    const handleMouseMove = (e) => {
      setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      localCounter++;
      const uniqueId = `${Date.now()}-${localCounter}`;
      setMouseHistory(prev => {
        const newHistory = [...prev, { x: e.clientX, y: e.clientY, id: uniqueId }];
        return newHistory.slice(-12); // Keep only last 12 positions for smoother trail
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setMouseHistory([]);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Add custom-cursor class to body
    document.body.classList.add('custom-cursor');

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style jsx global>{`
        .custom-cursor {
          cursor: none;
        }
        .custom-cursor * {
          cursor: none !important;
        }
      `}</style>
      
      {/* Trail effect */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {mouseHistory.map((point, index) => (
          <motion.div
            key={point.id}
            className="absolute rounded-full"
            style={{
              left: point.x,
              top: point.y,
              width: 12 - index * 0.5,
              height: 12 - index * 0.5,
              background: `radial-gradient(circle, rgba(5, 150, 105, ${0.8 - index * 0.06}) 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ 
              scale: 1,
              opacity: 0.8
            }}
            animate={{
              scale: 0.3,
              opacity: 0
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Main cursor dot */}
        <motion.div
          className="absolute w-2 h-2 bg-accent rounded-full"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 10001
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;