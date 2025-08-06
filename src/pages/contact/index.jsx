import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import CursorTrail from '../../components/ui/CursorTrail';
import SEO from '../../components/SEO';
import { generateBreadcrumbSchema, generateLocalBusinessSchema, combineSchemas } from '../../utils/structuredData';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budgetRange: '',
    timeline: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const projectTypes = [
    { value: '', label: 'Projekttyp auswählen' },
    { value: 'neubau', label: 'Neubau' },
    { value: 'altbausanierung', label: 'Altbausanierung' },
    { value: 'innenarchitektur', label: 'Innenarchitektur' },
    { value: 'energieberatung', label: 'Energieberatung' },
    { value: 'projektmanagement', label: 'Projektmanagement' },
    { value: 'beratung', label: 'Architekturberatung' }
  ];

  const budgetRanges = [
    { value: '', label: 'Budgetbereich auswählen (Optional)' },
    { value: 'unter-100k', label: 'Unter 100.000 €' },
    { value: '100k-250k', label: '100.000 € - 250.000 €' },
    { value: '250k-500k', label: '250.000 € - 500.000 €' },
    { value: '500k-1m', label: '500.000 € - 1.000.000 €' },
    { value: 'ueber-1m', label: 'Über 1.000.000 €' },
    { value: 'besprechen', label: 'Lieber persönlich besprechen' }
  ];

  const contactInfo = {
    address: "Mainzerstrasse 29, 66111 Saarbrücken, Deutschland",
    phone: "0681 - 95 41 74 88",
    mobile: "+49 (0) 15127552242",
    email: "info@braunundeyer.de",
    businessHours: "Montag - Freitag: 8:00 - 18:00 Uhr\nSamstag: 9:00 - 14:00 Uhr\nSonntag: Geschlossen"
  };

  const socialLinks = [
    { name: 'Instagram', icon: 'Instagram', url: 'https://www.instagram.com/braunundeyer' },
    { name: 'LinkedIn', icon: 'Linkedin', url: '#' },
    { name: 'Facebook', icon: 'Facebook', url: '#' },
    { name: 'Twitter', icon: 'Twitter', url: '#' }
  ];

  const faqData = [
    {
      id: 1,
      question: "Wie läuft Ihr Beratungsprozess ab?",
      answer: `Unser Beratungsprozess beginnt mit einem ausführlichen Erstgespräch, um Ihre Vision, Anforderungen und Ihr Budget zu verstehen. Anschließend führen wir eine Standortanalyse durch, entwickeln erste Konzepte und arbeiten gemeinsam mit Ihnen an der Verfeinerung des Entwurfs. Der Prozess umfasst typischerweise Vorentwurf, Entwurfsplanung, Ausführungsplanung und Bauüberwachung.`
    },
    {
      id: 2,
      question: "Wie lange dauert ein typisches Projekt?",
      answer: `Die Projektdauer variiert je nach Umfang und Komplexität. Wohnbauprojekte dauern in der Regel 8-15 Monate von der ersten Beratung bis zur Fertigstellung. Gewerbliche Projekte können 15-30 Monate in Anspruch nehmen. Wir erstellen detaillierte Zeitpläne während der ersten Beratungsphase.`
    },
    {
      id: 3,
      question: "Wie sind Ihre Honorarstrukturen aufgebaut?",
      answer: `Unsere Honorare richten sich nach der HOAI (Honorarordnung für Architekten und Ingenieure) und werden je nach Projektumfang und Komplexität berechnet. Wir bieten sowohl prozentuale Honorare (typischerweise 10-15% der Baukosten) als auch Pauschalhonorar-Vereinbarungen an. Transparente Preisgestaltung erhalten Sie bereits im Erstberatungsgespräch.`
    },
    {
      id: 4,
      question: "Übernehmen Sie Genehmigungen und Behördengänge?",
      answer: `Ja, wir übernehmen den gesamten Genehmigungsprozess einschließlich Baugenehmigungen, Denkmalschutzauflagen und behördlicher Abstimmungen. Unser Team verfügt über umfangreiche Erfahrung im Umgang mit lokalen Bauvorschriften und Bestimmungen für eine reibungslose Projektgenehmigung.`
    },
    {
      id: 5,
      question: "Können Sie mit meinem bestehenden Bauunternehmen zusammenarbeiten?",
      answer: `Selbstverständlich! Wir arbeiten gerne mit qualifizierten Bauunternehmen zusammen und können mit Ihrem bevorzugten Bauteam kooperieren. Wir pflegen auch Beziehungen zu vertrauenswürdigen Partnerbetrieben und können bei Bedarf Empfehlungen aussprechen.`
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonnummer ist erforderlich';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Bitte wählen Sie einen Projekttyp aus';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Nachricht ist erforderlich';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nachricht muss mindestens 10 Zeichen lang sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        budgetRange: '',
        timeline: '',
        message: ''
      });
    }, 2000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail && /\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterEmail('');
      // Handle newsletter subscription
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
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
    { name: 'Kontakt', url: 'https://braunundeyer.de/kontakt' }
  ];

  const contactSchema = combineSchemas(
    generateLocalBusinessSchema(),
    generateBreadcrumbSchema(breadcrumbs)
  );

  return (
    <div className="min-h-screen bg-background custom-cursor">
      <SEO 
        title="Kontakt | Braun & Eyer Architekturbüro - Jetzt Beratung anfragen"
        description="Kontaktieren Sie Braun & Eyer Architekturbüro für Ihr Bauprojekt. Kostenlose Erstberatung für Neubau und Sanierung. Saarbrücken und Umgebung."
        keywords="Architekt Kontakt Saarbrücken, Architekturbüro anfragen, Bauberatung, Erstberatung Architektur, Braun Eyer Kontakt"
        structuredData={contactSchema}
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
      
      <main className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb />
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-3xl lg:text-5xl font-heading font-light text-primary mb-4">
              Lassen Sie uns gemeinsam
              <span className="text-accent block lg:inline lg:ml-3">Außergewöhnliches schaffen</span>
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary font-body max-w-3xl mx-auto">
              Bereit, Ihre architektonische Vision zum Leben zu erwecken? Kontaktieren Sie unser Expertenteam 
              und lassen Sie uns besprechen, wie wir Ihren Raum in etwas Außergewöhnliches verwandeln können.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">
                  Kontakt aufnehmen
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="MapPin" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-body font-medium text-primary mb-1">Büroadresse</h3>
                      <p className="text-text-secondary font-body">{contactInfo.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Phone" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-body font-medium text-primary mb-1">Telefon</h3>
                      <div className="space-y-1">
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="block text-text-secondary font-body hover:text-accent transition-colors duration-200"
                        >
                          {contactInfo.phone}
                        </a>
                        <a
                          href={`tel:${contactInfo.mobile}`}
                          className="block text-text-secondary font-body hover:text-accent transition-colors duration-200 text-sm"
                        >
                          {contactInfo.mobile} (Mobil)
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Mail" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-body font-medium text-primary mb-1">E-Mail</h3>
                      <a 
                        href={`mailto:${contactInfo.email}`}
                        className="text-text-secondary font-body hover:text-accent transition-colors duration-200"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Clock" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-body font-medium text-primary mb-1">Öffnungszeiten</h3>
                      <div className="text-text-secondary font-body whitespace-pre-line">
                        {contactInfo.businessHours}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-body font-medium text-primary mb-4">Folgen Sie uns</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                        aria-label={`Folgen Sie uns auf ${social.name}`}
                      >
                        <Icon name={social.icon} size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-surface rounded-lg overflow-hidden border border-border">
                <div className="h-64 lg:h-80">
                  <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    title="Braun & Eyer Bürostandort"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=Mainzerstrasse+29,+Saarbrücken&z=14&output=embed"
                    className="border-0"
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-surface rounded-lg p-6 lg:p-8 border border-border">
              <h2 className="text-2xl font-heading font-light text-primary mb-6">
                Starten Sie Ihr Projekt
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle" size={32} className="text-success" />
                  </div>
                  <h3 className="text-xl font-heading font-light text-primary mb-2">
                    Vielen Dank!
                  </h3>
                  <p className="text-text-secondary font-body mb-4">
                    Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-accent hover:text-primary transition-colors duration-200 font-body font-medium"
                  >
                    Weitere Nachricht senden
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-body font-medium text-primary mb-2">
                      Vollständiger Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                        errors.name 
                          ? 'border-error bg-error/5 text-error' :'border-border bg-background text-primary focus:border-accent'
                      }`}
                      placeholder="Geben Sie Ihren vollständigen Namen ein"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-error font-body">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-body font-medium text-primary mb-2">
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                        errors.email 
                          ? 'border-error bg-error/5 text-error' :'border-border bg-background text-primary focus:border-accent'
                      }`}
                      placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-error font-body">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-body font-medium text-primary mb-2">
                      Telefonnummer *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                        errors.phone 
                          ? 'border-error bg-error/5 text-error' :'border-border bg-background text-primary focus:border-accent'
                      }`}
                      placeholder="Geben Sie Ihre Telefonnummer ein"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-error font-body">{errors.phone}</p>
                    )}
                  </div>

                  {/* Project Type */}
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-body font-medium text-primary mb-2">
                      Projekttyp *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                        errors.projectType 
                          ? 'border-error bg-error/5 text-error' :'border-border bg-background text-primary focus:border-accent'
                      }`}
                    >
                      {projectTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.projectType && (
                      <p className="mt-1 text-sm text-error font-body">{errors.projectType}</p>
                    )}
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label htmlFor="budgetRange" className="block text-sm font-body font-medium text-primary mb-2">
                      Budgetbereich
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    >
                      {budgetRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-body font-medium text-primary mb-2">
                      Projektzeitplan
                    </label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      placeholder="z.B. Sofort, 3-6 Monate, flexibel"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-body font-medium text-primary mb-2">
                      Projektdetails *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-vertical ${
                        errors.message 
                          ? 'border-error bg-error/5 text-error' :'border-border bg-background text-primary focus:border-accent'
                      }`}
                      placeholder="Erzählen Sie uns von Ihrem Projekt, Ihrer Vision, Ihren Anforderungen und allen spezifischen Details, die Sie gerne teilen möchten..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-error font-body">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-white px-6 py-4 rounded-lg font-body font-medium transition-all duration-200 hover:bg-accent/90 hover:scale-102 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Icon name="Loader2" size={20} className="animate-spin" />
                        <span>Nachricht wird gesendet...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={20} />
                        <span>Nachricht senden</span>
                      </>
                    )}
                  </button>

                  <p className="text-sm text-text-secondary font-body text-center">
                    Wir antworten normalerweise innerhalb von 24 Stunden an Werktagen.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-surface py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
                Häufig gestellte Fragen
              </h2>
              <p className="text-lg text-text-secondary font-body">
                Antworten auf häufige Fragen zu unseren Leistungen und unserem Prozess
              </p>
            </div>

            <div className="space-y-4">
              {faqData.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-background rounded-lg border border-border overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface/50 transition-colors duration-200"
                  >
                    <h3 className="font-body font-medium text-primary pr-4">
                      {faq.question}
                    </h3>
                    <Icon 
                      name={expandedFaq === faq.id ? "ChevronUp" : "ChevronDown"} 
                      size={20} 
                      className="text-text-secondary flex-shrink-0" 
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-text-secondary font-body leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="bg-primary rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-heading font-light text-white mb-4">
              Bleiben Sie über unsere neuesten Projekte informiert
            </h2>
            <p className="text-white/80 font-body mb-8 max-w-2xl mx-auto">
              Abonnieren Sie unseren Newsletter und seien Sie die Ersten, die unsere neuesten architektonischen 
              Kreationen, Design-Einblicke und Branchentrends sehen.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                  className="flex-1 px-4 py-3 rounded-lg border-0 bg-white text-primary font-body focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
                <button
                  type="submit"
                  className="bg-accent text-white px-6 py-3 rounded-lg font-body font-medium transition-all duration-200 hover:bg-accent/90 hover:scale-102 flex items-center justify-center space-x-2"
                >
                  <Icon name="Mail" size={20} />
                  <span>Abonnieren</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;