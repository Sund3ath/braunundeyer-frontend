// src/pages/homepage/EditableHomepage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import WaterEffect from 'components/ui/WaterEffect';
import CursorTrail from 'components/ui/CursorTrail';
import AnimatedText from 'components/ui/AnimatedText';
import ContentBackgroundTypography from 'components/ui/ContentBackgroundTypography';
import MultiLanguageSEO from 'components/MultiLanguageSEO';
import EditableText from '../../cms/components/EditableText';
import EditableImage from '../../cms/components/EditableImage';
import { useEditMode } from '../../cms/contexts/EditModeContext';
import { combineSchemas, generateOrganizationSchema, generateWebsiteSchema, generateLocalBusinessSchema } from 'utils/structuredData';

const EditableHomepage = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useEditMode();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'de';
  
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

  // Generate language-specific content keys
  const getLangKey = (base) => `${base}_${currentLang}`;

  // Hero slides with editable content
  const heroSlides = [
    {
      id: 1,
      imageKey: getLangKey('homepage_hero_slide1_image'),
      titleKey: getLangKey('homepage_hero_slide1_title'),
      subtitleKey: getLangKey('homepage_hero_slide1_subtitle'),
      descriptionKey: getLangKey('homepage_hero_slide1_description'),
      hasVideo: true,
      videoKey: getLangKey('homepage_hero_slide1_video'),
    },
    {
      id: 2,
      imageKey: getLangKey('homepage_hero_slide2_image'),
      titleKey: getLangKey('homepage_hero_slide2_title'),
      subtitleKey: getLangKey('homepage_hero_slide2_subtitle'),
      descriptionKey: getLangKey('homepage_hero_slide2_description'),
    },
    {
      id: 3,
      imageKey: getLangKey('homepage_hero_slide3_image'),
      titleKey: getLangKey('homepage_hero_slide3_title'),
      subtitleKey: getLangKey('homepage_hero_slide3_subtitle'),
      descriptionKey: getLangKey('homepage_hero_slide3_description'),
    }
  ];

  // Featured projects with editable content
  const featuredProjects = [
    {
      id: 1,
      titleKey: getLangKey('homepage_project1_title'),
      typeKey: getLangKey('homepage_project1_type'),
      locationKey: getLangKey('homepage_project1_location'),
      imageKey: getLangKey('homepage_project1_image'),
      yearKey: getLangKey('homepage_project1_year'),
    },
    {
      id: 2,
      titleKey: getLangKey('homepage_project2_title'),
      typeKey: getLangKey('homepage_project2_type'),
      locationKey: getLangKey('homepage_project2_location'),
      imageKey: getLangKey('homepage_project2_image'),
      yearKey: getLangKey('homepage_project2_year'),
    },
    {
      id: 3,
      titleKey: getLangKey('homepage_project3_title'),
      typeKey: getLangKey('homepage_project3_type'),
      locationKey: getLangKey('homepage_project3_location'),
      imageKey: getLangKey('homepage_project3_image'),
      yearKey: getLangKey('homepage_project3_year'),
    },
    {
      id: 4,
      titleKey: getLangKey('homepage_project4_title'),
      typeKey: getLangKey('homepage_project4_type'),
      locationKey: getLangKey('homepage_project4_location'),
      imageKey: getLangKey('homepage_project4_image'),
      yearKey: getLangKey('homepage_project4_year'),
    },
    {
      id: 5,
      titleKey: getLangKey('homepage_project5_title'),
      typeKey: getLangKey('homepage_project5_type'),
      locationKey: getLangKey('homepage_project5_location'),
      imageKey: getLangKey('homepage_project5_image'),
      yearKey: getLangKey('homepage_project5_year'),
    },
    {
      id: 6,
      titleKey: getLangKey('homepage_project6_title'),
      typeKey: getLangKey('homepage_project6_type'),
      locationKey: getLangKey('homepage_project6_location'),
      imageKey: getLangKey('homepage_project6_image'),
      yearKey: getLangKey('homepage_project6_year'),
    }
  ];

  // Services with editable content
  const services = [
    {
      id: 1,
      icon: "Home",
      titleKey: getLangKey('homepage_service1_title'),
      descriptionKey: getLangKey('homepage_service1_description'),
    },
    {
      id: 2,
      icon: "Building2",
      titleKey: getLangKey('homepage_service2_title'),
      descriptionKey: getLangKey('homepage_service2_description'),
    },
    {
      id: 3,
      icon: "Palette",
      titleKey: getLangKey('homepage_service3_title'),
      descriptionKey: getLangKey('homepage_service3_description'),
    },
    {
      id: 4,
      icon: "TreePine",
      titleKey: getLangKey('homepage_service4_title'),
      descriptionKey: getLangKey('homepage_service4_description'),
    }
  ];

  // Testimonials with editable content
  const testimonials = [
    {
      id: 1,
      nameKey: getLangKey('homepage_testimonial1_name'),
      roleKey: getLangKey('homepage_testimonial1_role'),
      contentKey: getLangKey('homepage_testimonial1_content'),
      avatarKey: getLangKey('homepage_testimonial1_avatar'),
    },
    {
      id: 2,
      nameKey: getLangKey('homepage_testimonial2_name'),
      roleKey: getLangKey('homepage_testimonial2_role'),
      contentKey: getLangKey('homepage_testimonial2_content'),
      avatarKey: getLangKey('homepage_testimonial2_avatar'),
    },
    {
      id: 3,
      nameKey: getLangKey('homepage_testimonial3_name'),
      roleKey: getLangKey('homepage_testimonial3_role'),
      contentKey: getLangKey('homepage_testimonial3_content'),
      avatarKey: getLangKey('homepage_testimonial3_avatar'),
    }
  ];

  // Client logos with editable content
  const clientLogos = [
    { id: 1, nameKey: getLangKey('homepage_client1_name'), logoKey: getLangKey('homepage_client1_logo') },
    { id: 2, nameKey: getLangKey('homepage_client2_name'), logoKey: getLangKey('homepage_client2_logo') },
    { id: 3, nameKey: getLangKey('homepage_client3_name'), logoKey: getLangKey('homepage_client3_logo') },
    { id: 4, nameKey: getLangKey('homepage_client4_name'), logoKey: getLangKey('homepage_client4_logo') }
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
      navigate(`/${currentLang}/admin`);
      setClickCount(0);
      return;
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 500);
  };

  // Floating background text words
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
      
      <MultiLanguageSEO 
        titleKey="homepage_meta_title"
        descriptionKey="homepage_meta_description"
        keywordsKey="homepage_meta_keywords"
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
                <EditableImage
                  contentKey={slide.imageKey}
                  defaultSrc="/assets/images/alt_neu_ungestaltung.png"
                  alt="Hero background"
                  className="w-full h-full object-cover shimmer-effect"
                  containerClassName="w-full h-full"
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
                <EditableText
                  contentKey={heroSlides[currentSlide].titleKey}
                  defaultValue="Architekturbüro Ingenieure"
                  tag="h1"
                  className="text-4xl sm:text-5xl lg:text-6xl font-heading font-light text-white mb-6 leading-tight"
                />
                <EditableText
                  contentKey={heroSlides[currentSlide].subtitleKey}
                  defaultValue="Neubau und Altbausanierung mit Expertise"
                  tag="h2"
                  className="text-xl sm:text-2xl font-body text-white/90 mb-4"
                />
                <EditableText
                  contentKey={heroSlides[currentSlide].descriptionKey}
                  defaultValue="Wir entwickeln innovative Architekturlösungen, die moderne Bauweise mit nachhaltiger Sanierung historischer Gebäude verbinden."
                  tag="p"
                  className="text-lg font-body text-white/80 mb-8 max-w-2xl"
                  multiline
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
                      to={`/${currentLang}/projekte`}
                      className="inline-flex items-center justify-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                    >
                      <EditableText
                        contentKey={getLangKey('homepage_hero_cta1')}
                        defaultValue="Unsere Arbeiten"
                        tag="span"
                      />
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
                      to={`/${currentLang}/kontakt`}
                      className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-4 rounded transition-all duration-200 hover:bg-white hover:text-black font-body font-medium"
                    >
                      <EditableText
                        contentKey={getLangKey('homepage_hero_cta2')}
                        defaultValue="Projekt Starten"
                        tag="span"
                      />
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
            <EditableText
              contentKey={getLangKey('homepage_projects_title')}
              defaultValue="Ausgewählte Projekte"
              tag="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6"
            />
            <EditableText
              contentKey={getLangKey('homepage_projects_subtitle')}
              defaultValue="Entdecken Sie unsere neuesten Architekturprojekte, die Innovation, Nachhaltigkeit und Designexzellenz in Neubau und Altbausanierung vereinen."
              tag="p"
              className="text-lg font-body text-text-secondary max-w-3xl mx-auto"
              multiline
            />
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
                  to={`/${currentLang}/projekte/${project.id}`}
                  className="group bg-surface rounded border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                    >
                      <EditableImage
                        contentKey={project.imageKey}
                        defaultSrc="/assets/images/ferienvilla.png"
                        alt="Project image"
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                    <div className="absolute top-4 left-4">
                      <motion.span 
                        className="bg-accent text-white px-3 py-1 rounded text-sm font-body font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        <EditableText
                          contentKey={project.typeKey}
                          defaultValue="Neubau"
                          tag="span"
                        />
                      </motion.span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-white/90 text-primary px-3 py-1 rounded text-sm font-body font-medium">
                        <EditableText
                          contentKey={project.yearKey}
                          defaultValue="2024"
                          tag="span"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <EditableText
                      contentKey={project.titleKey}
                      defaultValue="Modernes Einfamilienhaus"
                      tag="h3"
                      className="text-xl font-heading font-medium text-primary mb-2 group-hover:text-accent transition-colors duration-200"
                    />
                    <p className="text-text-secondary font-body flex items-center">
                      <Icon name="MapPin" size={16} className="mr-2" />
                      <EditableText
                        contentKey={project.locationKey}
                        defaultValue="Wohngebiet"
                        tag="span"
                      />
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
                to={`/${currentLang}/projekte`}
                className="inline-flex items-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
              >
                <EditableText
                  contentKey={getLangKey('homepage_projects_cta')}
                  defaultValue="Alle Projekte Ansehen"
                  tag="span"
                />
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
            <EditableText
              contentKey={getLangKey('homepage_services_title')}
              defaultValue="Unsere Leistungen"
              tag="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6"
            />
            <EditableText
              contentKey={getLangKey('homepage_services_subtitle')}
              defaultValue="Von der ersten Idee bis zur Fertigstellung bieten wir umfassende Architektur- und Ingenieurleistungen für Neubau und Altbausanierung."
              tag="p"
              className="text-lg font-body text-text-secondary max-w-3xl mx-auto"
              multiline
            />
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
                <EditableText
                  contentKey={service.titleKey}
                  defaultValue="Service Title"
                  tag="h3"
                  className="text-xl font-heading font-medium text-primary mb-4"
                />
                <EditableText
                  contentKey={service.descriptionKey}
                  defaultValue="Service description goes here"
                  tag="p"
                  className="text-text-secondary font-body"
                  multiline
                />
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
                to={`/${currentLang}/leistungen`}
                className="inline-flex items-center space-x-2 border-2 border-accent text-accent px-8 py-4 rounded transition-all duration-200 hover:bg-accent hover:text-black font-body font-medium"
              >
                <EditableText
                  contentKey={getLangKey('homepage_services_cta')}
                  defaultValue="Mehr Erfahren"
                  tag="span"
                />
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
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          {floatingWords.map((word, index) => (
            <motion.div
              key={index}
              className={`absolute ${word.size} ${word.opacity} text-gray-400 font-thin select-none whitespace-nowrap`}
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%` 
              }}
              animate={{
                x: [0, Math.random() * 60 - 30, Math.random() * -40 + 20, 0],
                y: [0, Math.random() * -30 + 15, Math.random() * 40 - 20, 0],
                rotate: [0, Math.random() * 3 - 1.5, Math.random() * -2 + 1, 0],
              }}
              transition={{
                duration: 20 + word.delay * 2,
                repeat: Infinity,
                delay: word.delay,
                ease: "linear"
              }}
            >
              {word.text}
            </motion.div>
          ))}
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
              <EditableText
                contentKey={getLangKey('homepage_philosophy_title')}
                defaultValue="Unsere Philosophie"
                tag="h2"
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6"
              />
              <EditableText
                contentKey={getLangKey('homepage_philosophy_text1')}
                defaultValue="Bei Braun & Eyer verstehen wir Architektur als die perfekte Balance zwischen Form, Funktion und Nachhaltigkeit. Unser Ansatz verbindet innovative Planungskonzepte mit bewährten Bautechniken, um Räume zu schaffen, die sowohl inspirieren als auch einen positiven Beitrag zur Gemeinschaft leisten."
                tag="p"
                className="text-lg font-body text-text-secondary mb-6"
                multiline
              />
              <EditableText
                contentKey={getLangKey('homepage_philosophy_text2')}
                defaultValue="Mit langjähriger Erfahrung in Neubau und Altbausanierung haben wir uns einen Namen für außergewöhnliche Architekturlösungen gemacht, die den Test der Zeit bestehen und gleichzeitig die Grenzen zeitgemäßer Planung erweitern."
                tag="p"
                className="text-lg font-body text-text-secondary mb-8"
                multiline
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/${currentLang}/uber-uns`}
                  className="inline-flex items-center space-x-2 bg-accent text-black px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                >
                  <EditableText
                    contentKey={getLangKey('homepage_philosophy_cta')}
                    defaultValue="Über Unser Team"
                    tag="span"
                  />
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
                className="relative"
              >
                <EditableImage
                  contentKey={getLangKey('homepage_philosophy_image')}
                  defaultSrc="/assets/images/howtolook.jpg"
                  alt="Architectural design process"
                  className="w-full h-96 lg:h-[500px] object-cover rounded"
                  containerClassName="w-full"
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
            <EditableText
              contentKey={getLangKey('homepage_testimonials_title')}
              defaultValue="Was Unsere Kunden Sagen"
              tag="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-primary mb-6"
            />
            <EditableText
              contentKey={getLangKey('homepage_testimonials_subtitle')}
              defaultValue="Vertrauen Sie nicht nur unserem Wort. Hier erfahren Sie, was unsere Kunden über die Zusammenarbeit mit Braun & Eyer sagen."
              tag="p"
              className="text-lg font-body text-text-secondary max-w-3xl mx-auto"
              multiline
            />
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
                      <EditableImage
                        contentKey={testimonial.avatarKey}
                        defaultSrc="/assets/images/no_image.png"
                        alt="Testimonial avatar"
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </motion.div>
                    <blockquote className="text-xl lg:text-2xl font-body text-text-primary mb-6 italic">
                      "<EditableText
                        contentKey={testimonial.contentKey}
                        defaultValue="Testimonial content goes here"
                        tag="span"
                        multiline
                      />"
                    </blockquote>
                    <div>
                      <EditableText
                        contentKey={testimonial.nameKey}
                        defaultValue="Customer Name"
                        tag="div"
                        className="font-heading font-medium text-primary text-lg"
                      />
                      <EditableText
                        contentKey={testimonial.roleKey}
                        defaultValue="Customer Role"
                        tag="div"
                        className="font-body text-text-secondary"
                      />
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
            <EditableText
              contentKey={getLangKey('homepage_clients_title')}
              defaultValue="Trusted by leading organizations"
              tag="p"
              className="text-text-secondary font-body"
            />
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
                <EditableImage
                  contentKey={client.logoKey}
                  defaultSrc="/assets/images/no_image.png"
                  alt={`Client logo ${client.id}`}
                  className="h-12 w-auto"
                  containerClassName="h-12"
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
            <EditableText
              contentKey={getLangKey('homepage_newsletter_title')}
              defaultValue="Bleiben Sie Informiert"
              tag="h2"
              className="text-3xl sm:text-4xl font-heading font-light text-white mb-6"
            />
            <EditableText
              contentKey={getLangKey('homepage_newsletter_subtitle')}
              defaultValue="Abonnieren Sie unseren Newsletter für Updates zu aktuellen Projekten, Planungseinblicke und Architekturtrends."
              tag="p"
              className="text-lg font-body text-white/80 mb-8"
              multiline
            />
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.input
                type="email"
                placeholder={t('homepage_newsletter_placeholder', 'Ihre E-Mail-Adresse')}
                className="flex-1 px-4 py-3 rounded border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent font-body"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                className="bg-accent text-black px-8 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <EditableText
                  contentKey={getLangKey('homepage_newsletter_button')}
                  defaultValue="Abonnieren"
                  tag="span"
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-primary text-white py-16 relative z-20">
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
              <EditableText
                contentKey={getLangKey('homepage_footer_description')}
                defaultValue="Architekturbüro Ingenieure - Spezialisiert auf Neubau und Altbausanierung mit innovativen und nachhaltigen Lösungen."
                tag="p"
                className="font-body text-white/80 mb-4"
                multiline
              />
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
              <EditableText
                contentKey={getLangKey('homepage_footer_services_title')}
                defaultValue="Leistungen"
                tag="h3"
                className="font-heading font-medium text-lg mb-4"
              />
              <ul className="space-y-2 font-body">
                <li>
                  <Link to={`/${currentLang}/leistungen`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_service1')}
                      defaultValue="Neubau"
                      tag="span"
                    />
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/leistungen`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_service2')}
                      defaultValue="Altbausanierung"
                      tag="span"
                    />
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/leistungen`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_service3')}
                      defaultValue="Ingenieursleistungen"
                      tag="span"
                    />
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/leistungen`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_service4')}
                      defaultValue="Energieberatung"
                      tag="span"
                    />
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <EditableText
                contentKey={getLangKey('homepage_footer_company_title')}
                defaultValue="Unternehmen"
                tag="h3"
                className="font-heading font-medium text-lg mb-4"
              />
              <ul className="space-y-2 font-body">
                <li>
                  <Link to={`/${currentLang}/uber-uns`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_about')}
                      defaultValue="Über Uns"
                      tag="span"
                    />
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/projekte`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_projects')}
                      defaultValue="Projekte"
                      tag="span"
                    />
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/kontakt`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_contact')}
                      defaultValue="Kontakt"
                      tag="span"
                    />
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_career')}
                      defaultValue="Karriere"
                      tag="span"
                    />
                  </a>
                </li>
                <li>
                  <Link to={`/${currentLang}/impressum`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_imprint')}
                      defaultValue="Impressum"
                      tag="span"
                    />
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/datenschutz`} className="text-white/80 hover:text-accent transition-colors duration-200">
                    <EditableText
                      contentKey={getLangKey('homepage_footer_privacy')}
                      defaultValue="Datenschutz"
                      tag="span"
                    />
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <EditableText
                contentKey={getLangKey('homepage_footer_contact_title')}
                defaultValue="Kontakt"
                tag="h3"
                className="font-heading font-medium text-lg mb-4"
              />
              <div className="space-y-3 font-body text-white/80">
                <div className="flex items-start space-x-3">
                  <Icon name="MapPin" size={16} className="mt-1 flex-shrink-0" />
                  <EditableText
                    contentKey={getLangKey('homepage_footer_address')}
                    defaultValue="Architekturbüro Braun & Eyer
Deutschland"
                    tag="span"
                    multiline
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={16} className="flex-shrink-0" />
                  <EditableText
                    contentKey={getLangKey('homepage_footer_phone')}
                    defaultValue="+49 (0) 123 456789"
                    tag="span"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={16} className="flex-shrink-0" />
                  <EditableText
                    contentKey={getLangKey('homepage_footer_email')}
                    defaultValue="info@braunundeyer.de"
                    tag="span"
                  />
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
            <p 
              className="font-body text-white/60 cursor-pointer select-none transition-colors duration-200 hover:text-white/80"
              onClick={handleCopyrightClick}
              style={{ userSelect: 'none' }}
            >
              © {new Date().getFullYear()} <EditableText
                contentKey={getLangKey('homepage_footer_copyright')}
                defaultValue="Braun & Eyer Architekturbüro Ingenieure. Alle Rechte vorbehalten."
                tag="span"
              />
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default EditableHomepage;