'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Calendar, Eye, Home, Building2, Palette, Wrench, TreePine, Clock, ChevronDown, ChevronUp, Check, Plus, HelpCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ServicesPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang || 'de';
  const [expandedService, setExpandedService] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [dict, setDict] = useState({});
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Load translations
  useEffect(() => {
    import(`@/lib/locales/${lang}/services.json`).then(module => {
      setDict(module.default);
    });
    import(`@/lib/locales/${lang}/translation.json`).then(module => {
      setDict(prev => ({ ...prev, translation: module.default }));
    });
  }, [lang]);

  // Handle triple-click on footer copyright
  const handleCopyrightClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    if (newClickCount === 3) {
      router.push('/de/admin');
      setClickCount(0);
      return;
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 500);
  };

  const services = [
    {
      id: 1,
      key: 'newConstruction',
      title: dict?.services?.newConstruction?.title || 'Neubau',
      icon: Home,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      description: dict?.services?.newConstruction?.description || 'Moderne Neubauprojekte nach Ihren Wünschen',
      timeline: dict?.services?.newConstruction?.timeline || '6-12 Monate',
      deliverables: dict?.services?.newConstruction?.deliverables || [],
      features: dict?.services?.newConstruction?.features || ['Energieeffizienz', 'Moderne Architektur', 'Individuelle Planung', 'Nachhaltigkeit'],
      startingPrice: dict?.services?.newConstruction?.startingPrice || 'ab €2.500/m²'
    },
    {
      id: 2,
      key: 'renovation',
      title: dict?.services?.renovation?.title || 'Altbausanierung',
      icon: Building2,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      description: dict?.services?.renovation?.description || 'Behutsame Modernisierung historischer Gebäude',
      timeline: dict?.services?.renovation?.timeline || '3-9 Monate',
      deliverables: dict?.services?.renovation?.deliverables || [],
      features: dict?.services?.renovation?.features || ['Denkmalschutz', 'Energetische Sanierung', 'Werterhaltung', 'Modernisierung'],
      startingPrice: dict?.services?.renovation?.startingPrice || 'ab €1.800/m²'
    },
    {
      id: 3,
      key: 'interior',
      title: dict?.services?.interior?.title || 'Innenarchitektur',
      icon: Palette,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      description: dict?.services?.interior?.description || 'Kreative Raumkonzepte für Wohn- und Geschäftsräume',
      timeline: dict?.services?.interior?.timeline || '2-6 Monate',
      deliverables: dict?.services?.interior?.deliverables || [],
      features: dict?.services?.interior?.features || ['Raumplanung', 'Lichtkonzepte', 'Materialauswahl', 'Möbeldesign'],
      startingPrice: dict?.services?.interior?.startingPrice || 'ab €150/m²'
    },
    {
      id: 4,
      key: 'energy',
      title: dict?.services?.energy?.title || 'Energieberatung',
      icon: Wrench,
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop",
      description: dict?.services?.energy?.description || 'Nachhaltige Energiekonzepte und Beratung',
      timeline: dict?.services?.energy?.timeline || '1-2 Monate',
      deliverables: dict?.services?.energy?.deliverables || [],
      features: dict?.services?.energy?.features || ['Energieausweis', 'KfW-Beratung', 'Solarberatung', 'Wärmepumpen'],
      startingPrice: dict?.services?.energy?.startingPrice || 'ab €2.000'
    },
    {
      id: 5,
      key: 'landscape',
      title: dict?.services?.landscape?.title || 'Landschaftsplanung',
      icon: TreePine,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      description: dict?.services?.landscape?.description || 'Harmonische Außenraumgestaltung',
      timeline: dict?.services?.landscape?.timeline || '2-4 Monate',
      deliverables: dict?.services?.landscape?.deliverables || [],
      features: dict?.services?.landscape?.features || ['Gartenplanung', 'Außenanlagen', 'Dachbegrünung', 'Wasserflächen'],
      startingPrice: dict?.services?.landscape?.startingPrice || 'ab €100/m²'
    },
    {
      id: 6,
      key: 'projectManagement',
      title: dict?.services?.projectManagement?.title || 'Projektmanagement',
      icon: Building2,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
      description: dict?.services?.projectManagement?.description || 'Professionelle Baubegleitung und Koordination',
      timeline: dict?.services?.projectManagement?.timeline || 'Projektabhängig',
      deliverables: dict?.services?.projectManagement?.deliverables || [],
      features: dict?.services?.projectManagement?.features || ['Bauüberwachung', 'Kostenkontrolle', 'Terminplanung', 'Qualitätssicherung'],
      startingPrice: dict?.services?.projectManagement?.startingPrice || 'nach Vereinbarung'
    }
  ];

  const processSteps = [
    {
      id: 1,
      title: dict?.process?.step1?.title || 'Erstberatung',
      description: dict?.process?.step1?.description || 'Unverbindliches Kennenlernen und Bedarfsanalyse',
      icon: HelpCircle,
      duration: dict?.process?.step1?.duration || '1-2 Tage'
    },
    {
      id: 2,
      title: dict?.process?.step2?.title || 'Konzept & Planung',
      description: dict?.process?.step2?.description || 'Entwicklung individueller Lösungskonzepte',
      icon: Building2,
      duration: dict?.process?.step2?.duration || '2-4 Wochen'
    },
    {
      id: 3,
      title: dict?.process?.step3?.title || 'Ausführungsplanung',
      description: dict?.process?.step3?.description || 'Detaillierte technische Planung',
      icon: Wrench,
      duration: dict?.process?.step3?.duration || '4-8 Wochen'
    },
    {
      id: 4,
      title: dict?.process?.step4?.title || 'Umsetzung',
      description: dict?.process?.step4?.description || 'Professionelle Bauausführung und Überwachung',
      icon: Home,
      duration: dict?.process?.step4?.duration || 'Projektabhängig'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: dict?.faq?.items?.[0]?.question || 'Wie lange dauert ein typisches Projekt?',
      answer: dict?.faq?.items?.[0]?.answer || 'Die Projektdauer hängt von der Art und dem Umfang ab. Ein Neubau dauert typischerweise 6-12 Monate.'
    },
    {
      id: 2,
      question: dict?.faq?.items?.[1]?.question || 'Welche Leistungsphasen bieten Sie an?',
      answer: dict?.faq?.items?.[1]?.answer || 'Wir bieten alle HOAI-Leistungsphasen von 1-9 an, von der Grundlagenermittlung bis zur Objektbetreuung.'
    },
    {
      id: 3,
      question: dict?.faq?.items?.[2]?.question || 'Arbeiten Sie auch mit Bestandsgebäuden?',
      answer: dict?.faq?.items?.[2]?.answer || 'Ja, wir sind auf Altbausanierung und Denkmalschutz spezialisiert und haben langjährige Erfahrung.'
    },
    {
      id: 4,
      question: dict?.faq?.items?.[3]?.question || 'Wie erfolgt die Kostenberechnung?',
      answer: dict?.faq?.items?.[3]?.answer || 'Die Kosten werden nach der HOAI (Honorarordnung für Architekten und Ingenieure) berechnet.'
    },
    {
      id: 5,
      question: dict?.faq?.items?.[4]?.question || 'Bieten Sie auch Energieberatung an?',
      answer: dict?.faq?.items?.[4]?.answer || 'Ja, wir bieten umfassende Energieberatung und unterstützen bei Förderanträgen.'
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

  const breadcrumbItems = [
    { href: `/${lang}/homepage`, label: dict?.translation?.nav?.home || 'Startseite' },
    { label: dict?.title || 'Leistungen' }
  ];

  return (
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
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

      <Header dict={dict.translation} lang={lang} />

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
      <section className="pt-20 lg:pt-24 bg-surface/95 backdrop-blur-sm border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
              {dict?.title || 'Unsere Leistungen'}
            </h1>
            <p className="text-xl lg:text-2xl text-text-secondary font-body leading-relaxed mb-8">
              {dict?.subtitle || 'Professionelle Architektur- und Planungsleistungen'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${lang}/kontakt`}
                className="inline-flex items-center justify-center space-x-2 bg-accent text-white px-8 py-4 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg font-body font-medium"
              >
                <Calendar size={20} />
                <span>{dict?.cta?.button || 'Beratungstermin vereinbaren'}</span>
              </Link>
              <Link
                href={`/${lang}/projekte`}
                className="inline-flex items-center justify-center space-x-2 border border-border text-text-primary px-8 py-4 rounded transition-all duration-200 hover:bg-surface font-body font-medium"
              >
                <Eye size={20} />
                <span>{dict?.translation?.projects?.viewAll || 'Projekte ansehen'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Typography */}
        <div className="absolute inset-0 w-full pointer-events-none">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {dict?.title || 'Unsere Leistungen'}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {dict?.description || 'Von der ersten Idee bis zur Fertigstellung - wir begleiten Sie durch alle Projektphasen'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div 
                  key={service.id} 
                  className="bg-surface rounded-lg overflow-hidden shadow-subtle hover:shadow-elevation transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: service.id * 0.1 }}
                >
                  <div className="relative h-48 lg:h-56 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-accent text-white p-2 rounded">
                      <Icon size={24} />
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
                        <Clock size={16} />
                        <span>{dict?.services?.labels?.timeline || 'Dauer'}: {service.timeline}</span>
                      </div>
                      <button
                        onClick={() => toggleService(service.id)}
                        className="flex items-center space-x-1 text-accent hover:text-accent/80 transition-colors duration-200 font-body font-medium"
                      >
                        <span>{expandedService === service.id ? (dict?.services?.labels?.lessInfo || 'Weniger') : (dict?.services?.labels?.learnMore || 'Mehr erfahren')}</span>
                        {expandedService === service.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    
                    {expandedService === service.id && (
                      <motion.div 
                        className="border-t border-border pt-4 space-y-4"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <h4 className="font-body font-semibold text-primary mb-2">{dict?.services?.labels?.features || 'Leistungen'}:</h4>
                          <ul className="grid grid-cols-2 gap-2">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                                <Check size={14} className="text-accent flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-surface/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {dict?.process?.title || 'Unser Prozess'}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {dict?.process?.subtitle || 'Von der ersten Idee bis zum fertigen Projekt'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {processSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-background rounded-lg p-6 text-center h-full flex flex-col">
                    <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <StepIcon size={24} className="text-accent" />
                    </div>
                    <h3 className="text-lg font-heading font-medium text-primary mb-2">{step.title}</h3>
                    <p className="text-text-secondary font-body text-sm flex-grow">{step.description}</p>
                    <div className="mt-4 text-sm text-accent font-body">{step.duration}</div>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-accent">
                      <ArrowRight size={24} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {dict?.faq?.title || 'Häufig gestellte Fragen'}
            </h2>
            <p className="text-lg text-text-secondary font-body">
              {dict?.faq?.subtitle || 'Antworten auf Ihre wichtigsten Fragen'}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-surface rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-surface/80 transition-colors duration-200"
                >
                  <h3 className="text-lg font-body font-medium text-primary pr-4">{faq.question}</h3>
                  <Plus 
                    size={20} 
                    className={`text-accent transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-45' : ''}`}
                  />
                </button>
                {expandedFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-text-secondary font-body leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 lg:py-24 bg-gradient-to-r from-accent/10 to-accent/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
            {dict?.cta?.title || 'Bereit für Ihr Projekt?'}
          </h2>
          <p className="text-lg text-text-secondary font-body mb-8">
            {dict?.cta?.subtitle || 'Lassen Sie uns gemeinsam Ihre Vision verwirklichen'}
          </p>
          <Link
            href={`/${lang}/kontakt`}
            className="inline-flex items-center space-x-2 bg-accent text-white px-8 py-4 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg font-body font-medium"
          >
            <span>{dict?.cta?.button || 'Jetzt Kontakt aufnehmen'}</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.section>

      <Footer dict={dict.translation} lang={lang} onCopyrightClick={handleCopyrightClick} />
    </div>
  );
}