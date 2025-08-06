// src/components/ui/WaterEffect.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WaterEffect = ({ children, className = '' }) => {
  const [ripples, setRipples] = useState([]);
  const [waterDrops, setWaterDrops] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      scale: 0
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1500);
  };

  const createWaterDrop = () => {
    const newDrop = {
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 2
    };
    
    setWaterDrops(prev => [...prev, newDrop]);
    
    // Remove drop after animation
    setTimeout(() => {
      setWaterDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
    }, 4000 + newDrop.delay * 1000);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Create water drops periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        createWaterDrop();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onClick={createRipple}
    >
      {/* Modern water drops */}
      {waterDrops.map(drop => (
        <motion.div
          key={drop.id}
          className="absolute pointer-events-none water-drop-element"
          style={{
            left: `${drop.x}%`,
            width: drop.size,
            height: drop.size,
            top: '-10vh'
          }}
          initial={{
            y: -100,
            scale: 0,
            opacity: 0
          }}
          animate={{
            y: window.innerHeight + 100,
            scale: [0, 1, 1.2],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 4,
            delay: drop.delay,
            ease: "easeIn"
          }}
        />
      ))}

      {/* Enhanced water ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50
          }}
        >
          {/* Main ripple */}
          <motion.div
            className="absolute inset-0 border-2 border-gray-400/40 rounded-full"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 6, 12],
              opacity: [0.8, 0.4, 0]
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut"
            }}
          />
          {/* Secondary ripple */}
          <motion.div
            className="absolute inset-0 border border-gray-300/30 rounded-full"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{
              scale: [0, 4, 8],
              opacity: [0.6, 0.3, 0]
            }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: "easeOut"
            }}
          />
        </motion.div>
      ))}
      
      {/* Floating liquid particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute liquid-morph bg-gray-300/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>
      
      {/* Enhanced cursor trail effect */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          width: 40,
          height: 40
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-gray-400/50"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-gray-300/20"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.3
          }}
        />
      </motion.div>
      
      {children}
    </div>
  );
};

export default WaterEffect;