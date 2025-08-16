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
import EditableText from '../../cms/components/EditableText';
import EditableImage from '../../cms/components/EditableImage';
import { useEditMode } from '../../cms/contexts/EditModeContext';

const AboutWithTranslations = () => {
  const { t, i18n } = useTranslation(['about', 'translation']);
  const location = useLocation();
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';
  const { isEditMode } = useEditMode();
  
  const [expandedMember, setExpandedMember] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Team members with multilingual support
  const teamMembers = [
    {
      id: 1,
      name: "Dipl.-Ing. Christian F. Braun",
      title: currentLang === 'de' ? "Geschäftsführender Architekt" : "Managing Architect",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: currentLang === 'de' 
        ? "Führt das Architekturbüro mit über 20 Jahren Erfahrung in Neubau und Altbausanierung. Spezialist für nachhaltige Architektur und energieeffizientes Bauen."
        : "Leading the architecture office with over 20 years of experience in new construction and building renovation. Specialist in sustainable architecture and energy-efficient construction.",
      education: currentLang === 'de' 
        ? "Diplom-Ingenieur Architektur, Universität des Saarlandes"
        : "Diploma in Architecture Engineering, University of Saarland",
      certifications: currentLang === 'de'
        ? "Architektenkammer Saarland, Energieberater"
        : "Saarland Chamber of Architects, Energy Consultant",
      specializations: currentLang === 'de'
        ? ["Neubau", "Altbausanierung", "Energieberatung"]
        : ["New Construction", "Building Renovation", "Energy Consulting"],
      notableProjects: currentLang === 'de'
        ? ["Wohnanlage Saarbrücken", "Sanierung Denkmalschutz", "Einfamilienhaus Modern"]
        : ["Saarbrücken Residential Complex", "Heritage Building Renovation", "Modern Single-Family Home"]
    },
    {
      id: 2,
      name: "Dipl.-Ing. Patric Eyer",
      title: currentLang === 'de' ? "Partner & Architekt" : "Partner & Architect",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: currentLang === 'de'
        ? "Experte für Innenarchitektur und Raumplanung mit Fokus auf funktionale und ästhetische Lösungen für Wohn- und Geschäftsräume."
        : "Expert in interior design and space planning with focus on functional and aesthetic solutions for residential and commercial spaces.",
      education: currentLang === 'de'
        ? "Diplom-Ingenieur Architektur, Universität des Saarlandes"
        : "Diploma in Architecture Engineering, University of Saarland",
      certifications: currentLang === 'de'
        ? "Architektenkammer Saarland, DGNB Auditor"
        : "Saarland Chamber of Architects, DGNB Auditor",
      specializations: currentLang === 'de'
        ? ["Innenarchitektur", "Raumplanung", "Nachhaltiges Bauen"]
        : ["Interior Design", "Space Planning", "Sustainable Construction"],
      notableProjects: currentLang === 'de'
        ? ["Bürogebäude Saarbrücken", "Penthouse Sanierung", "Mehrfamilienhaus Neubau"]
        : ["Saarbrücken Office Building", "Penthouse Renovation", "Multi-Family New Construction"]
    },
    {
      id: 3,
      name: "M.Sc. Thomas Weber",
      title: currentLang === 'de' ? "Projektleiter Neubau" : "New Construction Project Manager",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: currentLang === 'de'
        ? "Verantwortlich für die Projektabwicklung von Neubauprojekten von der Planung bis zur Fertigstellung mit Fokus auf termingerechte Umsetzung."
        : "Responsible for project management of new construction projects from planning to completion with focus on timely implementation.",
      education: currentLang === 'de'
        ? "Master of Science Architektur, RWTH Aachen"
        : "Master of Science Architecture, RWTH Aachen",
      certifications: currentLang === 'de'
        ? "Projektmanagement Zertifikat, BIM Manager"
        : "Project Management Certificate, BIM Manager",
      specializations: currentLang === 'de'
        ? ["Projektmanagement", "BIM-Planung", "Bauüberwachung"]
        : ["Project Management", "BIM Planning", "Construction Supervision"],
      notableProjects: currentLang === 'de'
        ? ["Wohnkomplex Saarbrücken", "Geschäftshaus Zentrum", "Studentenwohnheim"]
        : ["Saarbrücken Residential Complex", "Center Business Building", "Student Housing"]
    },
    {
      id: 4,
      name: "Dipl.-Ing. (FH) Sandra Klein",
      title: currentLang === 'de' ? "Spezialistin Altbausanierung" : "Building Renovation Specialist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: currentLang === 'de'
        ? "Expertin für die Sanierung historischer Gebäude und Denkmalschutz mit umfassendem Wissen über traditionelle Bautechniken."
        : "Expert in renovation of historic buildings and monument protection with comprehensive knowledge of traditional construction techniques.",
      education: currentLang === 'de'
        ? "Diplom-Ingenieur (FH) Architektur, HS München"
        : "Diploma in Architecture Engineering (FH), Munich University",
      certifications: currentLang === 'de'
        ? "Sachverständige Altbau, Denkmalschutz Zertifikat"
        : "Old Building Expert, Heritage Protection Certificate",
      specializations: currentLang === 'de'
        ? ["Altbausanierung", "Denkmalschutz", "Bauphysik"]
        : ["Building Renovation", "Heritage Protection", "Building Physics"],
      notableProjects: currentLang === 'de'
        ? ["Villa Jugendstil", "Altstadt Sanierung", "Historisches Stadthaus"]
        : ["Art Nouveau Villa", "Old Town Renovation", "Historic Townhouse"]
    }
  ];

  const testimonials = [
    {
      quote: currentLang === 'de'
        ? "Die Zusammenarbeit mit Braun & Eyer war außergewöhnlich. Ihre Aufmerksamkeit für Details und ihr Engagement für nachhaltige Architektur haben unsere Erwartungen übertroffen."
        : "Working with Braun & Eyer was exceptional. Their attention to detail and commitment to sustainable architecture exceeded our expectations.",
      author: "Michael Schmidt",
      position: currentLang === 'de' ? "Geschäftsführer, TechCorp GmbH" : "CEO, TechCorp GmbH"
    },
    {
      quote: currentLang === 'de'
        ? "Das Team hat unsere Vision perfekt umgesetzt und dabei innovative Lösungen entwickelt, die sowohl funktional als auch ästhetisch beeindruckend sind."
        : "The team perfectly implemented our vision while developing innovative solutions that are both functional and aesthetically impressive.",
      author: "Sarah Weber",
      position: currentLang === 'de' ? "Privatbauherr" : "Private Client"
    },
    {
      quote: currentLang === 'de'
        ? "Professionell, kreativ und zuverlässig. Braun & Eyer hat unser historisches Gebäude mit großem Respekt vor der Substanz modernisiert."
        : "Professional, creative and reliable. Braun & Eyer modernized our historic building with great respect for its substance.",
      author: "Dr. Thomas Müller",
      position: currentLang === 'de' ? "Vorstand, Kulturstiftung" : "Board Member, Cultural Foundation"
    }
  ];

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
    { name: 'Home', url: `https://braunundeyer.de/${currentLang}` },
    { name: t('about:title'), url: `https://braunundeyer.de/${currentLang}/uber-uns` }
  ];

  const schemas = combineSchemas([
    generateBreadcrumbSchema(breadcrumbs),
    ...teamMembers.map(member => 
      generatePersonSchema(member.name, member.title, 'Braun & Eyer Architekturbüro')
    )
  ]);

  return (
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
      <SEO 
        title={`${t('about:title')} | Braun & Eyer ${t('translation:hero.title')}`}
        description={t('about:description')}
        keywords={`${t('about:team.title')}, ${t('about:philosophy.title')}, ${t('about:values.title')}`}
        structuredData={schemas}
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

      {/* Main Content */}
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
          <EditableImage
            contentKey="about.hero.image"
            defaultSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt={t('about:title')}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/60" />
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Breadcrumb className="mb-6 text-white/80" />
              <h1 className="text-4xl lg:text-6xl font-heading font-light mb-4">
                <EditableText
                  contentKey="about.hero.title"
                  defaultText={t('about:subtitle')}
                />
              </h1>
              <p className="text-lg lg:text-xl font-body text-white/90 max-w-2xl mx-auto">
                <EditableText
                  contentKey="about.hero.description"
                  defaultText={t('about:description')}
                />
              </p>
            </motion.div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 lg:py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-6">
                  {t('about:philosophy.title')}
                </h2>
                <div className="space-y-4 text-text-secondary font-body">
                  <p>
                    <EditableText
                      contentKey="about.philosophy.text1"
                      defaultText={t('about:philosophy.text1')}
                    />
                  </p>
                  <p>
                    <EditableText
                      contentKey="about.philosophy.text2"
                      defaultText={t('about:philosophy.text2')}
                    />
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[400px] lg:h-[500px]"
              >
                <EditableImage
                  contentKey="about.philosophy.image"
                  defaultSrc="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt={t('about:philosophy.title')}
                  className="w-full h-full object-cover rounded-minimal shadow-elevation"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
                {t('about:team.title')}
              </h2>
              <p className="text-lg text-text-secondary font-body max-w-2xl mx-auto">
                {t('about:team.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: member.id * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-surface rounded-minimal overflow-hidden shadow-subtle hover:shadow-elevation transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading font-medium text-primary mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-accent mb-3 font-body">
                        {member.title}
                      </p>
                      <p className="text-sm text-text-secondary font-body mb-4 line-clamp-3">
                        {member.bio}
                      </p>
                      
                      {expandedMember === member.id ? (
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs font-medium text-primary mb-1">
                              {t('about:team.education')}
                            </h4>
                            <p className="text-xs text-text-secondary">{member.education}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-primary mb-1">
                              {t('about:team.specializations')}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {member.specializations.map((spec, index) => (
                                <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setExpandedMember(null)}
                            className="text-accent text-sm font-body hover:underline"
                          >
                            {t('about:team.viewLess')}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setExpandedMember(member.id)}
                          className="text-accent text-sm font-body hover:underline"
                        >
                          {t('about:team.viewMore')}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary text-center mb-12">
              {t('about:values.title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {['innovation', 'sustainability', 'excellence', 'collaboration'].map((value, index) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <Icon 
                      name={value === 'innovation' ? 'Lightbulb' : 
                           value === 'sustainability' ? 'Leaf' :
                           value === 'excellence' ? 'Award' : 'Users'}
                      size={28}
                      className="text-accent"
                    />
                  </div>
                  <h3 className="font-heading font-medium text-primary mb-2">
                    {t(`about:values.items.${value}.title`)}
                  </h3>
                  <p className="text-sm text-text-secondary font-body">
                    {t(`about:values.items.${value}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
                {t('about:milestones.title')}
              </h2>
              <p className="text-lg text-text-secondary font-body">
                {t('about:milestones.subtitle')}
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />
              
              {['founding', 'firstAward', 'sustainability', 'digital', 'pandemic', 'expansion'].map((milestone, index) => (
                <motion.div
                  key={milestone}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-surface p-6 rounded-minimal shadow-subtle">
                      <span className="text-accent font-bold text-lg">
                        {t(`about:milestones.items.${milestone}.year`)}
                      </span>
                      <h3 className="font-heading font-medium text-primary mt-2 mb-2">
                        {t(`about:milestones.items.${milestone}.title`)}
                      </h3>
                      <p className="text-sm text-text-secondary font-body">
                        {t(`about:milestones.items.${milestone}.description`)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-20 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <Icon 
                name="Quote" 
                size={48} 
                className="text-accent/20 absolute top-0 left-0 transform -translate-x-4 -translate-y-4"
              />
              
              <div className="min-h-[200px] flex items-center justify-center">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-lg lg:text-xl text-text-secondary font-body italic mb-6">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <div>
                    <p className="font-heading font-medium text-primary">
                      {testimonials[currentTestimonial].author}
                    </p>
                    <p className="text-sm text-text-secondary font-body">
                      {testimonials[currentTestimonial].position}
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentTestimonial ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
                {t('about:awards.title')}
              </h2>
              <p className="text-lg text-text-secondary font-body">
                {t('about:awards.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['architecture', 'sustainability', 'innovation', 'heritage'].map((award, index) => (
                <motion.div
                  key={award}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
                    <Icon name="Award" size={32} className="text-accent" />
                  </div>
                  <p className="text-sm font-body text-primary">
                    {t(`about:awards.items.${award}`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-heading font-light mb-4">
              {t('about:cta.title')}
            </h2>
            <p className="text-lg font-body mb-8 text-white/90">
              {t('about:cta.description')}
            </p>
            <Link
              to={`/${currentLang}/kontakt`}
              className="inline-flex items-center px-8 py-3 bg-accent text-white rounded-minimal hover:bg-accent-dark transition-colors duration-200 font-body font-medium"
            >
              {t('about:cta.button')}
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-body">
              © {new Date().getFullYear()} Braun & Eyer Architekturbüro Ingenieure. {t('translation:footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutWithTranslations;