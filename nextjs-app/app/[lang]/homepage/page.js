'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Home, Building2, Palette, TreePine, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang || 'de';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dict, setDict] = useState({});
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  
  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Load translations
  useEffect(() => {
    import(`@/lib/locales/${lang}/homepage.json`).then(module => {
      setDict(module.default);
    });
    import(`@/lib/locales/${lang}/translation.json`).then(module => {
      setDict(prev => ({ ...prev, translation: module.default }));
    });
  }, [lang]);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const heroSlides = [
    {
      id: 1,
      image: "/images/alt_neu_ungestaltung.png",
      video: "/images/hero_modernbuilding_video.mp4",
      title: dict?.hero?.slide1?.title || 'Architekturbüro Ingenieure',
      subtitle: dict?.hero?.slide1?.subtitle || 'Neubau und Altbausanierung mit Expertise',
      description: dict?.hero?.slide1?.description || 'Wir entwickeln innovative Architekturlösungen'
    },
    {
      id: 2,
      image: "/images/ferienvilla.png",
      title: dict?.hero?.slide2?.title || 'Neubau',
      subtitle: dict?.hero?.slide2?.subtitle || 'Moderne Architektur für die Zukunft',
      description: dict?.hero?.slide2?.description || 'Zeitgemäße Neubauprojekte'
    },
    {
      id: 3,
      image: "/images/innenarchitektur.png",
      title: dict?.hero?.slide3?.title || 'Altbausanierung',
      subtitle: dict?.hero?.slide3?.subtitle || 'Behutsame Modernisierung',
      description: dict?.hero?.slide3?.description || 'Fachgerechte Sanierung'
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: dict?.projects?.items?.project1?.title || 'Modernes Einfamilienhaus',
      type: dict?.projects?.items?.project1?.type || 'Neubau',
      location: dict?.projects?.items?.project1?.location || 'Wohngebiet',
      image: "/images/ferienvilla.png",
      year: "2024"
    },
    {
      id: 2,
      title: dict?.projects?.items?.project2?.title || 'Historische Villa Sanierung',
      type: dict?.projects?.items?.project2?.type || 'Altbausanierung',
      location: dict?.projects?.items?.project2?.location || 'Altstadt',
      image: "/images/sarnierung_alt_neu.png",
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
      title: dict?.projects?.items?.project4?.title || 'Denkmalgeschützte Sanierung',
      type: dict?.projects?.items?.project4?.type || 'Altbausanierung',
      location: dict?.projects?.items?.project4?.location || 'Historisches Zentrum',
      image: "/images/alt_neu_ungestaltung.png",
      year: "2023"
    },
    {
      id: 5,
      title: dict?.projects?.items?.project5?.title || 'Energieeffizientes Wohnhaus',
      type: dict?.projects?.items?.project5?.type || 'Neubau',
      location: dict?.projects?.items?.project5?.location || 'Neubaugebiet',
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      year: "2024"
    },
    {
      id: 6,
      title: dict?.projects?.items?.project6?.title || 'Gründerzeit Modernisierung',
      type: dict?.projects?.items?.project6?.type || 'Altbausanierung',
      location: dict?.projects?.items?.project6?.location || 'Innenstadtbereich',
      image: "/images/innenarchitektur.png",
      year: "2023"
    }
  ];

  const services = [
    {
      id: 1,
      Icon: Home,
      title: dict?.services?.items?.service1?.title || 'Neubau',
      description: dict?.services?.items?.service1?.description || 'Moderne Neubauprojekte'
    },
    {
      id: 2,
      Icon: Building2,
      title: dict?.services?.items?.service2?.title || 'Altbausanierung',
      description: dict?.services?.items?.service2?.description || 'Fachgerechte Sanierung'
    },
    {
      id: 3,
      Icon: Palette,
      title: dict?.services?.items?.service3?.title || 'Ingenieursleistungen',
      description: dict?.services?.items?.service3?.description || 'Umfassende technische Planung'
    },
    {
      id: 4,
      Icon: TreePine,
      title: dict?.services?.items?.service4?.title || 'Energieberatung',
      description: dict?.services?.items?.service4?.description || 'Nachhaltige Lösungen'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: dict?.testimonials?.items?.testimonial1?.name || 'Familie Müller',
      role: dict?.testimonials?.items?.testimonial1?.role || 'Bauherr',
      content: dict?.testimonials?.items?.testimonial1?.content || 'Braun & Eyer hat unsere Vorstellungen perfekt umgesetzt.',
      avatar: "/images/no_image.png"
    },
    {
      id: 2,
      name: dict?.testimonials?.items?.testimonial2?.name || 'Herr Schmidt',
      role: dict?.testimonials?.items?.testimonial2?.role || 'Eigentümer',
      content: dict?.testimonials?.items?.testimonial2?.content || 'Die Sanierung unseres Altbaus wurde mit größter Sorgfalt durchgeführt.',
      avatar: "/images/no_image.png"
    },
    {
      id: 3,
      name: dict?.testimonials?.items?.testimonial3?.name || 'Frau Weber',
      role: dict?.testimonials?.items?.testimonial3?.role || 'Investorin',
      content: dict?.testimonials?.items?.testimonial3?.content || 'Die Zusammenarbeit mit Braun & Eyer war durchweg professionell.',
      avatar: "/images/no_image.png"
    }
  ];

  const clientLogos = [
    { id: 1, name: "TechCorp", logo: "/images/no_image.png" },
    { id: 2, name: "GreenBuild", logo: "/images/no_image.png" },
    { id: 3, name: "UrbanDev", logo: "/images/no_image.png" },
    { id: 4, name: "ModernLiving", logo: "/images/no_image.png" }
  ];

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Handle triple-click on footer copyright
  const handleCopyrightClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    if (newClickCount === 3) {
      router.push(`/${lang}/admin`);
      setClickCount(0);
      return;
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 500);
  };

  return (
    <motion.div 
      className="min-h-screen custom-cursor relative overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: hasEntered ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
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
          background-color: rgb(192, 192, 192);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed;
          width: 32px;
          height: 32px;
          border: 2px solid rgba(192, 192, 192, 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
        }
        .shimmer-effect {
          animation: shimmer 15s infinite;
        }
        @keyframes shimmer {
          0%, 100% { filter: brightness(1) contrast(1); }
          50% { filter: brightness(1.05) contrast(1.05); }
        }
      `}</style>
      
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hasEntered ? 0 : -100, opacity: hasEntered ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <Header dict={dict.translation} lang={lang} />
      </motion.div>
      
      {/* Custom Cursor */}
      <motion.div
        className="cursor-dot"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div
        className="cursor-ring"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      
      {/* Enhanced Hero Section */}
      <motion.section 
        className="relative h-screen overflow-hidden bg-background pt-20 lg:pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hasEntered ? 1 : 0, y: hasEntered ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
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
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover shimmer-effect"
                  poster={slide.image}
                />
              ) : (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover shimmer-effect"
                  priority={index === 0}
                />
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
              <motion.h1
                key={`title-${currentSlide}`}
                className="text-4xl sm:text-5xl lg:text-6xl font-heading font-light text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.h2
                key={`subtitle-${currentSlide}`}
                className="text-xl sm:text-2xl font-body text-white/90 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {heroSlides[currentSlide].subtitle}
              </motion.h2>
              <motion.p
                key={`desc-${currentSlide}`}
                className="text-lg font-body text-white/80 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {heroSlides[currentSlide].description}
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
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
                    <span>{dict?.hero?.cta?.projects || 'Unsere Arbeiten'}</span>
                    <ArrowRight size={20} />
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
                    <span>{dict?.hero?.cta?.start || 'Projekt Starten'}</span>
                    <Mail size={20} />
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
              <ChevronLeft size={24} />
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
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* Featured Projects Section */}
      <motion.section 
        className="py-16 lg:py-24 bg-background relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
              {dict?.projects?.title || 'Ausgewählte Projekte'}
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              {dict?.projects?.subtitle || 'Entdecken Sie unsere neuesten Architekturprojekte'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.1
                }}
              >
                <Link
                  href={`/${lang}/projekte/${project.id}`}
                  className="group bg-surface rounded border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      className="relative h-full"
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                    <div className="absolute top-4 left-4">
                      <motion.span 
                        className="bg-accent text-white px-3 py-1 rounded text-sm font-body font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        {project.type}
                      </motion.span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-white/90 text-primary px-3 py-1 rounded text-sm font-body font-medium">
                        {project.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-medium text-primary mb-2 group-hover:text-accent transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-text-secondary font-body flex items-center">
                      <MapPin size={16} className="mr-2" />
                      {project.location}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${lang}/projekte`}
                className="inline-flex items-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
              >
                <span>{dict?.projects?.viewAll || 'Alle Projekte Ansehen'}</span>
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Overview */}
      <motion.section 
        className="py-16 lg:py-24 bg-surface relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
              {dict?.services?.title || 'Unsere Leistungen'}
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              {dict?.services?.subtitle || 'Von der ersten Idee bis zur Fertigstellung'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-background rounded border border-border p-8 text-center hover:shadow-lg transition-all duration-300 group"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.1
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10
                }}
              >
                <motion.div 
                  className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <service.Icon size={32} className="text-accent group-hover:text-white" />
                </motion.div>
                <h3 className="text-xl font-heading font-medium text-primary mb-4">
                  {service.title}
                </h3>
                <p className="text-text-secondary font-body">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${lang}/leistungen`}
                className="inline-flex items-center space-x-2 border-2 border-accent text-accent px-8 py-4 rounded transition-all duration-200 hover:bg-accent hover:text-black font-body font-medium"
              >
                <span>{dict?.services?.viewMore || 'Mehr Erfahren'}</span>
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Preview */}
      <motion.section 
        className="py-16 lg:py-24 bg-background relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
                {dict?.philosophy?.title || 'Unsere Philosophie'}
              </h2>
              <p className="text-lg font-body text-text-secondary mb-6">
                {dict?.philosophy?.text1 || 'Bei Braun & Eyer verstehen wir Architektur als die perfekte Balance zwischen Form, Funktion und Nachhaltigkeit.'}
              </p>
              <p className="text-lg font-body text-text-secondary mb-8">
                {dict?.philosophy?.text2 || 'Mit langjähriger Erfahrung in Neubau und Altbausanierung haben wir uns einen Namen für außergewöhnliche Architekturlösungen gemacht.'}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/${lang}/uber-uns`}
                  className="inline-flex items-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                >
                  <span>{dict?.philosophy?.cta || 'Über Unser Team'}</span>
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative h-96 lg:h-[500px]"
              >
                <Image
                  src="/images/howtolook.jpg"
                  alt="Architectural design process"
                  fill
                  className="object-cover rounded"
                />
              </motion.div>
              <motion.div 
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent rounded opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-primary rounded opacity-10"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Client Testimonials */}
      <motion.section 
        className="py-16 lg:py-24 bg-surface relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
              {dict?.testimonials?.title || 'Was Unsere Kunden Sagen'}
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              {dict?.testimonials?.subtitle || 'Vertrauen Sie nicht nur unserem Wort.'}
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden relative min-h-[320px]">
              <AnimatePresence mode="wait">
                {testimonials.map((testimonial, index) => (
                  index === currentTestimonial && (
                    <motion.div
                      key={testimonial.id}
                      initial={{ scale: 0.95, opacity: 0, x: 100 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.95, opacity: 0, x: -100 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <div className="bg-background rounded border border-border p-8 lg:p-12 text-center">
                        <motion.div 
                          className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden relative"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                        <blockquote className="text-xl lg:text-2xl font-body text-text-primary mb-6 italic">
                          "{testimonial.content}"
                        </blockquote>
                        <div>
                          <div className="font-heading font-medium text-primary text-lg">
                            {testimonial.name}
                          </div>
                          <div className="font-body text-text-secondary">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-accent' : 'bg-border'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Newsletter Signup */}
      <motion.section 
        className="py-16 bg-primary relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-light text-white mb-6">
              {dict?.newsletter?.title || 'Bleiben Sie Informiert'}
            </h2>
            <p className="text-lg font-body text-white/80 mb-8">
              {dict?.newsletter?.subtitle || 'Abonnieren Sie unseren Newsletter für Updates'}
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.input
                type="email"
                placeholder={dict?.newsletter?.placeholder || 'Ihre E-Mail-Adresse'}
                className="flex-1 px-4 py-3 rounded border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent font-body"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                className="bg-accent text-black px-8 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {dict?.newsletter?.button || 'Abonnieren'}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <Footer dict={dict.translation} lang={lang} onCopyrightClick={handleCopyrightClick} />
    </motion.div>
  );
}