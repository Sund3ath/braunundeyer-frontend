// src/pages/homepage/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import WaterEffect from 'components/ui/WaterEffect';
import CursorTrail from 'components/ui/CursorTrail';
import AnimatedText from 'components/ui/AnimatedText';
import SEO from 'components/SEO';
import { combineSchemas, generateOrganizationSchema, generateWebsiteSchema, generateLocalBusinessSchema } from 'utils/structuredData';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Architekturbüro Ingenieure",
      subtitle: "Neubau und Altbausanierung mit Expertise",
      description: "Wir entwickeln innovative Architekturlösungen, die moderne Bauweise mit nachhaltiger Sanierung historischer Gebäude verbinden."
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=2000&q=80",
      title: "Neubau",
      subtitle: "Moderne Architektur für die Zukunft",
      description: "Zeitgemäße Neubauprojekte, die höchste Ansprüche an Design, Funktionalität und Energieeffizienz erfüllen."
    },
    {
      id: 3,
      image: "https://images.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg?auto=compress&cs=tinysrgb&w=2000&q=80",
      title: "Altbausanierung",
      subtitle: "Behutsame Modernisierung historischer Substanz",
      description: "Fachgerechte Sanierung und Modernisierung von Altbauten unter Erhaltung des ursprünglichen Charakters."
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: "Modernes Einfamilienhaus",
      type: "Neubau",
      location: "Wohngebiet",
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      year: "2024"
    },
    {
      id: 2,
      title: "Historische Villa Sanierung",
      type: "Altbausanierung",
      location: "Altstadt",
      image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
      year: "2023"
    },
    {
      id: 3,
      title: "Mehrfamilienhaus Neubau",
      type: "Neubau",
      location: "Stadtrand",
      image: "https://images.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg?auto=compress&cs=tinysrgb&w=800&q=80",
      year: "2024"
    },
    {
      id: 4,
      title: "Denkmalgeschützte Sanierung",
      type: "Altbausanierung",
      location: "Historisches Zentrum",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      year: "2023"
    },
    {
      id: 5,
      title: "Energieeffizientes Wohnhaus",
      type: "Neubau",
      location: "Neubaugebiet",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
      year: "2024"
    },
    {
      id: 6,
      title: "Gründerzeit Modernisierung",
      type: "Altbausanierung",
      location: "Innenstadtbereich",
      image: "https://images.pixabay.com/photo/2016/11/29/03/53/architecture-1867187_1280.jpg?auto=compress&cs=tinysrgb&w=800&q=80",
      year: "2023"
    }
  ];

  const services = [
    {
      id: 1,
      icon: "Home",
      title: "Neubau",
      description: "Moderne Neubauprojekte von der Planung bis zur Fertigstellung. Wir realisieren Wohn- und Geschäftsgebäude nach neuesten Standards."
    },
    {
      id: 2,
      icon: "Building2",
      title: "Altbausanierung",
      description: "Fachgerechte Sanierung und Modernisierung historischer Gebäude unter Berücksichtigung von Denkmalschutz und Energieeffizienz."
    },
    {
      id: 3,
      icon: "Palette",
      title: "Ingenieursleistungen",
      description: "Umfassende technische Planung und Beratung für alle Bauphasen mit Fokus auf Statik, Haustechnik und Bauphysik."
    },
    {
      id: 4,
      icon: "TreePine",
      title: "Energieberatung",
      description: "Nachhaltige Lösungen für energieeffizientes Bauen und Sanieren mit Fokus auf Umweltschutz und Kosteneinsparung."
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Familie Müller",
      role: "Bauherr",
      content: "Braun & Eyer hat unsere Vorstellungen perfekt umgesetzt. Die Betreuung war professionell und die Qualität der Arbeit überzeugt uns täglich aufs Neue.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Herr Schmidt",
      role: "Eigentümer",
      content: "Die Sanierung unseres Altbaus wurde mit größter Sorgfalt durchgeführt. Das Team versteht es, moderne Technik mit historischer Substanz zu verbinden.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      name: "Frau Weber",
      role: "Investorin",
      content: "Die Zusammenarbeit mit Braun & Eyer war durchweg professionell. Ihre Expertise in der Altbausanierung hat unser Projekt zum Erfolg geführt.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  const clientLogos = [
    { id: 1, name: "TechCorp", logo: "https://via.placeholder.com/120x60/2C2C2C/FFFFFF?text=TechCorp" },
    { id: 2, name: "GreenBuild", logo: "https://via.placeholder.com/120x60/2C2C2C/FFFFFF?text=GreenBuild" },
    { id: 3, name: "UrbanDev", logo: "https://via.placeholder.com/120x60/2C2C2C/FFFFFF?text=UrbanDev" },
    { id: 4, name: "ModernLiving", logo: "https://via.placeholder.com/120x60/2C2C2C/FFFFFF?text=ModernLiving" }
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
    }, 4000);

    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Floating background text words from flyer
  const floatingWords = [
    { text: "individuell", size: "text-6xl", opacity: "opacity-10", delay: 0 },
    { text: "ökologisch", size: "text-5xl", opacity: "opacity-15", delay: 2 },
    { text: "dynamisch", size: "text-7xl", opacity: "opacity-8", delay: 4 },
    { text: "nachhaltig", size: "text-4xl", opacity: "opacity-12", delay: 1 },
    { text: "modern", size: "text-5xl", opacity: "opacity-10", delay: 3 },
    { text: "innovativ", size: "text-6xl", opacity: "opacity-14", delay: 5 }
  ];

  const homepageSchema = combineSchemas(
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateLocalBusinessSchema()
  );

  return (
    <div className="min-h-screen bg-background custom-cursor relative overflow-hidden">
      <SEO 
        title="Braun & Eyer Architekturbüro | Neubau und Altbausanierung in Saarbrücken"
        description="Führendes Architekturbüro in Saarbrücken für innovative Neubauprojekte und fachgerechte Altbausanierung. Über 30 Jahre Erfahrung in nachhaltiger Architektur und Denkmalschutz."
        keywords="Architekt Saarbrücken, Architekturbüro, Neubau, Altbausanierung, Bauplanung, nachhaltige Architektur, Energieeffizienz, Denkmalschutz, Braun Eyer"
        structuredData={homepageSchema}
      />
      <Header />
      <CursorTrail />
      
      
      {/* Custom Cursor */}
      <motion.div
        className="cursor-dot"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div
        className="cursor-ring"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      
      {/* Enhanced Hero Section with Water Effects */}
      <WaterEffect className="relative h-screen" style={{ zIndex: 10 }}>
        <motion.section 
          className="relative h-screen overflow-hidden"
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
                <Image
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover shimmer-effect"
                />
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
                      to="/project-gallery"
                      className="inline-flex items-center justify-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                    >
                      <span>Unsere Arbeiten</span>
                      <Icon name="ArrowRight" size={20} />
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
                      to="/contact"
                      className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded transition-all duration-200 hover:bg-white hover:text-black font-body font-medium"
                    >
                      <span>Projekt Starten</span>
                      <Icon name="Mail" size={20} />
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
                <Icon name="ChevronLeft" size={24} />
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
                <Icon name="ChevronRight" size={24} />
              </motion.button>
            </div>
          </motion.div>
        </motion.section>
      </WaterEffect>

      {/* Featured Projects */}
      <motion.section 
        className="py-16 lg:py-24 bg-background relative"
        style={{ zIndex: 5 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Full-width floating text container extending beyond max-width */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[14rem] opacity-[0.12] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "-5%", top: "40%" }}
            animate={{
              x: [0, 30, -15, 0],
              y: [0, -10, 15, 0],
              rotate: [0, 0.5, -0.3, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            individuell
          </motion.div>
          <motion.div
            className="absolute text-7xl opacity-[0.20] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-8%", top: "10%" }}
            animate={{
              x: [0, -20, 12, 0],
              y: [0, 12, -8, 0],
              rotate: [0, -0.5, 0.7, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              delay: 3,
              ease: "linear"
            }}
          >
            dynamisch
          </motion.div>
          <motion.div
            className="absolute text-9xl opacity-[0.15] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "85%", top: "70%" }}
            animate={{
              x: [0, -25, 10, 0],
              y: [0, 15, -20, 0],
              rotate: [0, 1, -0.8, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              delay: 7,
              ease: "linear"
            }}
          >
            kreativ
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
              Ausgewählte Projekte
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              Entdecken Sie unsere neuesten Architekturprojekte, die Innovation, Nachhaltigkeit und Designexzellenz in Neubau und Altbausanierung vereinen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 relative" style={{ zIndex: 3 }}>
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="relative"
                style={{ zIndex: 4 }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.1
                }}
              >
                <Link
                  to={`/project-detail?id=${project.id}`}
                  className="group bg-surface rounded border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
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
                      <Icon name="MapPin" size={16} className="mr-2" />
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
                to="/project-gallery"
                className="inline-flex items-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
              >
                <span>Alle Projekte Ansehen</span>
                <Icon name="ArrowRight" size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Overview */}
      <motion.section 
        className="py-16 lg:py-24 bg-surface relative"
        style={{ zIndex: 4 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Full-width floating text container for services */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[12rem] opacity-[0.16] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "-10%", top: "20%" }}
            animate={{
              x: [0, 40, -20, 0],
              y: [0, 18, -12, 0],
              rotate: [0, -0.7, 1.2, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              delay: 1,
              ease: "linear"
            }}
          >
            ökologisch
          </motion.div>
          <motion.div
            className="absolute text-5xl opacity-[0.28] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-5%", top: "70%" }}
            animate={{
              x: [0, -30, 15, 0],
              y: [0, -15, 25, 0],
              rotate: [0, 1, -0.8, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              delay: 4,
              ease: "linear"
            }}
          >
            nachhaltig
          </motion.div>
          <motion.div
            className="absolute text-8xl opacity-[0.14] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "2%", top: "85%" }}
            animate={{
              x: [0, 20, -12, 0],
              y: [0, -25, 18, 0],
              rotate: [0, 0.8, -1.2, 0],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              delay: 8,
              ease: "linear"
            }}
          >
            effizient
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
              Unsere Leistungen
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              Von der ersten Idee bis zur Fertigstellung bieten wir umfassende Architektur- und Ingenieurleistungen für Neubau und Altbausanierung.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative" style={{ zIndex: 2 }}>
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-background rounded border border-border p-8 text-center hover:shadow-lg transition-all duration-300 group relative"
                style={{ zIndex: 3 }}
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
                  <Icon name={service.icon} size={32} className="text-accent group-hover:text-white" />
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
                to="/services"
                className="inline-flex items-center space-x-2 border-2 border-accent text-accent px-8 py-4 rounded transition-all duration-200 hover:bg-accent hover:text-black font-body font-medium"
              >
                <span>Mehr Erfahren</span>
                <Icon name="ArrowRight" size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Preview */}
      <motion.section 
        className="py-16 lg:py-24 bg-background relative"
        style={{ zIndex: 3 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Full-width floating text container for about */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-8xl opacity-[0.18] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "-8%", top: "15%" }}
            animate={{
              x: [0, 35, -18, 0],
              y: [0, -22, 16, 0],
              rotate: [0, 1.2, -0.9, 0],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              delay: 2,
              ease: "linear"
            }}
          >
            modern
          </motion.div>
          <motion.div
            className="absolute text-[13rem] opacity-[0.12] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-15%", top: "50%" }}
            animate={{
              x: [0, -35, 22, 0],
              y: [0, 10, -18, 0],
              rotate: [0, -1.5, 0.8, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              delay: 6,
              ease: "linear"
            }}
          >
            innovativ
          </motion.div>
          <motion.div
            className="absolute text-6xl opacity-[0.22] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "90%", top: "80%" }}
            animate={{
              x: [0, 28, -15, 0],
              y: [0, -18, 22, 0],
              rotate: [0, 0.9, -1.1, 0],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              delay: 10,
              ease: "linear"
            }}
          >
            visionär
          </motion.div>
          <motion.div
            className="absolute text-10xl opacity-[0.10] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "95%", top: "25%" }}
            animate={{
              x: [0, -40, 20, 0],
              y: [0, 25, -15, 0],
              rotate: [0, -1.8, 1.3, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              delay: 12,
              ease: "linear"
            }}
          >
            zukunftsorientiert
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative" style={{ zIndex: 2 }}>
            <motion.div
              className="relative"
              style={{ zIndex: 3 }}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
                Unsere Philosophie
              </h2>
              <p className="text-lg font-body text-text-secondary mb-6">
                Bei Braun & Eyer verstehen wir Architektur als die perfekte Balance zwischen Form, Funktion und Nachhaltigkeit. Unser Ansatz verbindet innovative Planungskonzepte mit bewährten Bautechniken, um Räume zu schaffen, die sowohl inspirieren als auch einen positiven Beitrag zur Gemeinschaft leisten.
              </p>
              <p className="text-lg font-body text-text-secondary mb-8">
                Mit langjähriger Erfahrung in Neubau und Altbausanierung haben wir uns einen Namen für außergewöhnliche Architekturlösungen gemacht, die den Test der Zeit bestehen und gleichzeitig die Grenzen zeitgemäßer Planung erweitern.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about-us"
                  className="inline-flex items-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                >
                  <span>Über Unser Team</span>
                  <Icon name="ArrowRight" size={20} />
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              style={{ zIndex: 3 }}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Architectural design process"
                  className="w-full h-96 lg:h-[500px] object-cover rounded"
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
        style={{ zIndex: 2 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Full-width floating text container for testimonials */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[11rem] opacity-[0.14] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "-8%", top: "20%" }}
            animate={{
              x: [0, 35, -18, 0],
              y: [0, -15, 20, 0],
              rotate: [0, 0.8, -1.1, 0],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              delay: 2,
              ease: "linear"
            }}
          >
            vertrauensvoll
          </motion.div>
          <motion.div
            className="absolute text-7xl opacity-[0.18] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-10%", top: "60%" }}
            animate={{
              x: [0, -28, 16, 0],
              y: [0, 12, -22, 0],
              rotate: [0, -0.9, 1.3, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              delay: 5,
              ease: "linear"
            }}
          >
            professionell
          </motion.div>
          <motion.div
            className="absolute text-6xl opacity-[0.16] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "85%", top: "10%" }}
            animate={{
              x: [0, -32, 18, 0],
              y: [0, 20, -14, 0],
              rotate: [0, 1.2, -0.7, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              delay: 8,
              ease: "linear"
            }}
          >
            qualitätsvoll
          </motion.div>
          <motion.div
            className="absolute text-5xl opacity-[0.20] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "80%", top: "85%" }}
            animate={{
              x: [0, 25, -12, 0],
              y: [0, -18, 26, 0],
              rotate: [0, -1.1, 0.8, 0],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              delay: 12,
              ease: "linear"
            }}
          >
            zufrieden
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 3 }}>
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ zIndex: 4 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
              Was Unsere Kunden Sagen
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              Vertrauen Sie nicht nur unserem Wort. Hier erfahren Sie, was unsere Kunden über die Zusammenarbeit mit Braun & Eyer sagen.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto" style={{ zIndex: 5 }}>
            <div className="overflow-hidden" style={{ zIndex: 6 }}>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className={`transition-all duration-500 ${
                    index === currentTestimonial ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full absolute inset-0'
                  }`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: index === currentTestimonial ? 1 : 0.9,
                    opacity: index === currentTestimonial ? 1 : 0
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ zIndex: 7 }}
                >
                  <div className="bg-background rounded border border-border p-8 lg:p-12 text-center relative" style={{ zIndex: 8 }}>
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
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
              ))}
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

      {/* Client Logos */}
      <motion.section 
        className="py-12 bg-background border-t border-border relative"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-text-secondary font-body">Trusted by leading organizations</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {clientLogos.map((client, index) => (
              <motion.div 
                key={client.id} 
                className="grayscale hover:grayscale-0 transition-all duration-300"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.1
                }}
                whileHover={{ 
                  scale: 1.1,
                  opacity: 1
                }}
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  className="h-12 w-auto"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter Signup */}
      <motion.section 
        className="py-16 bg-primary relative"
        style={{ zIndex: 1 }}
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
              Bleiben Sie Informiert
            </h2>
            <p className="text-lg font-body text-white/80 mb-8">
              Abonnieren Sie unseren Newsletter für Updates zu aktuellen Projekten, Planungseinblicke und Architekturtrends.
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
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 px-4 py-3 rounded border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent font-body"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                className="bg-accent text-black px-8 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Abonnieren
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-primary text-white py-16 relative" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <motion.div 
                  className="w-8 h-8 bg-accent rounded flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon name="Triangle" size={20} color="white" />
                </motion.div>
                <div className="font-heading font-semibold text-xl">Braun & Eyer</div>
              </div>
              <p className="font-body text-white/80 mb-4">
                Architekturbüro Ingenieure - Spezialisiert auf Neubau und Altbausanierung mit innovativen und nachhaltigen Lösungen.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'Linkedin'].map((social) => (
                  <motion.a 
                    key={social}
                    href="#" 
                    className="text-white/60 hover:text-accent transition-colors duration-200"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon name={social} size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-heading font-medium text-lg mb-4">Leistungen</h3>
              <ul className="space-y-2 font-body">
                <li><Link to="/services" className="text-white/80 hover:text-accent transition-colors duration-200">Neubau</Link></li>
                <li><Link to="/services" className="text-white/80 hover:text-accent transition-colors duration-200">Altbausanierung</Link></li>
                <li><Link to="/services" className="text-white/80 hover:text-accent transition-colors duration-200">Ingenieursleistungen</Link></li>
                <li><Link to="/services" className="text-white/80 hover:text-accent transition-colors duration-200">Energieberatung</Link></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-heading font-medium text-lg mb-4">Unternehmen</h3>
              <ul className="space-y-2 font-body">
                <li><Link to="/about-us" className="text-white/80 hover:text-accent transition-colors duration-200">Über Uns</Link></li>
                <li><Link to="/project-gallery" className="text-white/80 hover:text-accent transition-colors duration-200">Projekte</Link></li>
                <li><Link to="/contact" className="text-white/80 hover:text-accent transition-colors duration-200">Kontakt</Link></li>
                <li><a href="#" className="text-white/80 hover:text-accent transition-colors duration-200">Karriere</a></li>
                <li><Link to="/impressum" className="text-white/80 hover:text-accent transition-colors duration-200">Impressum</Link></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="font-heading font-medium text-lg mb-4">Kontakt</h3>
              <div className="space-y-3 font-body text-white/80">
                <div className="flex items-start space-x-3">
                  <Icon name="MapPin" size={16} className="mt-1 flex-shrink-0" />
                  <span>Architekturbüro Braun & Eyer<br />Deutschland</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={16} className="flex-shrink-0" />
                  <span>+49 (0) 123 456789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={16} className="flex-shrink-0" />
                  <span>info@braunundeyer.de</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="border-t border-white/20 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="font-body text-white/60">
              © {new Date().getFullYear()} Braun & Eyer Architekturbüro Ingenieure. Alle Rechte vorbehalten.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;