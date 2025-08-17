'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BackgroundTypography = ({ 
  words = [], 
  className = "",
  containerClass = "fixed inset-0", // Allow customization of container positioning
  restricted = false // New prop to enable content-area-only mode
}) => {
  // Default animation configurations for different word sizes
  const animationPresets = {
    large: {
      duration: 32,
      x: [0, 40, -20, 0],
      y: [0, -15, 20, 0],
      rotate: [0, 0.8, -1.1, 0],
    },
    medium: {
      duration: 28,
      x: [0, -30, 15, 0],
      y: [0, 12, -22, 0],
      rotate: [0, -0.9, 1.3, 0],
    },
    small: {
      duration: 24,
      x: [0, 25, -12, 0],
      y: [0, -18, 26, 0],
      rotate: [0, 1.2, -0.7, 0],
    }
  };

  // Default words if none provided
  // If restricted mode, adjust positions to avoid hero/footer areas
  const getDefaultWords = () => {
    if (restricted) {
      // Content-area-only positioning (avoiding top 100vh hero and bottom footer)
      return words.length > 0 ? words : [
        { 
          text: "ARCHITEKTUR", 
          size: "text-[12rem]", 
          opacity: "opacity-[0.15]", 
          position: { left: "-5%", top: "calc(100vh + 10%)" }, // Start after hero
          animation: "large",
          delay: 0 
        },
        { 
          text: "DESIGN", 
          size: "text-8xl", 
          opacity: "opacity-[0.18]", 
          position: { right: "-8%", top: "calc(100vh + 40%)" }, // Mid content area
          animation: "medium",
          delay: 3 
        },
        { 
          text: "INNOVATION", 
          size: "text-6xl", 
          opacity: "opacity-[0.16]", 
          position: { left: "85%", top: "calc(100vh + 20%)" }, // Content area
          animation: "small",
          delay: 5 
        }
      ];
    }
    
    // Standard positioning for pages without hero sections
    return words.length > 0 ? words : [
      { 
        text: "ARCHITEKTUR", 
        size: "text-[12rem]", 
        opacity: "opacity-[0.15]", 
        position: { left: "-5%", top: "20%" },
        animation: "large",
        delay: 0 
      },
      { 
        text: "DESIGN", 
        size: "text-8xl", 
        opacity: "opacity-[0.18]", 
        position: { right: "-8%", top: "60%" },
        animation: "medium",
        delay: 3 
      },
      { 
        text: "INNOVATION", 
        size: "text-6xl", 
        opacity: "opacity-[0.16]", 
        position: { left: "85%", top: "10%" },
        animation: "small",
        delay: 5 
      }
    ];
  };
  
  const defaultWords = getDefaultWords();

  // Apply container mask if in restricted mode
  const containerStyles = restricted ? {
    maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 100vh, black calc(100vh + 10%), black calc(100% - 400px), transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 100vh, black calc(100vh + 10%), black calc(100% - 400px), transparent 100%)',
  } : {};

  return (
    <div 
      className={`${containerClass} w-full h-full overflow-hidden pointer-events-none z-[0] ${className}`}
      style={containerStyles}
    >
      {defaultWords.map((word, index) => {
        const animationConfig = animationPresets[word.animation || 'medium'];
        
        return (
          <motion.div
            key={`bg-word-${index}`}
            className={`absolute ${word.size} font-thin select-none whitespace-nowrap`}
            style={{
              ...word.position,
              color: 'rgba(0, 0, 0, 0.12)',
              WebkitTextStroke: '1px rgba(0, 0, 0, 0.05)',
              textShadow: '0 0 30px rgba(0, 0, 0, 0.08)',
              opacity: 1,
              zIndex: 1,
            }}
            animate={{
              x: word.x || animationConfig.x,
              y: word.y || animationConfig.y,
              rotate: word.rotate || animationConfig.rotate,
            }}
            transition={{
              duration: word.duration || animationConfig.duration,
              repeat: Infinity,
              delay: word.delay || index * 2,
              ease: "linear"
            }}
          >
            {word.text}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BackgroundTypography;