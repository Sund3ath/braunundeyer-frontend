import React from 'react';
import { motion } from 'framer-motion';

const ContentBackgroundTypography = ({ words = [], className = "" }) => {
  // Animation configurations for different word sizes
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

  // Default words for content areas
  const defaultWords = words.length > 0 ? words : [
    { 
      text: "ARCHITEKTUR", 
      size: "text-[12rem]", 
      opacity: "opacity-[0.08]", 
      position: { left: "-5%", top: "10%" },
      animation: "large",
      delay: 0 
    },
    { 
      text: "DESIGN", 
      size: "text-8xl", 
      opacity: "opacity-[0.10]", 
      position: { right: "-8%", top: "40%" },
      animation: "medium",
      delay: 3 
    },
    { 
      text: "INNOVATION", 
      size: "text-6xl", 
      opacity: "opacity-[0.09]", 
      position: { left: "85%", top: "70%" },
      animation: "small",
      delay: 5 
    }
  ];

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none ${className}`}>
      {defaultWords.map((word, index) => {
        const animationConfig = animationPresets[word.animation || 'medium'];
        
        return (
          <motion.div
            key={`bg-word-${index}`}
            className={`absolute ${word.size} font-thin select-none whitespace-nowrap`}
            style={{
              ...word.position,
              color: 'rgba(0, 0, 0, 0.06)',
              WebkitTextStroke: '1px rgba(0, 0, 0, 0.03)',
              textShadow: '0 0 30px rgba(0, 0, 0, 0.05)',
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

export default ContentBackgroundTypography;