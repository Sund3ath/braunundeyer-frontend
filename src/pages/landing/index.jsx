import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const containerRef = useRef(null);
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Update time for dynamic elements
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);
  
  // Calculate parallax values based on mouse position
  const parallaxX = (mousePosition.x - window.innerWidth / 2) * 0.02;
  const parallaxY = (mousePosition.y - window.innerHeight / 2) * 0.02;

  const handleEnterSite = () => {
    setIsAnimating(true);
    // Navigate after animation completes - optimized timing
    setTimeout(() => {
      navigate('/de/homepage');
    }, 3500);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(255, 255, 255, 0.08) 0%, 
            transparent 40%),
          linear-gradient(135deg, 
            #000000 0%, 
            #1a1a1a 25%, 
            #000000 50%, 
            #1a1a1a 75%, 
            #000000 100%)
        `,
        backgroundSize: '400% 400%',
        backgroundColor: '#000000',
        animation: 'gradientShift 15s ease infinite'
      }}
    >
      {/* Architectural grid overlay - represents precision and structure */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)
          `,
          backgroundSize: '50px 50px, 50px 50px, 100px 100px, 100px 100px',
          transform: `perspective(1000px) rotateX(60deg) translateZ(${parallaxY}px)`,
          transformOrigin: 'center center',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Floating geometric shapes - represents modern architecture */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              width: `${100 + i * 20}px`,
              height: `${100 + i * 20}px`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div 
              className="w-full h-full"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                background: `linear-gradient(45deg, 
                  rgba(255,255,255,0.02) 0%, 
                  rgba(255,255,255,0.05) 50%, 
                  rgba(255,255,255,0.02) 100%)`,
                clipPath: i % 2 === 0 
                  ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond
                  : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon
                boxShadow: '0 0 20px rgba(255,255,255,0.1)'
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Dynamic light beams - represents light in architecture */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`beam-${i}`}
            className="absolute h-full"
            style={{
              width: '2px',
              background: `linear-gradient(to bottom, 
                transparent 0%, 
                rgba(255, 255, 255, 0.6) 50%, 
                transparent 100%)`,
              left: `${30 + i * 20}%`,
              filter: 'blur(1px)',
            }}
            animate={{
              x: [-100, window.innerWidth],
              opacity: [0, 0.3, 0.3, 0],
            }}
            transition={{
              duration: 8,
              delay: i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Particles system - represents building materials */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              x: [-10, 10],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Advanced mouse follower with ripple effect */}
      <AnimatePresence>
        <motion.div
          className="absolute pointer-events-none mix-blend-screen"
          style={{
            width: '400px',
            height: '400px',
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 150 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `
                radial-gradient(circle at center, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.08) 30%,
                  transparent 70%)
              `,
              filter: 'blur(2px)',
              mixBlendMode: 'screen'
            }}
          />
          {/* Inner glow */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)',
              animation: 'pulse 2s ease-in-out infinite',
              boxShadow: '0 0 40px rgba(255,255,255,0.1)'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >

        {/* Enhanced logo design with architectural elements */}
        <motion.div 
          className="mb-20 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isAnimating ? 0 : 1, 
            y: isAnimating ? -180 : 0,
            scale: isAnimating ? 0.7 : 1,
            filter: isAnimating ? "blur(2px)" : "blur(0px)"
          }}
          transition={{ 
            duration: isAnimating ? 1.2 : 0.8, 
            delay: isAnimating ? 0.1 : 1.2,
            ease: isAnimating ? [0.76, 0, 0.24, 1] : "easeOut"
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Architectural frame elements */}
          <motion.div 
            className="absolute -top-20 -left-20 w-40 h-40 border-l-2 border-t-2 border-white/10"
            animate={{
              opacity: isHovering ? 0.3 : 0.1,
              scale: isHovering ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-40 h-40 border-r-2 border-b-2 border-white/10"
            animate={{
              opacity: isHovering ? 0.3 : 0.1,
              scale: isHovering ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
          />
          {/* Enhanced typography with dynamic effects */}
          <div className="text-center mb-12">
            <div className="relative inline-block group">
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-[0.3em] sm:tracking-[0.4em] mb-1 relative z-10"
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontWeight: 400,
                  textShadow: '0 0 30px rgba(255,255,255,0.1)',
                }}
              >
                {/* Split text for individual letter animations */}
                {['b','r','a','u','n',' ','&',' ','e','y','e','r'].map((letter, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.5 + (i * 0.05),
                      ease: "easeOut"
                    }}
                    whileHover={{
                      y: -5,
                      textShadow: '0 0 20px rgba(255,255,255,0.8)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.h1>
              
              {/* Dynamic underline with gradient - reduced gap */}
              <motion.div 
                className="absolute -bottom-0.5 h-[2px] overflow-hidden"
                style={{
                  left: '-10%',
                  right: '-10%',
                  width: '120%',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
              >
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), rgba(255,255,255,1), rgba(255,255,255,0.8), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s infinite linear',
                    boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                  }}
                />
              </motion.div>
            </div>
            
            <motion.p 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white/90 tracking-[0.46em] sm:tracking-[0.52em] mt-2 relative"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400,
                marginLeft: '0.2em',
              }}
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.52em' }}
              transition={{ duration: 1, delay: 2.5 }}
            >
              architekten
            </motion.p>
          </div>
          
          {/* Innovative split design element */}
          <motion.div 
            className="relative flex items-center justify-center mt-16 mb-8"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isAnimating ? 0 : 1,
              y: isAnimating ? -window.innerHeight/2 + 32 : 0,
            }}
            transition={{
              duration: isAnimating ? 1.4 : 0.8,
              delay: isAnimating ? 0.3 : 2.8,
              ease: isAnimating ? [0.87, 0, 0.13, 1] : "easeOut"
            }}
          >
            {/* Dual concept visualization with innovative layout */}
            <div className="flex items-center gap-8 relative">
              {/* Historic Architecture Side */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span 
                  className="text-lg sm:text-xl md:text-2xl font-normal text-white/80 tracking-[0.25em] relative z-10"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 400,
                  }}
                >
                  architektur
                </motion.span>
                {/* Historic pattern overlay */}
                <div 
                  className="absolute -inset-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, 
                        transparent, 
                        transparent 10px, 
                        rgba(255,255,255,0.1) 10px, 
                        rgba(255,255,255,0.1) 20px)
                    `,
                  }}
                />
              </motion.div>
              
              {/* Center divider - architectural column */}
              <motion.div 
                className="relative h-20 w-[2px] bg-gradient-to-b from-transparent via-white/40 to-transparent"
                animate={{
                  scaleY: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Modern Design Side */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span 
                  className="text-lg sm:text-xl md:text-2xl font-normal text-white/80 tracking-[0.25em] relative z-10"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 400,
                  }}
                >
                  design
                </motion.span>
                {/* Modern geometric overlay */}
                <motion.div 
                  className="absolute -inset-4 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div 
                    className="w-full h-full"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                      filter: 'blur(1px)'
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Revolutionary Enter button with liquid metal effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isAnimating ? 0 : 1, 
            y: isAnimating ? 80 : 0,
            scale: isAnimating ? 0.6 : 1,
            filter: isAnimating ? "blur(8px)" : "blur(0px)"
          }}
          transition={{ 
            duration: isAnimating ? 1.0 : 0.8, 
            delay: isAnimating ? 0 : 3.5,
            ease: isAnimating ? [0.76, 0, 0.24, 1] : "easeOut"
          }}
          className="relative mt-20"
        >
          <motion.button
            onClick={handleEnterSite}
            className="group relative px-20 sm:px-24 py-3 sm:py-4 bg-transparent text-white text-xs sm:text-sm tracking-[0.35em] sm:tracking-[0.4em] font-normal transition-all duration-700"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400,
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'transparent',
            }}
            whileHover={{ 
              scale: 1.02,
              borderColor: 'rgba(255,255,255,0.8)',
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={(e) => {
              const rect = e.target.getBoundingClientRect();
              setMousePosition({ 
                x: e.clientX - rect.left, 
                y: e.clientY - rect.top 
              });
            }}
            onMouseMove={(e) => {
              const rect = e.target.getBoundingClientRect();
              setMousePosition({ 
                x: e.clientX - rect.left, 
                y: e.clientY - rect.top 
              });
            }}
          >
            {/* Architectural grid lines on hover */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            >
              {/* Vertical lines */}
              <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/20" />
              <div className="absolute right-4 top-0 bottom-0 w-[1px] bg-white/20" />
              {/* Horizontal lines */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/10" />
            </motion.div>
            
            {/* Clean text with architectural line */}
            <div className="relative z-10 flex items-center justify-center">
              <span className="uppercase">ENTER</span>
              <motion.div 
                className="mx-6 h-[1px] bg-white/60 transition-all duration-500"
                initial={{ width: '40px' }}
                whileHover={{ width: '60px' }}
              />
              <span className="uppercase">SPACE</span>
            </div>
            
            {/* Minimal corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 group-hover:border-white/60 transition-colors duration-300" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 group-hover:border-white/60 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 group-hover:border-white/60 transition-colors duration-300" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 group-hover:border-white/60 transition-colors duration-300" />
          </motion.button>
        </motion.div>

        {/* Full screen page skeleton with gradual color transition */}
        {isAnimating && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ 
              opacity: 0,
              backgroundColor: "rgba(17, 24, 39, 1)" // dark gray-900
            }}
            animate={{ 
              opacity: 1,
              backgroundColor: "rgba(249, 250, 251, 1)" // light gray background like main page
            }}
            transition={{
              opacity: { duration: 1.0, delay: 1.5, ease: "easeOut" },
              backgroundColor: { duration: 2.5, delay: 2.0, ease: [0.87, 0, 0.13, 1] }
            }}
          >
            <div className="h-full w-full flex flex-col">
              {/* Real navbar structure that the white bar transforms into */}
              <motion.header 
                className="h-16 lg:h-20 w-full fixed top-0 left-0 right-0 z-100"
                initial={{ 
                  opacity: 0,
                  backgroundColor: "rgba(255, 255, 255, 1)" // Start as white (the flying bar)
                }}
                animate={{ 
                  opacity: 1,
                  backgroundColor: "rgba(255, 255, 255, 1)" // Stay white like real navbar
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 1.2, ease: "easeOut" },
                  backgroundColor: { duration: 1.2, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }
                }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo placeholder - matching the actual header design */}
                    <motion.div 
                      className="group transition-smooth relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 1.8,
                        ease: "easeOut"
                      }}
                    >
                      <div className="bg-black px-6 lg:px-8 text-center relative z-10 mt-3 mb-3" style={{ paddingTop: '12px', paddingBottom: '18px', marginBottom: '-12px' }}>
                        <div className="relative inline-block">
                          <div 
                            className="text-sm lg:text-base font-normal text-white tracking-[0.3em] lg:tracking-[0.4em] mb-0"
                            style={{
                              fontFamily: "'Times New Roman', Times, serif",
                              fontWeight: 400,
                            }}
                          >
                            braun & eyer
                          </div>
                          {/* Underline - extended */}
                          <div 
                            className="absolute -bottom-0 h-[1px] bg-white"
                            style={{
                              left: '-5%',
                              right: '-5%',
                              width: '110%',
                            }}
                          ></div>
                        </div>
                        <div 
                          className="text-sm lg:text-base font-normal text-white tracking-[0.38em] lg:tracking-[0.52em] mt-0"
                          style={{
                            fontFamily: "'Times New Roman', Times, serif",
                            fontWeight: 400,
                            marginLeft: '0.2em',
                          }}
                        >
                          architekten
                        </div>
                      </div>
                    </motion.div>

                    {/* Navigation placeholder */}
                    <motion.div 
                      className="hidden lg:flex items-center space-x-8"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 2.0,
                        ease: "easeOut"
                      }}
                    >
                      {['Startseite', 'Projekte', 'Über uns', 'Leistungen', 'Kontakt'].map((item, index) => (
                        <div 
                          key={item}
                          className="h-3 bg-gray-400 rounded"
                          style={{ width: `${item.length * 8}px` }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.header>
              
              {/* Content skeleton covering full screen with gradual appearance */}
              <div className="flex-1 w-full pt-16 lg:pt-20 p-8">
                <motion.div 
                  className="space-y-6 max-w-7xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 2.2,
                    ease: "easeOut"
                  }}
                >
                  {/* Hero section skeleton */}
                  <div className="space-y-4">
                    <motion.div 
                      className="h-8 rounded w-2/3"
                      initial={{ backgroundColor: "rgba(75, 85, 99, 0.3)" }}
                      animate={{ backgroundColor: "rgba(209, 213, 219, 1)" }}
                      transition={{ duration: 1, delay: 2.5 }}
                    />
                    <motion.div 
                      className="h-6 rounded w-1/2"
                      initial={{ backgroundColor: "rgba(75, 85, 99, 0.3)" }}
                      animate={{ backgroundColor: "rgba(209, 213, 219, 1)" }}
                      transition={{ duration: 1, delay: 2.7 }}
                    />
                  </div>
                  
                  {/* Hero image skeleton */}
                  <motion.div 
                    className="h-64 md:h-96 rounded-lg w-full"
                    initial={{ backgroundColor: "rgba(75, 85, 99, 0.3)" }}
                    animate={{ backgroundColor: "rgba(209, 213, 219, 1)" }}
                    transition={{ duration: 1, delay: 2.9 }}
                  />
                  
                  {/* Content grid skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i}
                        className="h-32 rounded"
                        initial={{ backgroundColor: "rgba(75, 85, 99, 0.3)" }}
                        animate={{ backgroundColor: "rgba(209, 213, 219, 1)" }}
                        transition={{ duration: 1, delay: 3.0 + (i * 0.1) }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Landing;