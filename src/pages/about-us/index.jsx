import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import CursorTrail from '../../components/ui/CursorTrail';
import SEO from '../../components/SEO';
import { generateBreadcrumbSchema, generatePersonSchema, combineSchemas } from '../../utils/structuredData';

const AboutUs = () => {
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
    title: "Architektur mit Leidenschaft und Präzision",
    description: `Bei Braun & Eyer Architekturbüro Ingenieure verstehen wir Architektur als die Kunst, Räume zu schaffen, die Menschen inspirieren und Gemeinschaften verbinden. Unsere Philosophie basiert auf der perfekten Balance zwischen innovativem Design, nachhaltiger Bauweise und zeitloser Eleganz. Wir verbinden moderne Technologien mit bewährtem handwerklichem Können, um Räume zu entwickeln, die nicht nur heutigen Anforderungen gerecht werden, sondern auch zukünftige Möglichkeiten antizipieren.`,
    backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  };

  const teamMembers = [
    {
      id: 1,
      name: "Dipl.-Ing. Christian F. Braun",
      title: "Geschäftsführender Architekt",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Führt das Architekturbüro mit über 20 Jahren Erfahrung in Neubau und Altbausanierung. Spezialist für nachhaltige Architektur und energieeffizientes Bauen.",
      education: "Diplom-Ingenieur Architektur, Universität des Saarlandes",
      certifications: "Architektenkammer Saarland, Energieberater",
      specializations: ["Neubau", "Altbausanierung", "Energieberatung"],
      notableProjects: ["Wohnanlage Saarbrücken", "Sanierung Denkmalschutz", "Einfamilienhaus Modern"]
    },
    {
      id: 2,
      name: "Dipl.-Ing. Patric Eyer",
      title: "Partner & Architekt",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Experte für Innenarchitektur und Raumplanung mit Fokus auf funktionale und ästhetische Lösungen für Wohn- und Geschäftsräume.",
      education: "Diplom-Ingenieur Architektur, Universität des Saarlandes",
      certifications: "Architektenkammer Saarland, DGNB Auditor",
      specializations: ["Innenarchitektur", "Raumplanung", "Nachhaltiges Bauen"],
      notableProjects: ["Bürogebäude Saarbrücken", "Penthouse Sanierung", "Mehrfamilienhaus Neubau"]
    },
    {
      id: 3,
      name: "M.Sc. Thomas Weber",
      title: "Projektleiter Neubau",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Verantwortlich für die Projektabwicklung von Neubauprojekten von der Planung bis zur Fertigstellung mit Fokus auf termingerechte Umsetzung.",
      education: "Master of Science Architektur, RWTH Aachen",
      certifications: "Projektmanagement Zertifikat, BIM Manager",
      specializations: ["Projektmanagement", "BIM-Planung", "Bauüberwachung"],
      notableProjects: ["Wohnkomplex Schwabing", "Geschäftshaus Zentrum", "Studentenwohnheim"]
    },
    {
      id: 4,
      name: "Dipl.-Ing. (FH) Sandra Klein",
      title: "Spezialistin Altbausanierung",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Expertin für die Sanierung historischer Gebäude und Denkmalschutz mit umfassendem Wissen über traditionelle Bautechniken.",
      education: "Diplom-Ingenieur (FH) Architektur, HS München",
      certifications: "Sachverständige Altbau, Denkmalschutz Zertifikat",
      specializations: ["Altbausanierung", "Denkmalschutz", "Bauphysik"],
      notableProjects: ["Villa Jugendstil", "Altstadt Sanierung", "Historisches Stadthaus"]
    }
  ];

  const milestones = [
    {
      year: "2005",
      title: "Bürogründung",
      description: "Braun & Eyer Architekturbüro wird mit der Vision gegründet, innovative und nachhaltige Architekturlösungen zu schaffen."
    },
    {
      year: "2008",
      title: "Erste Auszeichnung",
      description: "Erhalt des Bayerischen Architekturpreises für herausragende Leistungen in der Altbausanierung."
    },
    {
      year: "2012",
      title: "Nachhaltigkeitsfokus",
      description: "Zertifizierung als Energieberater und Spezialisierung auf nachhaltiges und energieeffizientes Bauen."
    },
    {
      year: "2016",
      title: "Digitale Innovation",
      description: "Einführung von BIM-Technologie und 3D-Visualisierung für präzise Planungsprozesse."
    },
    {
      year: "2020",
      title: "Pandemie-Anpassung",
      description: "Erfolgreiche Umstellung auf digitale Beratung und virtuelle Projektpräsentationen."
    },
    {
      year: "2024",
      title: "100+ Projekte",
      description: "Erfolgreich über 100 Projekte in den Bereichen Neubau und Altbausanierung realisiert."
    }
  ];

  const services = [
    {
      icon: "Home",
      title: "Neubau",
      description: "Individuelle Wohnhäuser, Mehrfamilienhäuser und Geschäftsgebäude nach Ihren Vorstellungen und Bedürfnissen."
    },
    {
      icon: "Building2",
      title: "Altbausanierung",
      description: "Fachgerechte Sanierung historischer Gebäude unter Berücksichtigung von Denkmalschutz und modernen Standards."
    },
    {
      icon: "Palette",
      title: "Innenarchitektur",
      description: "Komplette Innenraumgestaltung von der Raumplanung bis zur Möblierung für optimale Funktionalität."
    },
    {
      icon: "Users",
      title: "Beratungsleistungen",
      description: "Expertenberatung für Bauplanung, Genehmigungsverfahren und energetische Optimierung."
    }
  ];

  const testimonials = [
    {
      id: 1,
      client: "Familie Müller",
      company: "Privatkunden",
      quote: "Braun & Eyer haben unser Traumhaus Wirklichkeit werden lassen. Die Betreuung war von der ersten Beratung bis zur Schlüsselübergabe perfekt.",
      project: "Einfamilienhaus Neubau",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      client: "Dr. Schmidt",
      company: "Denkmalschutz Projekt",
      quote: "Die Sanierung unseres historischen Stadthauses wurde mit größter Sorgfalt und Fachkenntnis durchgeführt. Ein hervorragendes Ergebnis.",
      project: "Altbausanierung Denkmalschutz",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      client: "Immobilien AG München",
      company: "Gewerblicher Bauherr",
      quote: "Professionell, kreativ und zuverlässig. Das Wohnbauprojekt wurde termingerecht und im Budget realisiert.",
      project: "Mehrfamilienhaus Komplex",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const awards = [
    {
      title: "Bayerischer Architekturpreis",
      year: "2023",
      category: "Altbausanierung"
    },
    {
      title: "Nachhaltigkeitspreis Bayern",
      year: "2022",
      category: "Energieeffizientes Bauen"
    },
    {
      title: "Deutscher Bauherrenpreis",
      year: "2021",
      category: "Wohnungsbau"
    },
    {
      title: "Denkmalschutz Auszeichnung",
      year: "2020",
      category: "Historische Sanierung"
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
    { name: 'Home', url: 'https://braunundeyer.de' },
    { name: 'Über uns', url: 'https://braunundeyer.de/ueber-uns' }
  ];

  const teamSchema = combineSchemas(
    generateBreadcrumbSchema(breadcrumbs),
    generatePersonSchema({ name: 'Herr Braun', jobTitle: 'Geschäftsführender Architekt' }),
    generatePersonSchema({ name: 'Herr Eyer', jobTitle: 'Geschäftsführender Architekt' })
  );

  return (
    <div className="min-h-screen bg-background custom-cursor">
      <SEO 
        title="Über uns | Braun & Eyer Architekturbüro - Ihre Experten für Architektur"
        description="Lernen Sie das Team von Braun & Eyer kennen. Über 30 Jahre Erfahrung in Architektur, Neubau und Altbausanierung. Unsere Vision, Mission und Werte."
        keywords="Architekturbüro Team, Braun Eyer Geschichte, Architekten Saarbrücken, Unternehmensphilosophie, Architektur Expertise"
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
      
      {/* Hero Section with Philosophy */}
      <section className="relative pt-20 lg:pt-24">
        <div className="relative h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={officePhilosophy.backgroundImage}
            alt="Braun & Eyer Büro"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <h1 className="text-3xl lg:text-5xl font-heading font-light mb-6">
                {officePhilosophy.title}
              </h1>
              <div className="max-w-2xl mx-auto">
                <p className="text-lg lg:text-xl font-body leading-relaxed opacity-90">
                  {officePhilosophy.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
      </div>

      {/* Team Members Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              Unser Team
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Unser erfahrenes Team aus Architekten, Ingenieuren und Spezialisten vereint jahrzehntelange Expertise und innovatives Denken.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-surface rounded-lg border border-border overflow-hidden shadow-subtle">
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
                    <span>{expandedMember === member.id ? 'Weniger anzeigen' : 'Mehr anzeigen'}</span>
                    <Icon 
                      name={expandedMember === member.id ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  </button>

                  {expandedMember === member.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div>
                        <h4 className="font-body font-medium text-primary text-sm mb-1">Ausbildung</h4>
                        <p className="text-text-secondary text-sm">{member.education}</p>
                      </div>
                      <div>
                        <h4 className="font-body font-medium text-primary text-sm mb-1">Zertifizierungen</h4>
                        <p className="text-text-secondary text-sm">{member.certifications}</p>
                      </div>
                      <div>
                        <h4 className="font-body font-medium text-primary text-sm mb-1">Spezialisierungen</h4>
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
                        <h4 className="font-body font-medium text-primary text-sm mb-1">Bedeutende Projekte</h4>
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
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              Unsere Geschichte
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Von bescheidenen Anfängen zur Branchenanerkennung - entdecken Sie die Meilensteine unserer Architekturpraxis.
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
                  <div className="bg-background rounded-lg p-4 border border-border">
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
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              Unsere Leistungen
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Umfassende Architekturleistungen, maßgeschneidert um Ihre Vision mit Expertise und Innovation zum Leben zu erwecken.
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
              to="/services"
              className="inline-flex items-center space-x-2 bg-accent text-white px-8 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
            >
              <span>Alle Leistungen entdecken</span>
              <Icon name="ArrowRight" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              Kundenstimmen
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Erfahren Sie von unseren zufriedenen Kunden über ihre Erfahrungen mit Braun & Eyer.
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
                aria-label="Vorheriges Testimonial"
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
                    aria-label={`Zu Testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-colors duration-200"
                aria-label="Nächstes Testimonial"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Awards and Recognition */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              Auszeichnungen & Anerkennung
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Unser Engagement für Exzellenz wurde von Branchenführern und Fachorganisationen anerkannt.
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
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              Kontakt aufnehmen
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              Bereit für Ihr Architekturprojekt? Kontaktieren Sie unser Team für eine persönliche Beratung.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-medium text-primary mb-2">Bürostandort</h3>
              <p className="text-text-secondary font-body text-sm">
                Mainzerstrasse 29<br />
                66111 Saarbrücken, Saarland
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-medium text-primary mb-2">Bürozeiten</h3>
              <p className="text-text-secondary font-body text-sm">
                Montag - Freitag: 9:00 - 18:00 Uhr<br />
                Samstag: 10:00 - 16:00 Uhr
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-medium text-primary mb-2">Beratungstermine</h3>
              <p className="text-text-secondary font-body text-sm">
                Beratung nach Terminvereinbarung<br />
                Notfallbetreuung verfügbar
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-accent text-white px-8 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
            >
              <Icon name="Mail" size={20} />
              <span>Jetzt Kontakt aufnehmen</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Icon name="Triangle" size={20} color="white" />
              </div>
              <div className="font-heading font-semibold text-xl">Braun & Eyer</div>
            </div>
            <p className="text-white/80 font-body text-sm mb-6">
              Architektonische Exzellenz seit 2005
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Link to="/homepage" className="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm">
                Startseite
              </Link>
              <Link to="/project-gallery" className="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm">
                Projekte
              </Link>
              <Link to="/services" className="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm">
                Leistungen
              </Link>
              <Link to="/contact" className="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm">
                Kontakt
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-white/60 font-body text-xs">
                © {new Date().getFullYear()} Braun & Eyer Architekturbüro Ingenieure. Alle Rechte vorbehalten.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;