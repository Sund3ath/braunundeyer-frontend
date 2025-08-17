'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedText = ({ text, className = '', delay = 0, variant = 'slide' }) => {
  const variants = {
    slide: {
      hidden: { 
        opacity: 0, 
        y: 50 
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          delay,
          ease: [0.6, -0.05, 0.01, 0.99]
        }
      }
    },
    wave: {
      hidden: { 
        opacity: 0 
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay
        }
      }
    },
    float: {
      hidden: { 
        opacity: 0,
        y: 20
      },
      visible: { 
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          delay,
          ease: "easeOut"
        }
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (variant === 'wave') {
    return (
      <motion.div
        className={className}
        variants={variants.wave}
        initial="hidden"
        animate="visible"
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      animate="visible"
    >
      {text}
    </motion.div>
  );
};

export default AnimatedText;