'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorTrail = () => {
  const [mouseHistory, setMouseHistory] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let localCounter = 0;
    const handleMouseMove = (e) => {
      setIsVisible(true);
      localCounter++;
      const uniqueId = `${Date.now()}-${localCounter}`;
      setMouseHistory(prev => {
        const newHistory = [...prev, { x: e.clientX, y: e.clientY, id: uniqueId }];
        return newHistory.slice(-8); // Keep only last 8 positions
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setMouseHistory([]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {mouseHistory.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-4 h-4 bg-accent/30 rounded-full"
          style={{
            left: point.x - 8,
            top: point.y - 8
          }}
          initial={{ 
            scale: 1,
            opacity: 0.6
          }}
          animate={{
            scale: 0.5,
            opacity: 0
          }}
          transition={{
            duration: 0.8,
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;