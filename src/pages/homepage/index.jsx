// src/pages/homepage/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import WaterEffect from 'components/ui/WaterEffect';
import CursorTrail from 'components/ui/CursorTrail';
import AnimatedText from 'components/ui/AnimatedText';
import ContentBackgroundTypography from 'components/ui/ContentBackgroundTypography';
import SEO from 'components/SEO';
import Footer from 'components/Footer';
import { combineSchemas, generateOrganizationSchema, generateWebsiteSchema, generateLocalBusinessSchema } from 'utils/structuredData';
import { useEditMode } from '../../cms/contexts/EditModeContext';

const Homepage = () => {
  const { t } = useTranslation('homepage');
  const { isAuthenticated } = useEditMode();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);
  
  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const heroSlides = [
    {
      id: 1,
      image: "/assets/images/alt_neu_ungestaltung.png",
      video: "/assets/images/hero_modernbuilding_video.mp4",
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      description: t('hero.slide1.description')
    },
    {
      id: 2,
      image: "/assets/images/ferienvilla.png",
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      description: t('hero.slide2.description')
    },
    {
      id: 3,
      image: "/assets/images/innenarchitektur.png",
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
      description: t('hero.slide3.description')
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: t('projects.items.project1.title'),
      type: t('projects.items.project1.type'),
      location: t('projects.items.project1.location'),
      image: "/assets/images/ferienvilla.png",
      year: "2024"
    },
    {
      id: 2,
      title: t('projects.items.project2.title'),
      type: t('projects.items.project2.type'),
      location: t('projects.items.project2.location'),
      image: "/assets/images/sarnierung_alt_neu.png",
      year: "2023"
    },
    {
      id: 3,
      title: t('projects.items.project3.title'),
      type: t('projects.items.project3.type'),
      location: t('projects.items.project3.location'),
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      year: "2024"
    },
    {
      id: 4,
      title: t('projects.items.project4.title'),
      type: t('projects.items.project4.type'),
      location: t('projects.items.project4.location'),
      image: "/assets/images/alt_neu_ungestaltung.png",
      year: "2023"
    },
    {
      id: 5,
      title: t('projects.items.project5.title'),
      type: t('projects.items.project5.type'),
      location: t('projects.items.project5.location'),
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      year: "2024"
    },
    {
      id: 6,
      title: t('projects.items.project6.title'),
      type: t('projects.items.project6.type'),
      location: t('projects.items.project6.location'),
      image: "/assets/images/innenarchitektur.png",
      year: "2023"
    }
  ];

  const services = [
    {
      id: 1,
      icon: "Home",
      title: t('services.items.service1.title'),
      description: t('services.items.service1.description')
    },
    {
      id: 2,
      icon: "Building2",
      title: t('services.items.service2.title'),
      description: t('services.items.service2.description')
    },
    {
      id: 3,
      icon: "Palette",
      title: t('services.items.service3.title'),
      description: t('services.items.service3.description')
    },
    {
      id: 4,
      icon: "TreePine",
      title: t('services.items.service4.title'),
      description: t('services.items.service4.description')
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: t('testimonials.items.testimonial1.name'),
      role: t('testimonials.items.testimonial1.role'),
      content: t('testimonials.items.testimonial1.content'),
      avatar: "/assets/images/no_image.png"
    },
    {
      id: 2,
      name: t('testimonials.items.testimonial2.name'),
      role: t('testimonials.items.testimonial2.role'),
      content: t('testimonials.items.testimonial2.content'),
      avatar: "/assets/images/no_image.png"
    },
    {
      id: 3,
      name: t('testimonials.items.testimonial3.name'),
      role: t('testimonials.items.testimonial3.role'),
      content: t('testimonials.items.testimonial3.content'),
      avatar: "/assets/images/no_image.png"
    }
  ];

  const clientLogos = [
    { id: 1, name: "TechCorp", logo: "/assets/images/no_image.png" },
    { id: 2, name: "GreenBuild", logo: "/assets/images/no_image.png" },
    { id: 3, name: "UrbanDev", logo: "/assets/images/no_image.png" },
    { id: 4, name: "ModernLiving", logo: "/assets/images/no_image.png" }
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
    // Clear previous timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Navigate to admin on triple-click (3rd click)
    if (newClickCount === 3) {
      navigate('/de/admin');
      setClickCount(0);
      return;
    }
    
    // Reset click count after 500ms
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 500);
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
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
      
      {/* Background typography is now placed within content sections only */}
      
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
      <WaterEffect className="relative h-screen bg-background" style={{ zIndex: 20 }}>
        <motion.section 
          className={`relative h-screen overflow-hidden bg-background ${
            isAuthenticated ? 'pt-32 lg:pt-36' : 'pt-20 lg:pt-24'
          }`}
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
                    className="w-full h-full object-cover shimmer-effect"
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
                      to="/de/projekte"
                      className="inline-flex items-center justify-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                    >
                      <span>{t('hero.cta.projects')}</span>
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
                      to="/de/kontakt"
                      className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded transition-all duration-200 hover:bg-white hover:text-black font-body font-medium"
                    >
                      <span>{t('hero.cta.start')}</span>
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
        {/* Content Background Typography - Only in this section */}
        <ContentBackgroundTypography 
          words={[
            { 
              text: "PROJEKTE", 
              size: "text-[14rem]", 
              opacity: "opacity-[0.06]", 
              position: { left: "-5%", top: "30%" },
              animation: "large",
              delay: 0 
            },
            { 
              text: "INNOVATION", 
              size: "text-8xl", 
              opacity: "opacity-[0.08]", 
              position: { right: "-8%", top: "10%" },
              animation: "medium",
              delay: 3 
            },
            { 
              text: "DESIGN", 
              size: "text-7xl", 
              opacity: "opacity-[0.07]", 
              position: { left: "85%", top: "70%" },
              animation: "small",
              delay: 5 
            }
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
              {t('projects.title')}
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              {t('projects.subtitle')}
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
                  to={`/de/projekte/${project.id}`}
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
                to="/de/projekte"
                className="inline-flex items-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
              >
                <span>{t('projects.viewAll')}</span>
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
        {/* Content Background Typography - Only in this section */}
        <ContentBackgroundTypography 
          words={[
            { 
              text: "LEISTUNGEN", 
              size: "text-[12rem]", 
              opacity: "opacity-[0.05]", 
              position: { left: "-10%", top: "20%" },
              animation: "large",
              delay: 1 
            },
            { 
              text: "QUALITÄT", 
              size: "text-7xl", 
              opacity: "opacity-[0.07]", 
              position: { right: "-5%", top: "70%" },
              animation: "medium",
              delay: 4 
            },
            { 
              text: "KOMPETENZ", 
              size: "text-8xl", 
              opacity: "opacity-[0.06]", 
              position: { left: "2%", top: "85%" },
              animation: "small",
              delay: 8 
            }
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6">
              {t('services.title')}
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              {t('services.subtitle')}
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
                to="/de/leistungen"
                className="inline-flex items-center space-x-2 border-2 border-accent text-accent px-8 py-4 rounded transition-all duration-200 hover:bg-accent hover:text-black font-body font-medium"
              >
                <span>{t('services.viewMore')}</span>
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
                {t('philosophy.title')}
              </h2>
              <p className="text-lg font-body text-text-secondary mb-6">
                {t('philosophy.text1')}
              </p>
              <p className="text-lg font-body text-text-secondary mb-8">
                {t('philosophy.text2')}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/de/uber-uns"
                  className="inline-flex items-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                >
                  <span>{t('philosophy.cta')}</span>
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
                  src="/assets/images/howtolook.jpg"
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
        {/* Content Background Typography - Only in this section */}
        <ContentBackgroundTypography 
          words={[
            { 
              text: "REFERENZEN", 
              size: "text-[11rem]", 
              opacity: "opacity-[0.05]", 
              position: { left: "-8%", top: "20%" },
              animation: "large",
              delay: 2 
            },
            { 
              text: "VERTRAUEN", 
              size: "text-7xl", 
              opacity: "opacity-[0.06]", 
              position: { right: "-10%", top: "60%" },
              animation: "medium",
              delay: 5 
            },
            { 
              text: "QUALITÄT", 
              size: "text-6xl", 
              opacity: "opacity-[0.05]", 
              position: { left: "85%", top: "10%" },
              animation: "small",
              delay: 8 
            }
          ]}
        />
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
              {t('testimonials.title')}
            </h2>
            <p className="text-lg font-body text-text-secondary max-w-3xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto" style={{ zIndex: 5 }}>
            <div className="overflow-hidden relative min-h-[320px]" style={{ zIndex: 6 }}>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className={`${
                    index === currentTestimonial ? 'relative opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none'
                  }`}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ 
                    scale: index === currentTestimonial ? 1 : 0.95,
                    opacity: index === currentTestimonial ? 1 : 0,
                    x: index === currentTestimonial ? 0 : 100
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ zIndex: index === currentTestimonial ? 8 : 7 }}
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
              {t('newsletter.title')}
            </h2>
            <p className="text-lg font-body text-white/80 mb-8">
              {t('newsletter.subtitle')}
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
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-4 py-3 rounded border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent font-body"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                className="bg-accent text-black px-8 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('newsletter.button')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;