'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, AnimatePresence, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Home, Building2, Palette, TreePine, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedText from '@/components/ui/AnimatedText';

export default function HomepageClient({ 
  heroSlides: initialHeroSlides, 
  featuredProjects: initialFeaturedProjects,
  dict 
}) {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang || 'de';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [waterDrops, setWaterDrops] = useState([]);
  const [ripples, setRipples] = useState([]);
  const waterDropIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  
  // Custom cursor motion values with enhanced spring
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Background text parallax
  const scrollY = useMotionValue(0);
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200]);

  // Use API data or fallback to default - process image URLs
  const processImageUrl = (url) => {
    // Handle null, undefined, empty strings, and whitespace-only strings
    if (!url || url === '' || url === null || url === undefined || (typeof url === 'string' && url.trim() === '')) {
      return null;
    }
    // If it's already a full URL, use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's a relative path, prepend the backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const heroSlides = initialHeroSlides?.length > 0 ? initialHeroSlides.map(slide => ({
    ...slide,
    image: processImageUrl(slide.image),
    video: processImageUrl(slide.video)
  })) : [
    {
      id: 1,
      image: processImageUrl("/images/alt_neu_ungestaltung.png"),
      video: processImageUrl("/images/hero_modernbuilding_video.mp4"),
      title: dict?.hero?.slide1?.title || 'Architekturbüro Ingenieure',
      subtitle: dict?.hero?.slide1?.subtitle || 'Neubau und Altbausanierung mit Expertise',
      description: dict?.hero?.slide1?.description || 'Wir entwickeln innovative Architekturlösungen'
    },
    {
      id: 2,
      image: processImageUrl("/images/ferienvilla.png"),
      title: dict?.hero?.slide2?.title || 'Neubau',
      subtitle: dict?.hero?.slide2?.subtitle || 'Moderne Architektur für die Zukunft',
      description: dict?.hero?.slide2?.description || 'Zeitgemäße Neubauprojekte'
    },
    {
      id: 3,
      image: processImageUrl("/images/innenarchitektur.png"),
      title: dict?.hero?.slide3?.title || 'Altbausanierung',
      subtitle: dict?.hero?.slide3?.subtitle || 'Behutsame Modernisierung',
      description: dict?.hero?.slide3?.description || 'Fachgerechte Sanierung'
    }
  ];

  const featuredProjects = initialFeaturedProjects?.length > 0 ? initialFeaturedProjects.map(project => ({
    ...project,
    image: processImageUrl(project.image)
  })) : [
    {
      id: 1,
      title: dict?.projects?.items?.project1?.title || 'Modernes Einfamilienhaus',
      type: dict?.projects?.items?.project1?.type || 'Neubau',
      location: dict?.projects?.items?.project1?.location || 'Wohngebiet',
      image: processImageUrl("/images/ferienvilla.png"),
      year: "2024"
    },
    {
      id: 2,
      title: dict?.projects?.items?.project2?.title || 'Historische Villa Sanierung',
      type: dict?.projects?.items?.project2?.type || 'Altbausanierung',
      location: dict?.projects?.items?.project2?.location || 'Altstadt',
      image: processImageUrl("/images/sarnierung_alt_neu.png"),
      year: "2023"
    },
    {
      id: 3,
      title: dict?.projects?.items?.project3?.title || 'Mehrfamilienhaus Neubau',
      type: dict?.projects?.items?.project3?.type || 'Neubau',
      location: dict?.projects?.items?.project3?.location || 'Stadtrand',
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      year: "2024"
    },
    {
      id: 4,
      title: dict?.projects?.items?.project4?.title || 'Bürogebäude Umbau',
      type: dict?.projects?.items?.project4?.type || 'Umbau',
      location: dict?.projects?.items?.project4?.location || 'Gewerbegebiet',
      image: processImageUrl("/images/alt_neu_ungestaltung.png"),
      year: "2023"
    },
    {
      id: 5,
      title: dict?.projects?.items?.project5?.title || 'Energetische Sanierung',
      type: dict?.projects?.items?.project5?.type || 'Sanierung',
      location: dict?.projects?.items?.project5?.location || 'Innenstadt',
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      year: "2024"
    },
    {
      id: 6,
      title: dict?.projects?.items?.project6?.title || 'Neubau Doppelhaus',
      type: dict?.projects?.items?.project6?.type || 'Neubau',
      location: dict?.projects?.items?.project6?.location || 'Neubaugebiet',
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
      year: "2024"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: dict?.testimonials?.testimonial1?.name || "Familie Müller",
      project: dict?.testimonials?.testimonial1?.project || "Einfamilienhaus Neubau",
      text: dict?.testimonials?.testimonial1?.text || "Die Zusammenarbeit war hervorragend. Von der ersten Idee bis zur Fertigstellung wurden wir professionell begleitet.",
      rating: 5
    },
    {
      id: 2,
      name: dict?.testimonials?.testimonial2?.name || "Herr Schmidt",
      project: dict?.testimonials?.testimonial2?.project || "Altbausanierung",
      text: dict?.testimonials?.testimonial2?.text || "Kompetente Beratung und kreative Lösungen. Das Ergebnis übertrifft unsere Erwartungen.",
      rating: 5
    },
    {
      id: 3,
      name: dict?.testimonials?.testimonial3?.name || "Frau Weber",
      project: dict?.testimonials?.testimonial3?.project || "Büroumbau",
      text: dict?.testimonials?.testimonial3?.text || "Professionell, zuverlässig und immer ein offenes Ohr für unsere Wünsche.",
      rating: 5
    }
  ];

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Track mouse position for custom cursor and effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cursorX, cursorY, scrollY]);

  // Water drop animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const dropId = waterDropIdRef.current++;
      const newDrop = {
        id: dropId,
        left: Math.random() * 100,
        animationDuration: 3 + Math.random() * 2,
        size: 20 + Math.random() * 30
      };
      setWaterDrops(prev => [...prev, newDrop]);
      
      setTimeout(() => {
        setWaterDrops(prev => prev.filter(drop => drop.id !== dropId));
      }, newDrop.animationDuration * 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Create ripple effect on click
  const handleCreateRipple = useCallback((e) => {
    const rippleId = rippleIdRef.current++;
    const newRipple = {
      id: rippleId,
      x: e.clientX,
      y: e.clientY + window.scrollY
    };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
    }, 1500);
  }, []);

  // Handle triple-click for admin access
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 500);
    
    if (clickCount === 2) {
      router.push('http://localhost:4029/admin');
      setClickCount(0);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const services = [
    {
      icon: <Home className="w-8 h-8" />,
      title: dict?.services?.residential?.title || "Wohnbau",
      description: dict?.services?.residential?.description || "Individuelle Wohnkonzepte"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: dict?.services?.commercial?.title || "Gewerbebau",
      description: dict?.services?.commercial?.description || "Funktionale Gewerbebauten"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: dict?.services?.interior?.title || "Innenarchitektur",
      description: dict?.services?.interior?.description || "Durchdachte Raumkonzepte"
    },
    {
      icon: <TreePine className="w-8 h-8" />,
      title: dict?.services?.landscape?.title || "Außenanlagen",
      description: dict?.services?.landscape?.description || "Harmonische Außengestaltung"
    }
  ];

  const stats = [
    { value: "500+", label: dict?.stats?.projects || "Projekte" },
    { value: "25+", label: dict?.stats?.years || "Jahre Erfahrung" },
    { value: "100%", label: dict?.stats?.satisfaction || "Kundenzufriedenheit" },
    { value: "15+", label: dict?.stats?.team || "Team Mitglieder" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden custom-cursor" onClick={handleCreateRipple}>
      <style jsx global>{`
        .custom-cursor {
          cursor: none;
        }
        .custom-cursor * {
          cursor: none !important;
        }
        .cursor-dot {
          position: fixed;
          width: 8px;
          height: 8px;
          background-color: #059669;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
        }
        .cursor-ring {
          position: fixed;
          width: 30px;
          height: 30px;
          border: 2px solid #059669;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          opacity: 0.5;
        }
      `}</style>
      
      <Header dict={dict?.translation || dict} lang={lang} />
      
      {/* Custom Cursor */}
      <motion.div
        className="cursor-dot"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div
        className="cursor-ring"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />

      {/* Water Drop Effects */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {waterDrops.map(drop => (
          <div
            key={drop.id}
            className="absolute water-drop-element rounded-full"
            style={{
              left: `${drop.left}%`,
              width: `${drop.size}px`,
              height: `${drop.size}px`,
              animationDuration: `${drop.animationDuration}s`
            }}
          />
        ))}
      </div>

      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px'
          }}
        />
      ))}

      {/* Background Typography Animation */}
      <motion.div 
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        style={{ y: parallaxY }}
      >
        <div className="absolute top-20 left-10 text-[200px] font-bold text-gray-100/20 select-none animate-float">
          ARCHITEKTUR
        </div>
        <div className="absolute bottom-20 right-10 text-[150px] font-bold text-gray-100/20 select-none animate-wave">
          DESIGN
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[100px] font-bold text-gray-100/10 select-none animate-pulse">
          INNOVATION
        </div>
      </motion.div>

      {/* Hero Section with Water Effects - Matching Vite Version */}
      <motion.section 
        className="relative h-screen overflow-hidden z-20 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              animate={{
                scale: index === currentSlide ? 1.05 : 1,
              }}
              transition={{ duration: 5, ease: "linear" }}
            >
              {slide.video && index === 0 ? (
                <video
                  {...(slide.video ? { src: slide.video } : {})}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover shimmer-effect"
                  {...(slide.image ? { poster: slide.image } : {})}
                />
              ) : (
                slide.image ? (
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover shimmer-effect"
                    priority={index === 0}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                )
              )}
              <div className="absolute inset-0 bg-black/50" />
              
              {/* Animated water waves overlay */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full h-2 bg-gradient-to-r from-transparent via-gray-300/20 to-transparent"
                    style={{
                      top: `${20 + i * 30}%`,
                      left: '-100%'
                    }}
                    animate={{
                      x: ['0%', '200%'],
                      opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      delay: i * 1.5,
                      ease: "linear"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <AnimatedText
                text={heroSlides[currentSlide].title}
                className="text-4xl sm:text-5xl lg:text-6xl font-heading font-light text-white mb-6 leading-tight"
                variant="wave"
                delay={0.2}
              />
              <AnimatedText
                text={heroSlides[currentSlide].subtitle}
                className="text-xl sm:text-2xl font-body text-white/90 mb-4"
                variant="slide"
                delay={0.5}
              />
              <AnimatedText
                text={heroSlides[currentSlide].description}
                className="text-lg font-body text-white/80 mb-8 max-w-2xl"
                variant="float"
                delay={0.8}
              />
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(192, 192, 192, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={`/${lang}/projekte`}
                    className="inline-flex items-center justify-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                  >
                    <span>{dict?.hero?.cta?.projects || "Projekte ansehen"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={`/${lang}/kontakt`}
                    className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded transition-all duration-200 hover:bg-white hover:text-black font-body font-medium"
                  >
                    <span>{dict?.hero?.cta?.contact || "Kontakt"}</span>
                    <Mail className="w-5 h-5" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Hero Navigation */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
              aria-label="Previous slide"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <div className="flex space-x-2">
              {heroSlides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
              aria-label="Next slide"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* About Section with Enhanced Animations */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 px-4 relative z-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
              {dict?.about?.title || "Über uns"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {dict?.about?.description || "Mit über 25 Jahren Erfahrung sind wir Ihr zuverlässiger Partner für Neubau und Altbausanierung. Unser Team aus erfahrenen Architekten und Ingenieuren entwickelt innovative Lösungen für Ihre Bauvorhaben."}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="text-primary mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 relative z-10">{service.title}</h3>
                <p className="text-gray-600 relative z-10">{service.description}</p>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Projects with Enhanced Hover Effects */}
      <section className="py-20 px-4 bg-gray-50 relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
              {dict?.projects?.title || "Unsere Projekte"}
            </h2>
            <p className="text-xl text-gray-600">
              {dict?.projects?.subtitle || "Eine Auswahl unserer realisierten Bauvorhaben"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Link href={`/${lang}/projekte/${project.id}`}>
                  <div className="relative h-64 overflow-hidden rounded-t-2xl">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div
                      className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ y: '100%' }}
                      whileHover={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center h-full">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
                        >
                          <ArrowRight className="w-6 h-6 text-primary" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="bg-white p-6 rounded-b-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {project.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </span>
                    </div>
                    <p className="text-primary mt-4 font-medium flex items-center gap-1">
                      {dict?.projects?.viewProject || "Projekt ansehen"}
                      <ArrowRight className="w-4 h-4" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href={`/${lang}/projekte`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
              >
                {dict?.projects?.viewAll || "Alle Projekte ansehen"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Counter Animation */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 bg-primary text-white relative z-20 overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`
          }} />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials with Enhanced Animation */}
      <section className="py-20 px-4 relative z-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
              {dict?.testimonials?.title || "Kundenstimmen"}
            </h2>
            <p className="text-xl text-gray-600">
              {dict?.testimonials?.subtitle || "Was unsere Kunden über uns sagen"}
            </p>
          </motion.div>

          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">★</span>
                  ))}
                </div>
                <p className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].project}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'w-8 bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary-dark text-white relative z-20 overflow-hidden">
        {/* Animated Waves Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 1440 320">
            <motion.path 
              fill="currentColor" 
              fillOpacity="0.3"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
            />
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            {dict?.cta?.title || "Lassen Sie uns Ihr Projekt verwirklichen"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {dict?.cta?.subtitle || "Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch"}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={`/${lang}/kontakt`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                {dict?.cta?.contact || "Kontakt aufnehmen"}
              </motion.button>
            </Link>
            <Link href="tel:+496831000000">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
              >
                {dict?.cta?.call || "Anrufen"}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer dict={dict} lang={lang} />
    </div>
  );
}