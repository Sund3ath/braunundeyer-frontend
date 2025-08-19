'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

export default function FloatingTypography({ words = [], variant = 'default' }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth);
      mouseY.set((clientY - innerHeight / 2) / innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Default words if none provided - spread across viewport
  const defaultWords = variant === 'contact' 
    ? [
        { text: 'kontakt', size: 'text-[20vw] md:text-[15vw] lg:text-[10vw]', x: -5, y: 5, z: 0.2, blur: 0 },
        { text: 'dialog', size: 'text-[18vw] md:text-[13vw] lg:text-[8vw]', x: 65, y: 15, z: 0.5, blur: 0 },
        { text: 'gespräch', size: 'text-[19vw] md:text-[14vw] lg:text-[9vw]', x: 25, y: 35, z: 0.3, blur: 0 },
        { text: 'beratung', size: 'text-[16vw] md:text-[12vw] lg:text-[7vw]', x: 5, y: 55, z: 0.4, blur: 0 },
        { text: 'meeting', size: 'text-[15vw] md:text-[11vw] lg:text-[7vw]', x: 60, y: 72, z: 0.6, blur: 0 },
        { text: 'austausch', size: 'text-[17vw] md:text-[12vw] lg:text-[8vw]', x: 30, y: 88, z: 0.5, blur: 0 },
      ]
    : [
        { text: 'architektur', size: 'text-[18vw] md:text-[14vw] lg:text-[9vw]', x: -10, y: 3, z: 0.3, blur: 0 },
        { text: 'design', size: 'text-[16vw] md:text-[12vw] lg:text-[8vw]', x: 65, y: 12, z: 0.5, blur: 0 },
        { text: 'innovation', size: 'text-[17vw] md:text-[13vw] lg:text-[8vw]', x: 20, y: 28, z: 0.2, blur: 0 },
        { text: 'vision', size: 'text-[15vw] md:text-[11vw] lg:text-[7vw]', x: 70, y: 45, z: 0.4, blur: 0 },
        { text: 'raum', size: 'text-[14vw] md:text-[10vw] lg:text-[6vw]', x: 10, y: 60, z: 0.6, blur: 0 },
        { text: 'zukunft', size: 'text-[16vw] md:text-[12vw] lg:text-[7vw]', x: 55, y: 75, z: 0.3, blur: 0 },
        { text: 'form', size: 'text-[13vw] md:text-[10vw] lg:text-[6vw]', x: 25, y: 90, z: 0.5, blur: 0 },
      ];
  
  const floatingWords = words.length > 0 ? words : defaultWords;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ 
        zIndex: 1,
      }}
    >
      
      {floatingWords.map((word, index) => {
        // Create subtle parallax transforms for each word based on z-depth
        const yParallax = useTransform(
          scrollYProgress,
          [0, 1],
          [0, word.z * 200]
        );
        
        // No horizontal parallax to keep text aligned
        const xParallax = 0;
        
        const opacity = useTransform(
          scrollYProgress,
          [0, 0.2, 0.8, 1],
          [0.15, 0.12, 0.10, 0.08]
        );
        
        const scale = useTransform(
          scrollYProgress,
          [0, 1],
          [1, 1 + word.z * 0.5]
        );
        
        // No rotation - keep text straight
        const rotateZ = 0;

        return (
          <motion.div
            key={`${word.text}-${index}`}
            className={`absolute ${word.size} font-light select-none whitespace-nowrap tracking-tight lowercase leading-none`}
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              y: yParallax,
              x: xParallax,
              opacity,
              scale,
              rotateZ,
              filter: `blur(${word.blur}px)`,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              zIndex: -1,
            }}
          >
            <motion.div
              style={{
                x: useTransform(mouseXSpring, (value) => value * 15 * word.z),
                y: useTransform(mouseYSpring, (value) => value * 15 * word.z),
              }}
              animate={{
                x: [0, 10 * word.z, -10 * word.z, 0],
                y: [0, -5 * word.z, 5 * word.z, 0],
              }}
              transition={{
                duration: 30 + index * 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span
                style={{
                  color: 'rgb(156, 163, 175)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  fontWeight: '300',
                  letterSpacing: '-0.05em',
                  fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
                }}
              >
                {word.text}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
      
      {/* Additional atmospheric elements */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`atmosphere-${i}`}
            className="absolute w-full h-full"
            style={{
              background: `radial-gradient(circle at ${50 + i * 20}% ${50 + i * 15}%, rgba(156, 163, 175, 0.03) 0%, transparent 50%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}