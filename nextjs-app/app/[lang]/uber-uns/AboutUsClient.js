'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Home, Building2, Palette, Users, ChevronDown, ChevronUp, ArrowRight, ChevronLeft, ChevronRight, Award, Trophy, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function AboutUsClient({ teamMembers = [], dict = {} }) {
  const params = useParams();
  const lang = params.lang || 'de';
  const [expandedMember, setExpandedMember] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const officePhilosophy = {
    title: dict?.subtitle || 'Tradition trifft Innovation',
    description: `${dict?.philosophy?.text1 || 'Seit über 20 Jahren vereinen wir bei Braun & Eyer traditionelle Handwerkskunst mit modernster Technologie.'} ${dict?.philosophy?.text2 || 'Unser Ziel ist es, nachhaltige und zukunftsfähige Räume zu schaffen, die Menschen begeistern.'}`,
    backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  };

  const milestones = [
    {
      year: dict?.milestones?.items?.founding?.year || "1995",
      title: dict?.milestones?.items?.founding?.title || "Gründung",
      description: dict?.milestones?.items?.founding?.description || "Gründung des Architekturbüros Braun & Eyer"
    },
    {
      year: dict?.milestones?.items?.firstAward?.year || "2002",
      title: dict?.milestones?.items?.firstAward?.title || "Erste Auszeichnung",
      description: dict?.milestones?.items?.firstAward?.description || "Architekturpreis für nachhaltiges Bauen"
    },
    {
      year: dict?.milestones?.items?.sustainability?.year || "2010",
      title: dict?.milestones?.items?.sustainability?.title || "Nachhaltigkeit",
      description: dict?.milestones?.items?.sustainability?.description || "Zertifizierung als Energieberater"
    },
    {
      year: dict?.milestones?.items?.digital?.year || "2018",
      title: dict?.milestones?.items?.digital?.title || "Digitalisierung",
      description: dict?.milestones?.items?.digital?.description || "Einführung von BIM-Planung"
    },
    {
      year: dict?.milestones?.items?.pandemic?.year || "2020",
      title: dict?.milestones?.items?.pandemic?.title || "Resilienz",
      description: dict?.milestones?.items?.pandemic?.description || "Erfolgreiche Anpassung während der Pandemie"
    },
    {
      year: dict?.milestones?.items?.expansion?.year || "2023",
      title: dict?.milestones?.items?.expansion?.title || "Expansion",
      description: dict?.milestones?.items?.expansion?.description || "Erweiterung des Teams und neue Büroräume"
    }
  ];

  const services = [
    {
      icon: Home,
      title: dict?.services?.items?.newConstruction?.title || "Neubau",
      description: dict?.services?.items?.newConstruction?.description || "Moderne Neubauprojekte nach höchsten Standards"
    },
    {
      icon: Building2,
      title: dict?.services?.items?.renovation?.title || "Altbausanierung",
      description: dict?.services?.items?.renovation?.description || "Behutsame Sanierung historischer Gebäude"
    },
    {
      icon: Palette,
      title: dict?.services?.items?.interior?.title || "Innenarchitektur",
      description: dict?.services?.items?.interior?.description || "Kreative Raumkonzepte für jeden Anspruch"
    },
    {
      icon: Users,
      title: dict?.services?.items?.consulting?.title || "Beratung",
      description: dict?.services?.items?.consulting?.description || "Kompetente Beratung in allen Bauphasen"
    }
  ];

  const testimonials = [
    {
      id: 1,
      client: dict?.testimonials?.items?.[0]?.client || "Familie Schmidt",
      company: dict?.testimonials?.items?.[0]?.company || "Privatkunde",
      quote: dict?.testimonials?.items?.[0]?.quote || "Braun & Eyer hat unseren Traum vom Eigenheim perfekt umgesetzt. Die Beratung war erstklassig und die Umsetzung präzise.",
      project: dict?.testimonials?.items?.[0]?.project || "Einfamilienhaus Neubau",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      client: dict?.testimonials?.items?.[1]?.client || "Herr Dr. Müller",
      company: dict?.testimonials?.items?.[1]?.company || "Müller Immobilien GmbH",
      quote: dict?.testimonials?.items?.[1]?.quote || "Die Sanierung unseres denkmalgeschützten Gebäudes wurde mit höchster Kompetenz durchgeführt.",
      project: dict?.testimonials?.items?.[1]?.project || "Altbausanierung",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      client: dict?.testimonials?.items?.[2]?.client || "Frau Weber",
      company: dict?.testimonials?.items?.[2]?.company || "Weber Consulting",
      quote: dict?.testimonials?.items?.[2]?.quote || "Die Innenarchitektur unseres Büros ist funktional und ästhetisch perfekt gelungen.",
      project: dict?.testimonials?.items?.[2]?.project || "Bürogestaltung",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const awards = [
    {
      title: dict?.awards?.items?.architecture || "Deutscher Architekturpreis",
      year: "2023",
      category: lang === 'de' ? "Altbausanierung" : "Building Renovation"
    },
    {
      title: dict?.awards?.items?.sustainability || "Nachhaltigkeitspreis",
      year: "2022",
      category: lang === 'de' ? "Energieeffizientes Bauen" : "Energy-Efficient Construction"
    },
    {
      title: dict?.awards?.items?.innovation || "Innovationspreis Bauen",
      year: "2021",
      category: lang === 'de' ? "Wohnungsbau" : "Residential Construction"
    },
    {
      title: dict?.awards?.items?.heritage || "Denkmalschutzpreis",
      year: "2020",
      category: lang === 'de' ? "Historische Sanierung" : "Historic Renovation"
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

  const breadcrumbItems = [
    { href: `/${lang}/homepage`, label: dict?.translation?.nav?.home || 'Startseite' },
    { label: dict?.title || 'Über uns' }
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
      
      {/* Hero Section with Breadcrumb */}
      <section className="pt-20 lg:pt-24 bg-surface/95 backdrop-blur-sm border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
              {dict?.title || 'Über uns'}
            </h1>
            <p className="text-xl lg:text-2xl text-text-secondary font-body leading-relaxed">
              {officePhilosophy.title}
            </p>
          </div>
        </div>
      </section>

      {/* Hero Section with Philosophy */}
      <section className="relative z-10">
        <div className="relative h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={officePhilosophy.backgroundImage}
            alt="Braun & Eyer Büro"
            width={2000}
            height={500}
            className="w-full h-full object-cover"
            style={{ width: 'auto', height: 'auto' }}
          />
          <div className="absolute inset-0 bg-primary/60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <motion.div 
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <p className="text-lg lg:text-xl font-body leading-relaxed opacity-90">
                  {officePhilosophy.description}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Typography */}
        <div className="absolute inset-0 w-full pointer-events-none">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {dict?.team?.title || 'Unser Team'}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {dict?.team?.subtitle || 'Erfahrene Experten mit Leidenschaft für Architektur'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className="bg-surface rounded-lg overflow-hidden shadow-subtle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-square overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Users size={60} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-heading font-medium text-primary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent font-body font-medium mb-3">
                    {member.position}
                  </p>
                  {member.bio && (
                    <p className="text-text-secondary font-body text-sm mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                  
                  {member.email && (
                    <p className="text-text-secondary font-body text-sm mb-1">
                      {member.email}
                    </p>
                  )}
                  
                  {member.phone && (
                    <p className="text-text-secondary font-body text-sm mb-4">
                      {member.phone}
                    </p>
                  )}
                  
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-primary transition-colors duration-200 font-body text-sm"
                    >
                      LinkedIn →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office History Timeline */}
      <section className="py-16 lg:py-24 bg-surface/95 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {dict?.milestones?.title || 'Unsere Geschichte'}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {dict?.milestones?.subtitle || 'Meilensteine unserer Entwicklung'}
            </p>
          </div>

          {/* Mobile Timeline (Vertical) */}
          <div className="lg:hidden space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index} 
                className="flex space-x-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-heading font-medium">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-background rounded-lg p-4 shadow-subtle">
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
              </motion.div>
            ))}
          </div>

          {/* Desktop Timeline (Horizontal) */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2"></div>
              <div className="flex justify-between items-center relative">
                {milestones.map((milestone, index) => (
                  <motion.div 
                    key={index} 
                    className="flex flex-col items-center max-w-48"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
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
                      <p className="text-text-secondary font-body text-xs">
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {dict?.awards?.title || 'Auszeichnungen'}
            </h2>
            <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
              {dict?.awards?.subtitle || 'Anerkennung für herausragende Leistungen'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Trophy size={40} className="text-accent mx-auto mb-4" />
                <h3 className="font-heading font-medium text-primary mb-2">{award.title}</h3>
                <p className="text-accent font-body font-semibold text-lg mb-1">{award.year}</p>
                <p className="text-text-secondary font-body text-sm">{award.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
              {dict?.testimonials?.title || 'Was unsere Kunden sagen'}
            </h2>
            <p className="text-lg text-text-secondary font-body">
              {dict?.testimonials?.subtitle || 'Erfolgreiche Projekte und zufriedene Kunden'}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-background rounded-lg p-8 lg:p-12 shadow-subtle">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-surface hover:bg-accent/10 transition-colors duration-200"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={24} className="text-accent" />
                </button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentTestimonial ? 'bg-accent' : 'bg-border'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-surface hover:bg-accent/10 transition-colors duration-200"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={24} className="text-accent" />
                </button>
              </div>

              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <blockquote className="text-lg lg:text-xl text-text-secondary font-body italic mb-6">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-medium text-primary">
                      {testimonials[currentTestimonial].client}
                    </p>
                    <p className="text-text-secondary font-body text-sm">
                      {testimonials[currentTestimonial].company}
                    </p>
                    <p className="text-accent font-body text-sm">
                      {testimonials[currentTestimonial].project}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
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
            {dict?.cta?.title || 'Lassen Sie uns Ihr Projekt verwirklichen'}
          </h2>
          <p className="text-lg text-text-secondary font-body mb-8">
            {dict?.cta?.subtitle || 'Gemeinsam schaffen wir Räume, die begeistern'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/kontakt`}
              className="inline-flex items-center justify-center space-x-2 bg-accent text-white px-8 py-4 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg font-body font-medium"
            >
              <span>{dict?.cta?.contactButton || 'Kontakt aufnehmen'}</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href={`/${lang}/projekte`}
              className="inline-flex items-center justify-center space-x-2 border border-border text-text-primary px-8 py-4 rounded transition-all duration-200 hover:bg-surface font-body font-medium"
            >
              <span>{dict?.cta?.projectsButton || 'Projekte ansehen'}</span>
            </Link>
          </div>
        </div>
      </motion.section>

      <Footer dict={dict.translation} lang={lang} />
    </div>
  );
}