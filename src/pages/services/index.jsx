import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import CursorTrail from 'components/ui/CursorTrail';
import SEO from 'components/SEO';
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema, combineSchemas } from 'utils/structuredData';

const Services = () => {
  const navigate = useNavigate();
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
      title: "Neubau",
      icon: "Home",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      description: "Individuelle Neubauprojekte von Einfamilienhäusern bis zu Mehrfamilienhäusern und Geschäftsgebäuden. Moderne Architektur mit nachhaltigen Konzepten und energieeffizienten Lösungen.",
      timeline: "6-12 Monate",
      deliverables: ["Architekturpläne", "3D-Visualisierungen", "Materialspezifikationen", "Bauüberwachung"],
      features: ["Standortanalyse", "Raumplanung", "Energieberatung", "Landschaftsintegration"],
      startingPrice: "ab 8.000€"
    },
    {
      id: 2,
      title: "Altbausanierung",
      icon: "Building2",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      description: "Fachgerechte Sanierung historischer Gebäude unter Berücksichtigung von Denkmalschutz, Bauphysik und modernen Wohnstandards. Erhaltung des ursprünglichen Charakters bei zeitgemäßer Funktionalität.",
      timeline: "8-18 Monate",
      deliverables: ["Bestandsaufnahme", "Sanierungskonzept", "Genehmigungsplanung", "Baubegleitung"],
      features: ["Denkmalschutz", "Bauphysik", "Energetische Sanierung", "Barrierefreiheit"],
      startingPrice: "ab 12.000€"
    },
    {
      id: 3,
      title: "Innenarchitektur",
      icon: "Palette",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      description: "Komplette Innenraumgestaltung von der Raumaufteilung bis zur Möblierung. Funktionale und ästhetische Lösungen für Wohn- und Geschäftsräume mit Fokus auf optimale Raumnutzung.",
      timeline: "3-6 Monate",
      deliverables: ["Raumkonzept", "Materialauswahl", "Möblierungsplan", "Lichtplanung"],
      features: ["Farbberatung", "Möbelauswahl", "Lichtdesign", "Maßanfertigungen"],
      startingPrice: "ab 5.000€"
    },
    {
      id: 4,
      title: "Energieberatung",
      icon: "Wrench",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop",
      description: "Professionelle Energieberatung für Neubau und Sanierung. Optimierung der Energieeffizienz, Beratung zu Fördermitteln und Erstellung von Energieausweisen nach aktuellen Standards.",
      timeline: "2-4 Wochen",
      deliverables: ["Energieausweis", "Sanierungsfahrplan", "Fördermittelberatung", "Wirtschaftlichkeitsanalyse"],
      features: ["Thermografie", "Blower-Door-Test", "Fördermittelantrag", "KfW-Beratung"],
      startingPrice: "ab 800€"
    },
    {
      id: 5,
      title: "Projektmanagement",
      icon: "ClipboardList",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
      description: "Umfassende Projektbetreuung von der Planung bis zur Fertigstellung. Koordination aller Gewerke, Terminüberwachung und Qualitätskontrolle für einen reibungslosen Bauablauf.",
      timeline: "Projektdauer",
      deliverables: ["Terminpläne", "Qualitätsberichte", "Fortschrittsberichte", "Abnahmeprotokolle"],
      features: ["Gewerkekoordination", "Qualitätskontrolle", "Terminmanagement", "Kostenüberwachung"],
      startingPrice: "ab 3.000€"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Erstberatung",
      description: "Wir besprechen Ihre Vorstellungen, Anforderungen und Projektziele in einem ausführlichen Beratungsgespräch.",
      icon: "MessageCircle",
      duration: "1-2 Stunden"
    },
    {
      step: 2,
      title: "Standortanalyse",
      description: "Umfassende Bewertung der örtlichen Gegebenheiten, Beschränkungen und Möglichkeiten des Baugrundstücks.",
      icon: "MapPin",
      duration: "1-3 Tage"
    },
    {
      step: 3,
      title: "Konzeptentwicklung",
      description: "Erstellung erster Entwurfskonzepte und Erkundung verschiedener architektonischer Lösungsansätze.",
      icon: "Lightbulb",
      duration: "2-4 Wochen"
    },
    {
      step: 4,
      title: "Entwurfsplanung",
      description: "Verfeinerung des gewählten Konzepts mit detaillierten Plänen und Spezifikationen.",
      icon: "Drafting",
      duration: "4-8 Wochen"
    },
    {
      step: 5,
      title: "Genehmigungsplanung",
      description: "Erstellung der Bauunterlagen und Beantragung der erforderlichen Baugenehmigungen.",
      icon: "FileText",
      duration: "2-6 Wochen"
    },
    {
      step: 6,
      title: "Baubegleitung",
      description: "Kontinuierliche Betreuung während der Bauphase zur Sicherstellung der Planungsqualität.",
      icon: "HardHat",
      duration: "Bauzeit"
    }
  ];

  const caseStudies = [
    {
      id: 1,
      service: "Neubau",
      title: "Modernes Einfamilienhaus",
      location: "München-Schwabing",
      beforeImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop",
      outcome: "Energieeffizienter Neubau mit 40% weniger Energieverbrauch als gesetzlich vorgeschrieben."
    },
    {
      id: 2,
      service: "Altbausanierung",
      title: "Denkmalgeschütztes Stadthaus",
      location: "München-Altstadt",
      beforeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop",
      outcome: "Behutsame Sanierung unter Denkmalschutz mit Verbesserung der Energieeffizienz um 60%."
    },
    {
      id: 3,
      service: "Innenarchitektur",
      title: "Penthouse Wohnung",
      location: "München-Maxvorstadt",
      beforeImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      outcome: "Optimale Raumnutzung mit 30% mehr Stauraum bei verbesserter Wohnqualität."
    }
  ];

  const faqs = [
    {
      id: 1,
      question: "Was ist in der Erstberatung enthalten?",
      answer: `Unsere Erstberatung umfasst eine ausführliche Besprechung Ihrer Projektziele, eine Besichtigung vor Ort falls erforderlich, eine erste Machbarkeitsbewertung und einen Überblick über unser Planungsverfahren. Sie erhalten außerdem ein detailliertes Angebot mit Leistungsumfang, Zeitplan und Investitionsrahmen für Ihr Projekt.`
    },
    {
      id: 2,
      question: "Wie lange dauert ein typisches Wohnbauprojekt?",
      answer: `Wohnbauprojekte dauern in der Regel 6-12 Monate von der ersten Planung bis zur Baufreigabe. Die Dauer kann je nach Projektgröße, Komplexität und Entscheidungsprozess variieren. Wir erstellen detaillierte Terminpläne bereits in der Angebotsphase.`
    },
    {
      id: 3,
      question: "Übernehmen Sie die Baugenehmigung?",
      answer: `Ja, wir unterstützen Sie bei allen erforderlichen Genehmigungsverfahren und behördlichen Abstimmungen. Unser Team kennt die örtlichen Bauvorschriften und Genehmigungsverfahren und sorgt dafür, dass Ihr Projekt alle Compliance-Standards erfüllt.`
    },
    {
      id: 4,
      question: "Können Sie innerhalb eines bestimmten Budgets arbeiten?",
      answer: `Selbstverständlich. Wir arbeiten eng mit unseren Kunden zusammen, um realistische Budgets zu erstellen und Lösungen zu entwickeln, die den größtmöglichen Wert innerhalb Ihrer Investitionsparameter bieten. Wir erstellen Kostenschätzungen während des gesamten Planungsprozesses.`
    },
    {
      id: 5,
      question: "Bieten Sie 3D-Visualisierungen an?",
      answer: `Ja, 3D-Visualisierungen sind in den meisten unserer Planungspakete enthalten. Diese helfen unseren Kunden, das geplante Design besser zu verstehen und fundierte Entscheidungen über Materialien, Oberflächen und Raumaufteilung zu treffen, bevor die Bauarbeiten beginnen.`
    }
  ];

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
        title="Leistungen | Braun & Eyer Architekturbüro - Neubau, Sanierung & mehr"
        description="Unsere Architekturleistungen: Neubauplanung, Altbausanierung, Energieberatung, Denkmalschutz. Individuelle Lösungen für Ihr Bauprojekt."
        keywords="Architekturleistungen, Neubauplanung, Altbausanierung, Energieberatung, Denkmalschutz, Bauplanung Saarbrücken, Architekt Leistungen"
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
              Unsere Leistungen
            </h1>
            <p className="text-xl lg:text-2xl text-text-secondary font-body leading-relaxed mb-8">
              Umfassende Architekturleistungen von Neubau bis Altbausanierung - maßgeschneidert für Ihre Vision mit Expertise, Kreativität und Präzision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center space-x-2 bg-accent text-white px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
              >
                <Icon name="Calendar" size={20} />
                <span>Beratungstermin vereinbaren</span>
              </Link>
              <Link
                to="/project-gallery"
                className="inline-flex items-center justify-center space-x-2 border border-border text-text-primary px-8 py-4 rounded transition-all duration-200 hover:bg-surface font-body font-medium"
              >
                <Icon name="Eye" size={20} />
                <span>Unsere Projekte ansehen</span>
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
              Was wir anbieten
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Von der Konzeption bis zur Fertigstellung bieten wir umfassende Architekturleistungen für Ihre individuellen Bedürfnisse.
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
                      <span>Dauer: {service.timeline}</span>
                    </div>
                    <button
                      onClick={() => toggleService(service.id)}
                      className="flex items-center space-x-1 text-accent hover:text-accent/80 transition-colors duration-200 font-body font-medium"
                    >
                      <span>{expandedService === service.id ? 'Weniger Details' : 'Mehr Details'}</span>
                      <Icon 
                        name={expandedService === service.id ? 'ChevronUp' : 'ChevronDown'} 
                        size={16} 
                      />
                    </button>
                  </div>
                  
                  {expandedService === service.id && (
                    <div className="border-t border-border pt-4 space-y-4">
                      <div>
                        <h4 className="font-body font-semibold text-primary mb-2">Leistungsmerkmale:</h4>
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
                        <h4 className="font-body font-semibold text-primary mb-2">Leistungsumfang:</h4>
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
              Unser Planungsprozess
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Ein strukturierter Ansatz, der Qualitätsergebnisse und klare Kommunikation während Ihres gesamten Projekts gewährleistet.
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
                        Schritt {step.step}
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
              Erfolgsgeschichten
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Reale Projekte, die die Wirkung unserer architektonischen Expertise demonstrieren.
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
                      <div className="text-xs text-text-secondary mb-2 font-body font-medium">Vorher</div>
                      <div className="relative h-24 overflow-hidden rounded">
                        <Image
                          src={study.beforeImage}
                          alt={`${study.title} vorher`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary mb-2 font-body font-medium">Nachher</div>
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
              Investition & Honorare
            </h2>
            <p className="text-lg text-text-secondary font-body">
              Transparente Honorarstruktur, die in jeder Phase Ihres Projekts Mehrwert bietet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Icon name="MessageCircle" size={24} className="text-accent" />
                <h3 className="text-xl font-heading font-medium text-primary">
                  Beratungsleistungen
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">Erstberatung</span>
                  <span className="font-body font-semibold text-primary">150€/Stunde</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">Standortanalyse</span>
                  <span className="font-body font-semibold text-primary">800€-2.500€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">Machbarkeitsstudie</span>
                  <span className="font-body font-semibold text-primary">1.500€-4.000€</span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Icon name="FileText" size={24} className="text-accent" />
                <h3 className="text-xl font-heading font-medium text-primary">
                  Projekthonorare
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">Wohnbauprojekte</span>
                  <span className="font-body font-semibold text-primary">10-15% der Bausumme</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">Gewerbeprojekte</span>
                  <span className="font-body font-semibold text-primary">8-12% der Bausumme</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-body">Innenarchitektur</span>
                  <span className="font-body font-semibold text-primary">200€-400€/m²</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-accent mt-1" />
              <div>
                <h4 className="font-body font-semibold text-primary mb-2">Zahlungsstruktur</h4>
                <p className="text-text-secondary font-body text-sm leading-relaxed">
                  Projekte werden typischerweise mit 30% Anzahlung, 40% bei Abschluss der Entwurfsplanung und 30% bei Fertigstellung strukturiert. Wir bieten flexible Zahlungspläne für größere Projekte und stellen detaillierte Kostenaufschlüsselungen in der Angebotsphase zur Verfügung.
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
              Häufig gestellte Fragen
            </h2>
            <p className="text-lg text-text-secondary font-body">
              Häufige Fragen zu unseren Leistungen und unserem Planungsprozess.
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
              Bereit für Ihr Projekt?
            </h2>
            <p className="text-lg text-text-secondary font-body mb-8">
              Vereinbaren Sie einen Beratungstermin, um Ihre architektonischen Bedürfnisse zu besprechen und zu erkunden, wie wir Ihre Vision verwirklichen können.
            </p>
          </div>

          <div className="bg-background rounded-lg p-8 border border-border">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-primary font-body font-medium mb-2">
                    Vollständiger Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                    placeholder="Ihr vollständiger Name"
                  />
                </div>
                
                <div>
                  <label className="block text-text-primary font-body font-medium mb-2">
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                    placeholder="Ihre E-Mail-Adresse"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-primary font-body font-medium mb-2">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                    placeholder="Ihre Telefonnummer"
                  />
                </div>
                
                <div>
                  <label className="block text-text-primary font-body font-medium mb-2">
                    Gewünschte Leistung *
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                  >
                    <option value="">Leistung auswählen</option>
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
                  Projektbeschreibung
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200 resize-vertical"
                  placeholder="Erzählen Sie uns von Ihren Projektzielen, Zeitplan und spezifischen Anforderungen..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-accent text-white px-8 py-4 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium flex items-center justify-center space-x-2"
                >
                  <Icon name="Calendar" size={20} />
                  <span>Beratungstermin vereinbaren</span>
                </button>
                
                <Link
                  to="/contact"
                  className="flex-1 border border-border text-text-primary px-8 py-4 rounded transition-all duration-200 hover:bg-surface font-body font-medium flex items-center justify-center space-x-2"
                >
                  <Icon name="MessageCircle" size={20} />
                  <span>Allgemeine Anfrage</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 lg:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                  <Icon name="Triangle" size={20} color="white" />
                </div>
                <div className="font-heading font-semibold text-xl">Braun & Eyer</div>
              </div>
              <p className="text-white/80 font-body leading-relaxed">
                Außergewöhnliche Architekturlösungen, die Innovation mit Funktionalität verbinden.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Leistungen</h4>
              <ul className="space-y-2">
                {services.slice(0, 4).map((service) => (
                  <li key={service.id}>
                    <span className="text-white/80 hover:text-white transition-colors duration-200 font-body">
                      {service.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Schnellzugriff</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/project-gallery" className="text-white/80 hover:text-white transition-colors duration-200 font-body">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="text-white/80 hover:text-white transition-colors duration-200 font-body">
                    Über uns
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/80 hover:text-white transition-colors duration-200 font-body">
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Kontakt</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-accent" />
                  <span className="text-white/80 font-body">+49 (89) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-accent" />
                  <span className="text-white/80 font-body">info@braun-eyer.de</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-accent" />
                  <span className="text-white/80 font-body">Maximilianstraße 35, München</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p 
              className="text-white/60 font-body cursor-pointer select-none transition-colors duration-200 hover:text-white/80"
              onClick={handleCopyrightClick}
              style={{ userSelect: 'none' }}
            >
              © {new Date().getFullYear()} Braun & Eyer Architekturbüro Ingenieure. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;