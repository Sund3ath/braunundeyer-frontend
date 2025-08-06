import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEnterSite = () => {
    setIsAnimating(true);
    // Navigate after animation completes - optimized timing
    setTimeout(() => {
      navigate('/homepage');
    }, 3500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(255,255,255,0.03) 0%, transparent 50%)
        `,
        backgroundSize: '200px 200px, 300px 300px'
      }}></div>
      
      {/* Subtle animated background elements */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Mouse follower effect */}
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(192,192,192,0.1) 0%, transparent 70%)",
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />

      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >

        {/* Minimal logo design */}
        <motion.div 
          className="mb-20"
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
        >
          {/* Main company name with underline */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="text-lg sm:text-xl md:text-2xl font-thin text-white tracking-[0.2em] sm:tracking-[0.3em] mb-3">
                b r a u n   &   e y e r
              </h1>
              {/* Underline */}
              <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white"></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-thin text-white tracking-[0.2em] sm:tracking-[0.3em] mt-6">
              a r c h i t e k t e n
            </p>
          </div>
          
          {/* Bottom section with architektur and design - responsive design with animation */}
          <motion.div 
            className="relative w-screen h-6 sm:h-8"
            animate={{
              y: isAnimating ? -window.innerHeight/2 + 32 : 0, // Move to top of screen (navbar position)
              scale: isAnimating ? 1.05 : 1, // Slight scale for emphasis
              filter: isAnimating ? "blur(0px)" : "blur(0px)"
            }}
            transition={{
              duration: isAnimating ? 1.4 : 0,
              delay: isAnimating ? 0.3 : 0,
              ease: isAnimating ? [0.87, 0, 0.13, 1] : "linear" // More dramatic ease for the main element
            }}
          >
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="flex items-center">
                <motion.span 
                  className="text-sm sm:text-lg md:text-xl font-thin text-white tracking-[0.15em] sm:tracking-[0.25em] z-10"
                  animate={{
                    opacity: isAnimating ? 0 : 1,
                    x: isAnimating ? -50 : 0,
                    filter: isAnimating ? "blur(4px)" : "blur(0px)"
                  }}
                  transition={{
                    duration: isAnimating ? 0.8 : 0.5,
                    delay: isAnimating ? 0.1 : 0.5,
                    ease: isAnimating ? [0.76, 0, 0.24, 1] : "easeOut"
                  }}
                >
                  a r c h i t e k t u r
                </motion.span>
                <motion.span 
                  className="text-sm sm:text-lg md:text-xl font-thin text-gray-800 tracking-[0.15em] sm:tracking-[0.25em] ml-4 sm:ml-8 z-10"
                  animate={{
                    opacity: isAnimating ? 0 : 1,
                    x: isAnimating ? 50 : 0,
                    filter: isAnimating ? "blur(4px)" : "blur(0px)"
                  }}
                  transition={{
                    duration: isAnimating ? 0.8 : 0.5,
                    delay: isAnimating ? 0.2 : 0.5,
                    ease: isAnimating ? [0.76, 0, 0.24, 1] : "easeOut"
                  }}
                >
                  d e s i g n
                </motion.span>
              </div>
            </div>
            <motion.div 
              className="absolute bg-white h-6 sm:h-8 top-0" 
              style={{ 
                left: 'calc(50% + 30px)', 
                right: '0' 
              }}
              initial={{
                width: '0%',
                opacity: 0,
                boxShadow: "0 0 0 rgba(255,255,255,0)"
              }}
              animate={{
                left: isAnimating ? '0' : 'calc(50% + 30px)',
                width: isAnimating ? '100vw' : 'auto',
                opacity: isAnimating ? 1 : 1,
                y: 0, // Keep at same level, parent container moves it
                height: isAnimating ? '64px' : '24px', // Match navbar height
                boxShadow: isAnimating ? "0 0 50px rgba(255,255,255,0.3)" : "0 0 0 rgba(255,255,255,0)"
              }}
              transition={{
                width: { duration: 0.8, delay: 2.0, ease: "easeOut" }, // Initial grow animation
                opacity: { duration: 0.5, delay: 1.8 },
                left: { duration: 1.4, delay: isAnimating ? 0.4 : 0, ease: [0.87, 0, 0.13, 1] }, // More dramatic for flying
                height: { duration: 1.4, delay: isAnimating ? 0.4 : 0, ease: [0.87, 0, 0.13, 1] },
                boxShadow: { duration: 1.4, delay: isAnimating ? 0.4 : 0, ease: "easeOut" }
              }}
            />
          </motion.div>
        </motion.div>

        {/* Modern Enter button with cursor interaction */}
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
            delay: isAnimating ? 0 : 1.8,
            ease: isAnimating ? [0.76, 0, 0.24, 1] : "easeOut"
          }}
          className="relative"
        >
          <motion.button
            onClick={handleEnterSite}
            className="group relative overflow-hidden px-8 sm:px-12 py-2 sm:py-3 bg-transparent border border-white/30 text-white text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-thin transition-all duration-500 hover:border-white hover:bg-white/5"
            whileHover={{ 
              scale: 1.02,
              y: -2
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
            {/* Cursor follower inside button */}
            <motion.div
              className="absolute w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
                left: mousePosition.x - 64,
                top: mousePosition.y - 64,
              }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
            />
            
            {/* Text with sliding effect */}
            <span className="relative z-10 block overflow-hidden">
              <motion.span
                className="block"
                whileHover={{ y: -30 }}
                transition={{ duration: 0.3 }}
              >
                Enter the Page
              </motion.span>
              <motion.span
                className="absolute top-0 left-0 block"
                initial={{ y: 30 }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Enter the Page
              </motion.span>
            </span>
            
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 border border-white/0"
              whileHover={{
                borderColor: "rgba(255, 255, 255, 0.6)",
                boxShadow: "0 0 25px rgba(255,255,255,0.15)"
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/40 transition-all duration-300 group-hover:border-white/80"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 transition-all duration-300 group-hover:border-white/80"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/40 transition-all duration-300 group-hover:border-white/80"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/40 transition-all duration-300 group-hover:border-white/80"></div>
          </motion.button>
        </motion.div>

        {/* Bottom accent */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isAnimating ? 0 : 1,
            y: isAnimating ? 100 : 0
          }}
          transition={{ 
            duration: isAnimating ? 0.8 : 1, 
            delay: isAnimating ? 0 : 2.2 
          }}
        >
          <motion.div 
            className="w-1 h-16 bg-gradient-to-t from-gray-600 to-transparent"
            animate={{ 
              height: [64, 48, 64],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
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
                    {/* Logo placeholder */}
                    <motion.div 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 1.8,
                        ease: "easeOut"
                      }}
                    >
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-black rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-white"></div>
                      </div>
                      <div className="font-thin text-lg lg:text-xl text-black tracking-wider">
                        Braun & Eyer
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