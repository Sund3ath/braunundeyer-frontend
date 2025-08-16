import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import CursorTrail from 'components/ui/CursorTrail';
import SEO from 'components/SEO';
import Footer from 'components/Footer';
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema, combineSchemas } from 'utils/structuredData';

const Services = () => {
  const { t, i18n } = useTranslation(['services', 'translation']);
  const location = useLocation();
  const navigate = useNavigate();
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';
  const [expandedService, setExpandedService] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);

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

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const services = [
    {
      id: 1,
      key: 'newConstruction',
      title: t('services:services.newConstruction.title'),
      icon: "Home",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      description: t('services:services.newConstruction.description'),
      timeline: t('services:services.newConstruction.timeline'),
      deliverables: t('services:services.newConstruction.deliverables', { returnObjects: true }),
      features: t('services:services.newConstruction.features', { returnObjects: true }),
      startingPrice: t('services:services.newConstruction.startingPrice')
    },
    {
      id: 2,
      key: 'renovation',
      title: t('services:services.renovation.title'),
      icon: "Building2",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      description: t('services:services.renovation.description'),
      timeline: t('services:services.renovation.timeline'),
      deliverables: t('services:services.renovation.deliverables', { returnObjects: true }),
      features: t('services:services.renovation.features', { returnObjects: true }),
      startingPrice: t('services:services.renovation.startingPrice')
    },
    {
      id: 3,
      key: 'interior',
      title: t('services:services.interior.title'),
      icon: "Palette",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      description: t('services:services.interior.description'),
      timeline: t('services:services.interior.timeline'),
      deliverables: t('services:services.interior.deliverables', { returnObjects: true }),
      features: t('services:services.interior.features', { returnObjects: true }),
      startingPrice: t('services:services.interior.startingPrice')
    },
    {
      id: 4,
      key: 'energy',
      title: t('services:services.energy.title'),
      icon: "Wrench",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop",
      description: t('services:services.energy.description'),
      timeline: t('services:services.energy.timeline'),
      deliverables: t('services:services.energy.deliverables', { returnObjects: true }),
      features: t('services:services.energy.features', { returnObjects: true }),
      startingPrice: t('services:services.energy.startingPrice')
    },
    {
      id: 5,
      key: 'projectManagement',
      title: t('services:services.projectManagement.title'),
      icon: "ClipboardList",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
      description: t('services:services.projectManagement.description'),
      timeline: t('services:services.projectManagement.timeline'),
      deliverables: t('services:services.projectManagement.deliverables', { returnObjects: true }),
      features: t('services:services.projectManagement.features', { returnObjects: true }),
      startingPrice: t('services:services.projectManagement.startingPrice')
    }
  ];

  const processSteps = [
    {
      step: 1,
      key: 'consultation',
      title: t('services:process.steps.consultation.title'),
      description: t('services:process.steps.consultation.description'),
      icon: "MessageCircle",
      duration: t('services:process.steps.consultation.duration')
    },
    {
      step: 2,
      key: 'analysis',
      title: t('services:process.steps.analysis.title'),
      description: t('services:process.steps.analysis.description'),
      icon: "MapPin",
      duration: t('services:process.steps.analysis.duration')
    },
    {
      step: 3,
      key: 'concept',
      title: t('services:process.steps.concept.title'),
      description: t('services:process.steps.concept.description'),
      icon: "Lightbulb",
      duration: t('services:process.steps.concept.duration')
    },
    {
      step: 4,
      key: 'design',
      title: t('services:process.steps.design.title'),
      description: t('services:process.steps.design.description'),
      icon: "Drafting",
      duration: t('services:process.steps.design.duration')
    },
    {
      step: 5,
      key: 'permits',
      title: t('services:process.steps.permits.title'),
      description: t('services:process.steps.permits.description'),
      icon: "FileText",
      duration: t('services:process.steps.permits.duration')
    },
    {
      step: 6,
      key: 'construction',
      title: t('services:process.steps.construction.title'),
      description: t('services:process.steps.construction.description'),
      icon: "HardHat",
      duration: t('services:process.steps.construction.duration')
    }
  ];

  const caseStudies = [
    {
      id: 1,
      service: t('services:services.newConstruction.title'),
      title: t('services:caseStudies.projects.modernHome.title'),
      location: t('services:caseStudies.projects.modernHome.location'),
      beforeImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop",
      outcome: t('services:caseStudies.projects.modernHome.outcome')
    },
    {
      id: 2,
      service: t('services:services.renovation.title'),
      title: t('services:caseStudies.projects.heritage.title'),
      location: t('services:caseStudies.projects.heritage.location'),
      beforeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop",
      outcome: t('services:caseStudies.projects.heritage.outcome')
    },
    {
      id: 3,
      service: t('services:services.interior.title'),
      title: t('services:caseStudies.projects.penthouse.title'),
      location: t('services:caseStudies.projects.penthouse.location'),
      beforeImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      outcome: t('services:caseStudies.projects.penthouse.outcome')
    }
  ];

  const faqs = t('services:faq.items', { returnObjects: true }).map((item, index) => ({
    id: index + 1,
    question: item.question,
    answer: item.answer
  }));

  const toggleService = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const breadcrumbs = [
    { name: 'Home', url: 'https://braunundeyer.de' },
    { name: 'Leistungen', url: 'https://braunundeyer.de/leistungen' }
  ];

  const faqSchemaData = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  const servicesSchema = combineSchemas(
    generateServiceSchema(),
    generateBreadcrumbSchema(breadcrumbs),
    generateFAQSchema(faqSchemaData)
  );

  // Background typography words for Services page - removed as we'll place them per section

  return (
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
      <SEO 
        title={`${t('services:title')} | Braun & Eyer ${t('translation:hero.title')}`}
        description={t('services:description')}
        keywords={`${t('services:services.newConstruction.title')}, ${t('services:services.renovation.title')}, ${t('services:services.energy.title')}, ${t('services:services.projectManagement.title')}`}
        structuredData={servicesSchema}
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
      
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 bg-surface/95 backdrop-blur-sm border-b border-border relative z-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Breadcrumb />
          <div className="mt-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
              {t('services:title')}
            </h1>
            <p className="text-xl lg:text-2xl text-text-secondary font-body leading-relaxed mb-8">
              {t('services:subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/${currentLang}/kontakt`}
                className="inline-flex items-center justify-center space-x-2 bg-accent text-white px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
              >
                <Icon name="Calendar" size={20} />
                <span>{t('services:cta.button')}</span>
              </Link>
              <Link
                to={`/${currentLang}/projekte`}
                className="inline-flex items-center justify-center space-x-2 border border-border text-text-primary px-8 py-4 rounded transition-all duration-200 hover:bg-surface font-body font-medium"
              >
                <Icon name="Eye" size={20} />
                <span>{t('translation:projects.viewAll')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 relative" style={{ zIndex: 5 }}>
        {/* Background Typography for Services Grid */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[14rem] opacity-[0.08] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "-8%", top: "25%" }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -15, 10, 0],
              rotate: [0, 0.4, -0.3, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            LEISTUNGEN
          </motion.div>
          <motion.div
            className="absolute text-9xl opacity-[0.12] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-10%", top: "60%" }}
            animate={{
              x: [0, -25, 15, 0],
              y: [0, 20, -12, 0],
              rotate: [0, -0.5, 0.4, 0],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              delay: 4,
              ease: "linear"
            }}
          >
            planung
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-12 lg:mb-16 z-content">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('services:title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('services:description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service) => (
              <div key={service.id} className="card-elevated rounded-lg overflow-hidden">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-white p-2 rounded">
                    <Icon name={service.icon} size={24} />
                  </div>
                </div>
                
                <div className="p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl lg:text-2xl font-heading font-medium text-primary">
                      {service.title}
                    </h3>
                    <span className="text-accent font-body font-semibold">
                      {service.startingPrice}
                    </span>
                  </div>
                  
                  <p className="text-text-secondary font-body mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-text-secondary">
                      <Icon name="Clock" size={16} />
                      <span>{t('services:services.labels.timeline')}: {service.timeline}</span>
                    </div>
                    <button
                      onClick={() => toggleService(service.id)}
                      className="flex items-center space-x-1 text-accent hover:text-accent/80 transition-colors duration-200 font-body font-medium"
                    >
                      <span>{expandedService === service.id ? t('services:services.labels.lessInfo') : t('services:services.labels.learnMore')}</span>
                      <Icon 
                        name={expandedService === service.id ? 'ChevronUp' : 'ChevronDown'} 
                        size={16} 
                      />
                    </button>
                  </div>
                  
                  {expandedService === service.id && (
                    <div className="border-t border-border pt-4 space-y-4">
                      <div>
                        <h4 className="font-body font-semibold text-primary mb-2">{t('services:services.labels.features')}:</h4>
                        <ul className="grid grid-cols-2 gap-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                              <Icon name="Check" size={14} className="text-accent" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-body font-semibold text-primary mb-2">{t('services:services.labels.deliverables')}:</h4>
                        <ul className="space-y-1">
                          {service.deliverables.map((deliverable, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                              <Icon name="FileText" size={14} className="text-accent" />
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 lg:py-24 bg-surface/95 backdrop-blur-sm relative" style={{ zIndex: 4 }}>
        {/* Background Typography for Process Section */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[11rem] opacity-[0.10] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-5%", top: "30%" }}
            animate={{
              x: [0, -20, 12, 0],
              y: [0, 15, -10, 0],
              rotate: [0, -0.3, 0.4, 0],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              delay: 2,
              ease: "linear"
            }}
          >
            PROZESS
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('services:process.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('services:process.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="bg-background rounded-lg p-6 lg:p-8 border border-border hover:shadow-subtle transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mr-4">
                      <Icon name={step.icon} size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-accent font-body font-semibold">
                        {t('translation:step')} {step.step}
                      </div>
                      <h3 className="text-lg font-heading font-medium text-primary">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary font-body mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="Clock" size={14} />
                    <span>{step.duration}</span>
                  </div>
                </div>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <Icon name="ArrowRight" size={20} className="text-accent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 lg:py-24 relative z-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('services:caseStudies.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('services:caseStudies.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <div key={study.id} className="card overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-body font-medium">
                      {study.service}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-heading font-medium text-primary mb-2">
                    {study.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-text-secondary text-sm mb-4">
                    <Icon name="MapPin" size={14} />
                    <span>{study.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-text-secondary mb-2 font-body font-medium">{t('services:caseStudies.before')}</div>
                      <div className="relative h-24 overflow-hidden rounded">
                        <Image
                          src={study.beforeImage}
                          alt={`${study.title} vorher`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary mb-2 font-body font-medium">{t('services:caseStudies.after')}</div>
                      <div className="relative h-24 overflow-hidden rounded">
                        <Image
                          src={study.afterImage}
                          alt={`${study.title} nachher`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary font-body text-sm leading-relaxed">
                    {study.outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Information */}
      <section className="py-16 lg:py-24 bg-surface/95 backdrop-blur-sm relative z-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('services:pricing.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body">
              {t('services:pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Icon name="MessageCircle" size={24} className="text-accent" />
                <h3 className="text-xl font-heading font-medium text-primary">
                  {t('services:pricing.consultation.title')}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">{t('services:pricing.consultation.items.initial')}</span>
                  <span className="font-body font-semibold text-primary">{t('services:pricing.consultation.items.initialPrice')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">{t('services:pricing.consultation.items.siteAnalysis')}</span>
                  <span className="font-body font-semibold text-primary">{t('services:pricing.consultation.items.siteAnalysisPrice')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">{t('services:pricing.consultation.items.feasibility')}</span>
                  <span className="font-body font-semibold text-primary">{t('services:pricing.consultation.items.feasibilityPrice')}</span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Icon name="FileText" size={24} className="text-accent" />
                <h3 className="text-xl font-heading font-medium text-primary">
                  {t('services:pricing.project.title')}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">{t('services:pricing.project.items.residential')}</span>
                  <span className="font-body font-semibold text-primary">{t('services:pricing.project.items.residentialPrice')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">{t('services:pricing.project.items.commercial')}</span>
                  <span className="font-body font-semibold text-primary">{t('services:pricing.project.items.commercialPrice')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">{t('services:pricing.project.items.interior')}</span>
                  <span className="font-body font-semibold text-primary">{t('services:pricing.project.items.interiorPrice')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-accent mt-1" />
              <div>
                <h4 className="font-body font-semibold text-primary mb-2">{t('services:pricing.payment.title')}</h4>
                <p className="text-text-secondary font-body text-sm leading-relaxed">
                  {t('services:pricing.payment.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 relative z-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('services:faq.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body">
              {t('services:faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="card">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-surface/50 transition-colors duration-200"
                >
                  <h3 className="font-body font-semibold text-primary pr-4">
                    {faq.question}
                  </h3>
                  <Icon 
                    name={expandedFaq === faq.id ? 'ChevronUp' : 'ChevronDown'} 
                    size={20} 
                    className="text-accent flex-shrink-0" 
                  />
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-6 border-t border-border">
                    <p className="text-text-secondary font-body leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Booking */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-accent/5 to-surface/95 backdrop-blur-sm relative z-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('services:cta.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body mb-8">
              {t('services:cta.description')}
            </p>
          </div>

          <div className="bg-background rounded-lg p-8 border border-border">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-primary font-body font-medium mb-2">
                    {t('services:contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                    placeholder={t('services:contact.form.name')}
                  />
                </div>
                
                <div>
                  <label className="block text-text-primary font-body font-medium mb-2">
                    {t('services:contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                    placeholder={t('services:contact.form.email')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-primary font-body font-medium mb-2">
                    {t('services:contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                    placeholder={t('services:contact.form.phone')}
                  />
                </div>
                
                <div>
                  <label className="block text-text-primary font-body font-medium mb-2">
                    {t('services:contact.form.service')} *
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                  >
                    <option value="">{t('services:contact.form.selectService')}</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-primary font-body font-medium mb-2">
                  {t('services:contact.form.projectDetails')}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200 resize-vertical"
                  placeholder={t('services:contact.form.projectPlaceholder')}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-accent text-white px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium flex items-center justify-center space-x-2"
                >
                  <Icon name="Calendar" size={20} />
                  <span>{t('services:cta.button')}</span>
                </button>
                
                <Link
                  to="/contact"
                  className="flex-1 border border-border text-text-primary px-8 py-4 rounded transition-all duration-200 hover:bg-surface font-body font-medium flex items-center justify-center space-x-2"
                >
                  <Icon name="MessageCircle" size={20} />
                  <span>{t('translation:contact.title')}</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services;