import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import CursorTrail from '../../components/ui/CursorTrail';
import SEO from '../../components/SEO';
import { generateBreadcrumbSchema, generatePersonSchema, combineSchemas } from '../../utils/structuredData';

const AboutUs = () => {
  const { t, i18n } = useTranslation(['about', 'translation']);
  const location = useLocation();
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';
  
  const [expandedMember, setExpandedMember] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Braun & Eyer Daten
  const officePhilosophy = {
    title: t('about:subtitle'),
    description: `${t('about:philosophy.text1')} ${t('about:philosophy.text2')}`,
    backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  };

  const teamMembers = [
    {
      id: 1,
      name: "Dipl.-Ing. Christian F. Braun",
      title: currentLang === 'de' ? "Geschäftsführender Architekt" : "Managing Architect",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: currentLang === 'de' ? "Führt das Architekturbüro mit über 20 Jahren Erfahrung in Neubau und Altbausanierung. Spezialist für nachhaltige Architektur und energieeffizientes Bauen." : "Leading the architecture office with over 20 years of experience in new construction and building renovation. Specialist in sustainable architecture and energy-efficient construction.",
      education: currentLang === 'de' ? "Diplom-Ingenieur Architektur, Universität des Saarlandes" : "Diploma in Architecture Engineering, University of Saarland",
      certifications: currentLang === 'de' ? "Architektenkammer Saarland, Energieberater" : "Saarland Chamber of Architects, Energy Consultant",
      specializations: currentLang === 'de' ? ["Neubau", "Altbausanierung", "Energieberatung"] : ["New Construction", "Building Renovation", "Energy Consulting"],
      notableProjects: currentLang === 'de' ? ["Wohnanlage Saarbrücken", "Sanierung Denkmalschutz", "Einfamilienhaus Modern"] : ["Saarbrücken Residential Complex", "Heritage Building Renovation", "Modern Single-Family Home"]
    },
    {
      id: 2,
      name: "Dipl.-Ing. Patric Eyer",
      title: currentLang === 'de' ? "Partner & Architekt" : "Partner & Architect",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: currentLang === 'de' ? "Experte für Innenarchitektur und Raumplanung mit Fokus auf funktionale und ästhetische Lösungen für Wohn- und Geschäftsräume." : "Expert in interior design and space planning with focus on functional and aesthetic solutions for residential and commercial spaces.",
      education: currentLang === 'de' ? "Diplom-Ingenieur Architektur, Universität des Saarlandes" : "Diploma in Architecture Engineering, University of Saarland",
      certifications: currentLang === 'de' ? "Architektenkammer Saarland, DGNB Auditor" : "Saarland Chamber of Architects, DGNB Auditor",
      specializations: currentLang === 'de' ? ["Innenarchitektur", "Raumplanung", "Nachhaltiges Bauen"] : ["Interior Design", "Space Planning", "Sustainable Construction"],
      notableProjects: currentLang === 'de' ? ["Bürogebäude Saarbrücken", "Penthouse Sanierung", "Mehrfamilienhaus Neubau"] : ["Saarbrücken Office Building", "Penthouse Renovation", "Multi-Family New Construction"]
    },
    {
      id: 3,
      name: "M.Sc. Thomas Weber",
      title: currentLang === 'de' ? "Projektleiter Neubau" : "New Construction Project Manager",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: currentLang === 'de' ? "Verantwortlich für die Projektabwicklung von Neubauprojekten von der Planung bis zur Fertigstellung mit Fokus auf termingerechte Umsetzung." : "Responsible for project management of new construction projects from planning to completion with focus on timely implementation.",
      education: currentLang === 'de' ? "Master of Science Architektur, RWTH Aachen" : "Master of Science Architecture, RWTH Aachen",
      certifications: currentLang === 'de' ? "Projektmanagement Zertifikat, BIM Manager" : "Project Management Certificate, BIM Manager",
      specializations: currentLang === 'de' ? ["Projektmanagement", "BIM-Planung", "Bauüberwachung"] : ["Project Management", "BIM Planning", "Construction Supervision"],
      notableProjects: currentLang === 'de' ? ["Wohnkomplex Schwabing", "Geschäftshaus Zentrum", "Studentenwohnheim"] : ["Schwabing Residential Complex", "Center Business Building", "Student Housing"]
    },
    {
      id: 4,
      name: "Dipl.-Ing. (FH) Sandra Klein",
      title: currentLang === 'de' ? "Spezialistin Altbausanierung" : "Building Renovation Specialist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: currentLang === 'de' ? "Expertin für die Sanierung historischer Gebäude und Denkmalschutz mit umfassendem Wissen über traditionelle Bautechniken." : "Expert in renovation of historic buildings and monument protection with comprehensive knowledge of traditional construction techniques.",
      education: currentLang === 'de' ? "Diplom-Ingenieur (FH) Architektur, HS München" : "Diploma in Architecture Engineering (FH), Munich University",
      certifications: currentLang === 'de' ? "Sachverständige Altbau, Denkmalschutz Zertifikat" : "Old Building Expert, Heritage Protection Certificate",
      specializations: currentLang === 'de' ? ["Altbausanierung", "Denkmalschutz", "Bauphysik"] : ["Building Renovation", "Heritage Protection", "Building Physics"],
      notableProjects: currentLang === 'de' ? ["Villa Jugendstil", "Altstadt Sanierung", "Historisches Stadthaus"] : ["Art Nouveau Villa", "Old Town Renovation", "Historic Townhouse"]
    }
  ];

  const milestones = [
    {
      year: t('about:milestones.items.founding.year'),
      title: t('about:milestones.items.founding.title'),
      description: t('about:milestones.items.founding.description')
    },
    {
      year: t('about:milestones.items.firstAward.year'),
      title: t('about:milestones.items.firstAward.title'),
      description: t('about:milestones.items.firstAward.description')
    },
    {
      year: t('about:milestones.items.sustainability.year'),
      title: t('about:milestones.items.sustainability.title'),
      description: t('about:milestones.items.sustainability.description')
    },
    {
      year: t('about:milestones.items.digital.year'),
      title: t('about:milestones.items.digital.title'),
      description: t('about:milestones.items.digital.description')
    },
    {
      year: t('about:milestones.items.pandemic.year'),
      title: t('about:milestones.items.pandemic.title'),
      description: t('about:milestones.items.pandemic.description')
    },
    {
      year: t('about:milestones.items.expansion.year'),
      title: t('about:milestones.items.expansion.title'),
      description: t('about:milestones.items.expansion.description')
    }
  ];

  const services = [
    {
      icon: "Home",
      title: t('about:services.items.newConstruction.title'),
      description: t('about:services.items.newConstruction.description')
    },
    {
      icon: "Building2",
      title: t('about:services.items.renovation.title'),
      description: t('about:services.items.renovation.description')
    },
    {
      icon: "Palette",
      title: t('about:services.items.interior.title'),
      description: t('about:services.items.interior.description')
    },
    {
      icon: "Users",
      title: t('about:services.items.consulting.title'),
      description: t('about:services.items.consulting.description')
    }
  ];

  const testimonials = [
    {
      id: 1,
      client: t('about:testimonials.items.0.client'),
      company: t('about:testimonials.items.0.company'),
      quote: t('about:testimonials.items.0.quote'),
      project: t('about:testimonials.items.0.project'),
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      client: t('about:testimonials.items.1.client'),
      company: t('about:testimonials.items.1.company'),
      quote: t('about:testimonials.items.1.quote'),
      project: t('about:testimonials.items.1.project'),
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      client: t('about:testimonials.items.2.client'),
      company: t('about:testimonials.items.2.company'),
      quote: t('about:testimonials.items.2.quote'),
      project: t('about:testimonials.items.2.project'),
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const awards = [
    {
      title: t('about:awards.items.architecture'),
      year: "2023",
      category: currentLang === 'de' ? "Altbausanierung" : "Building Renovation"
    },
    {
      title: t('about:awards.items.sustainability'),
      year: "2022",
      category: currentLang === 'de' ? "Energieeffizientes Bauen" : "Energy-Efficient Construction"
    },
    {
      title: t('about:awards.items.innovation'),
      year: "2021",
      category: currentLang === 'de' ? "Wohnungsbau" : "Residential Construction"
    },
    {
      title: t('about:awards.items.heritage'),
      year: "2020",
      category: currentLang === 'de' ? "Historische Sanierung" : "Historic Renovation"
    }
  ];

  const toggleMemberDetails = (memberId) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
    { name: t('translation:nav.home'), url: `https://braunundeyer.de/${currentLang}` },
    { name: t('about:title'), url: `https://braunundeyer.de/${currentLang}/uber-uns` }
  ];

  const teamSchema = combineSchemas(
    generateBreadcrumbSchema(breadcrumbs),
    generatePersonSchema({ name: 'Herr Braun', jobTitle: 'Geschäftsführender Architekt' }),
    generatePersonSchema({ name: 'Herr Eyer', jobTitle: 'Geschäftsführender Architekt' })
  );

  // Background typography words for About page - removed as we'll place them per section

  return (
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
      <SEO 
        title={`${t('about:title')} | Braun & Eyer ${currentLang === 'de' ? 'Architekturbüro - Ihre Experten für Architektur' : 'Architecture - Your Architecture Experts'}`}
        description={t('about:description')}
        keywords={currentLang === 'de' ? 'Architekturbüro Team, Braun Eyer Geschichte, Architekten Saarbrücken, Unternehmensphilosophie, Architektur Expertise' : 'Architecture Team, Braun Eyer History, Architects Saarbrücken, Company Philosophy, Architecture Expertise'}
        structuredData={teamSchema}
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
      
      {/* Breadcrumb Section */}
      <section className="pt-20 lg:pt-24 bg-surface/95 backdrop-blur-sm border-b border-border relative z-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Breadcrumb />
          <div className="mt-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
              {t('about:title')}
            </h1>
            <p className="text-xl lg:text-2xl text-text-secondary font-body leading-relaxed">
              {officePhilosophy.title}
            </p>
          </div>
        </div>
      </section>

      {/* Hero Section with Philosophy */}
      <section className="relative z-base">
        <div className="relative h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={officePhilosophy.backgroundImage}
            alt="Braun & Eyer Büro"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <div className="max-w-2xl mx-auto">
                <p className="text-lg lg:text-xl font-body leading-relaxed opacity-90">
                  {officePhilosophy.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16 lg:py-24 relative" style={{ zIndex: 5 }}>
        {/* Background Typography for Team Section */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[15rem] opacity-[0.08] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "-10%", top: "30%" }}
            animate={{
              x: [0, 25, -15, 0],
              y: [0, -10, 15, 0],
              rotate: [0, 0.3, -0.2, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            TEAM
          </motion.div>
          <motion.div
            className="absolute text-8xl opacity-[0.12] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-5%", top: "60%" }}
            animate={{
              x: [0, -20, 10, 0],
              y: [0, 12, -8, 0],
              rotate: [0, -0.4, 0.5, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              delay: 3,
              ease: "linear"
            }}
          >
            expertise
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-16 z-content">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('about:team.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('about:team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="card-elevated rounded-lg overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-heading font-medium text-primary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent font-body font-medium mb-3">
                    {member.title}
                  </p>
                  <p className="text-text-secondary font-body text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <button
                    onClick={() => toggleMemberDetails(member.id)}
                    className="flex items-center space-x-2 text-accent hover:text-primary transition-colors duration-200 font-body font-medium text-sm"
                  >
                    <span>{expandedMember === member.id ? t('about:team.viewLess') : t('about:team.viewMore')}</span>
                    <Icon 
                      name={expandedMember === member.id ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  </button>

                  {expandedMember === member.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div>
                        <h4 className="font-body font-medium text-primary text-sm mb-1">{t('about:team.education')}</h4>
                        <p className="text-text-secondary text-sm">{member.education}</p>
                      </div>
                      <div>
                        <h4 className="font-body font-medium text-primary text-sm mb-1">{t('about:team.certifications')}</h4>
                        <p className="text-text-secondary text-sm">{member.certifications}</p>
                      </div>
                      <div>
                        <h4 className="font-body font-medium text-primary text-sm mb-1">{t('about:team.specializations')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.specializations.map((spec, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full font-body"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-body font-medium text-primary text-sm mb-1">{t('about:team.notableProjects')}</h4>
                        <ul className="text-text-secondary text-sm space-y-1">
                          {member.notableProjects.map((project, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Icon name="ArrowRight" size={12} className="text-accent" />
                              <span>{project}</span>
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

      {/* Office History Timeline */}
      <section className="py-16 lg:py-24 bg-surface/95 backdrop-blur-sm relative" style={{ zIndex: 4 }}>
        {/* Background Typography for History Section */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[12rem] opacity-[0.10] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-8%", top: "20%" }}
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 15, -10, 0],
              rotate: [0, 0.5, -0.3, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              delay: 2,
              ease: "linear"
            }}
          >
            TRADITION
          </motion.div>
          <motion.div
            className="absolute text-7xl opacity-[0.14] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "5%", top: "70%" }}
            animate={{
              x: [0, 20, -12, 0],
              y: [0, -15, 10, 0],
              rotate: [0, -0.3, 0.4, 0],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              delay: 5,
              ease: "linear"
            }}
          >
            geschichte
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-16 z-content">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('about:milestones.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('about:milestones.subtitle')}
            </p>
          </div>

          {/* Mobile Timeline (Vertical) */}
          <div className="lg:hidden space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-heading font-medium">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="card-elevated rounded-lg p-4">
                    <h3 className="font-heading font-medium text-primary mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-accent font-body font-medium text-sm mb-2">
                      {milestone.year}
                    </p>
                    <p className="text-text-secondary font-body text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Timeline (Horizontal) */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2"></div>
              <div className="flex justify-between items-center relative">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex flex-col items-center max-w-48">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-heading font-medium text-lg mb-4 relative z-10">
                      {milestone.year.slice(-2)}
                    </div>
                    <div className="bg-background rounded-lg p-4 border border-border shadow-subtle text-center">
                      <h3 className="font-heading font-medium text-primary mb-1 text-sm">
                        {milestone.title}
                      </h3>
                      <p className="text-accent font-body font-medium text-xs mb-2">
                        {milestone.year}
                      </p>
                      <p className="text-text-secondary font-body text-xs leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 lg:py-24 relative" style={{ zIndex: 3 }}>
        {/* Background Typography for Services Section */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-9xl opacity-[0.11] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "-5%", top: "40%" }}
            animate={{
              x: [0, 35, -18, 0],
              y: [0, -20, 15, 0],
              rotate: [0, 0.6, -0.4, 0],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              delay: 1,
              ease: "linear"
            }}
          >
            leistungen
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-16 relative" style={{ zIndex: 3 }}>
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('about:services.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('about:services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <Icon 
                    name={service.icon} 
                    size={32} 
                    className="text-accent group-hover:text-white transition-colors duration-300" 
                  />
                </div>
                <h3 className="text-xl font-heading font-medium text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-text-secondary font-body text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={`/${currentLang}/leistungen`}
              className="inline-flex items-center space-x-2 bg-accent text-white px-8 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
            >
              <span>{t('about:services.viewAll')}</span>
              <Icon name="ArrowRight" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 lg:py-24 bg-surface/95 backdrop-blur-sm relative" style={{ zIndex: 2 }}>
        {/* Background Typography for Testimonials Section */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[11rem] opacity-[0.09] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-12%", top: "35%" }}
            animate={{
              x: [0, -25, 15, 0],
              y: [0, 10, -18, 0],
              rotate: [0, -0.5, 0.3, 0],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              delay: 4,
              ease: "linear"
            }}
          >
            REFERENZEN
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-16 relative" style={{ zIndex: 3 }}>
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('about:testimonials.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('about:testimonials.subtitle')}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-background rounded-lg border border-border shadow-subtle overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-square overflow-hidden">
                  <Image
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].project}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Icon name="Quote" size={32} className="text-accent mb-6" />
                  <blockquote className="text-lg font-body text-text-primary mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div>
                    <div className="font-heading font-medium text-primary">
                      {testimonials[currentTestimonial].client}
                    </div>
                    <div className="text-text-secondary font-body text-sm">
                      {testimonials[currentTestimonial].company}
                    </div>
                    <div className="text-accent font-body text-sm mt-1">
                      {testimonials[currentTestimonial].project}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-colors duration-200"
                aria-label={t('about:testimonials.previous')}
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentTestimonial ? 'bg-accent' : 'bg-border hover:bg-accent/50'
                    }`}
                    aria-label={`${t('about:testimonials.goTo')} ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-colors duration-200"
                aria-label={t('about:testimonials.next')}
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Awards and Recognition */}
      <section className="py-16 lg:py-24 relative" style={{ zIndex: 1 }}>
        {/* Background Typography for Awards Section */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-8xl opacity-[0.13] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "80%", top: "50%" }}
            animate={{
              x: [0, -20, 12, 0],
              y: [0, 18, -10, 0],
              rotate: [0, 0.4, -0.6, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              delay: 6,
              ease: "linear"
            }}
          >
            exzellenz
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-16 relative" style={{ zIndex: 3 }}>
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('about:awards.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('about:awards.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-surface rounded-lg border border-border p-6 text-center hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <Icon 
                    name="Award" 
                    size={32} 
                    className="text-accent group-hover:text-white transition-colors duration-300" 
                  />
                </div>
                <h3 className="font-heading font-medium text-primary mb-2 text-lg">
                  {award.title}
                </h3>
                <p className="text-accent font-body font-medium text-sm mb-1">
                  {award.year}
                </p>
                <p className="text-text-secondary font-body text-sm">
                  {award.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 lg:py-24 bg-surface/95 backdrop-blur-sm relative z-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-16 relative" style={{ zIndex: 3 }}>
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {t('about:contact.title')}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {t('about:contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-medium text-primary mb-2">{t('about:contact.office.title')}</h3>
              <p className="text-text-secondary font-body text-sm">
                {t('about:contact.office.address')}<br />
                {t('about:contact.office.city')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-medium text-primary mb-2">{t('about:contact.hours.title')}</h3>
              <p className="text-text-secondary font-body text-sm">
                {t('about:contact.hours.weekdays')}<br />
                {t('about:contact.hours.saturday')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-medium text-primary mb-2">{t('about:contact.consultation.title')}</h3>
              <p className="text-text-secondary font-body text-sm">
                {t('about:contact.consultation.appointment')}<br />
                {t('about:contact.consultation.emergency')}
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to={`/${currentLang}/kontakt`}
              className="inline-flex items-center space-x-2 bg-accent text-white px-8 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
            >
              <Icon name="Mail" size={20} />
              <span>{t('about:cta.button')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Icon name="Triangle" size={20} color="white" />
              </div>
              <div className="font-heading font-semibold text-xl">Braun & Eyer</div>
            </div>
            <p className="text-white/80 font-body text-sm mb-6">
              {t('translation:footer.tagline')}
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Link to={`/${currentLang}/homepage`} className="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm">
                {t('translation:nav.home')}
              </Link>
              <Link to={`/${currentLang}/projekte`} className="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm">
                {t('translation:nav.projects')}
              </Link>
              <Link to={`/${currentLang}/leistungen`} className="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm">
                {t('translation:nav.services')}
              </Link>
              <Link to={`/${currentLang}/kontakt`} className="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm">
                {t('translation:nav.contact')}
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-white/60 font-body text-xs">
                © {new Date().getFullYear()} Braun & Eyer Architekturbüro Ingenieure. {t('translation:footer.rights')}.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;