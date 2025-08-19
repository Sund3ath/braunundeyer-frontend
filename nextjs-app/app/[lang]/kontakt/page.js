'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, CheckCircle, Instagram, Linkedin, Facebook, Twitter, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FloatingTypography from '@/components/FloatingTypography';

export default function ContactPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang || 'de';
  const [dict, setDict] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    timeline: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
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
    setIsLoading(true);
    Promise.all([
      import(`@/lib/locales/${lang}/contact.json`),
      import(`@/lib/locales/${lang}/translation.json`)
    ]).then(([contactModule, translationModule]) => {
      setDict({
        ...contactModule.default,
        translation: translationModule.default
      });
      setIsLoading(false);
    });
  }, [lang]);

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

  const projectTypes = [
    { value: '', label: dict?.form?.fields?.projectType?.options?.select || 'Projekt auswählen' },
    { value: 'neubau', label: dict?.form?.fields?.projectType?.options?.newConstruction || 'Neubau' },
    { value: 'altbausanierung', label: dict?.form?.fields?.projectType?.options?.renovation || 'Altbausanierung' },
    { value: 'innenarchitektur', label: dict?.form?.fields?.projectType?.options?.interior || 'Innenarchitektur' },
    { value: 'energieberatung', label: dict?.form?.fields?.projectType?.options?.energy || 'Energieberatung' },
    { value: 'projektmanagement', label: dict?.form?.fields?.projectType?.options?.projectManagement || 'Projektmanagement' },
    { value: 'beratung', label: dict?.form?.fields?.projectType?.options?.consulting || 'Beratung' }
  ];

  const contactInfo = {
    address: dict?.info?.address?.value || 'Mainzerstrasse 29\n66111 Saarbrücken',
    phone: dict?.info?.phone?.office || '+49 681 95417488',
    mobile: dict?.info?.phone?.mobile || '+49 171 1234567',
    email: dict?.info?.email?.value || 'info@braunundeyer.de',
    businessHours: dict?.info?.hours ? 
      `${dict.info.hours.weekdays || 'Mo-Fr: 09:00 - 18:00'}\n${dict.info.hours.saturday || 'Sa: 10:00 - 14:00'}\n${dict.info.hours.sunday || 'So: Geschlossen'}` :
      'Mo-Fr: 09:00 - 18:00\nSa: 10:00 - 14:00\nSo: Geschlossen'
  };

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/braunundeyer' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' }
  ];

  const faqData = dict?.faq?.items || [
    {
      question: 'Wie lange dauert ein typisches Projekt?',
      answer: 'Die Projektdauer hängt von der Art und dem Umfang ab. Ein Neubau dauert typischerweise 6-12 Monate, während kleinere Renovierungen oft in 2-4 Monaten abgeschlossen werden können.'
    },
    {
      question: 'Welche Leistungsphasen bieten Sie an?',
      answer: 'Wir bieten alle HOAI-Leistungsphasen von 1-9 an, von der Grundlagenermittlung bis zur Objektbetreuung und Dokumentation.'
    },
    {
      question: 'Arbeiten Sie auch mit Bestandsgebäuden?',
      answer: 'Ja, wir sind auf Altbausanierung und Denkmalschutz spezialisiert und haben langjährige Erfahrung in der behutsamen Modernisierung historischer Gebäude.'
    },
    {
      question: 'Wie erfolgt die Kostenberechnung?',
      answer: 'Die Kosten werden nach der HOAI (Honorarordnung für Architekten und Ingenieure) berechnet. Gerne erstellen wir Ihnen ein individuelles Angebot.'
    },
    {
      question: 'Bieten Sie auch Energieberatung an?',
      answer: 'Ja, wir bieten umfassende Energieberatung und unterstützen Sie bei Förderanträgen für energetische Sanierungen und Neubauten.'
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = dict?.form?.fields?.name?.error || 'Bitte geben Sie Ihren Namen ein';
    }

    if (!formData.email.trim()) {
      newErrors.email = dict?.form?.fields?.email?.error || 'Bitte geben Sie Ihre E-Mail ein';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = dict?.form?.fields?.email?.errorInvalid || 'Bitte geben Sie eine gültige E-Mail ein';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = dict?.form?.fields?.phone?.error || 'Bitte geben Sie Ihre Telefonnummer ein';
    }

    if (!formData.projectType) {
      newErrors.projectType = dict?.form?.fields?.projectType?.error || 'Bitte wählen Sie einen Projekttyp';
    }

    if (!formData.message.trim()) {
      newErrors.message = dict?.form?.fields?.message?.error || 'Bitte geben Sie eine Nachricht ein';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = dict?.form?.fields?.message?.errorShort || 'Die Nachricht muss mindestens 10 Zeichen lang sein';
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

    try {
      // Get the API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      
      // Send the form data to the backend
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          timeline: '',
          message: ''
        });
      } else {
        // Show error message
        setErrors({ 
          submit: result.error || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' 
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ 
        submit: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' 
      });
    } finally {
      setIsSubmitting(false);
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

  const breadcrumbItems = [
    { href: `/${lang}/homepage`, label: dict?.translation?.nav?.home || 'Startseite' },
    { label: dict?.title || 'Kontakt' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

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

      <Header dict={dict.translation || {}} lang={lang} />
      
      {/* Enhanced Floating Typography Background */}
      <FloatingTypography variant="contact" />

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
        {/* Breadcrumb Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-6">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
                {dict?.title || 'Kontakt'}
              </h1>
              <p className="text-xl lg:text-2xl text-text-secondary font-body leading-relaxed">
                {dict?.subtitle || 'Lassen Sie uns gemeinsam Ihr Projekt verwirklichen'}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* Contact Information & Map */}
              <div className="space-y-8">
                {/* Contact Details */}
                <motion.div 
                  className="bg-surface rounded-lg p-6 lg:p-8 shadow-subtle"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-heading font-light text-primary mb-6">
                    {dict?.info?.title || 'Büro'}
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={24} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-body font-medium text-primary mb-1">{dict?.info?.address?.label || 'Adresse'}</h3>
                        <p className="text-text-secondary font-body whitespace-pre-line">{contactInfo.address}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone size={24} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-body font-medium text-primary mb-1">{dict?.info?.phone?.label || 'Telefon'}</h3>
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
                        <Mail size={24} className="text-accent" />
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
                        <Clock size={24} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-body font-medium text-primary mb-1">{dict?.info?.hours?.label || 'Öffnungszeiten'}</h3>
                        <div className="text-text-secondary font-body whitespace-pre-line">
                          {contactInfo.businessHours}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="font-body font-medium text-primary mb-4">{dict?.social?.title || 'Folgen Sie uns'}</h3>
                    <div className="flex space-x-4">
                      {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                          <a
                            key={social.name}
                            href={social.url}
                            className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                            aria-label={social.name}
                          >
                            <Icon size={20} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Map */}
                <motion.div 
                  className="bg-surface rounded-lg overflow-hidden shadow-subtle"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="h-64 lg:h-80">
                    <iframe
                      width="100%"
                      height="100%"
                      loading="lazy"
                      title="Braun & Eyer Bürostandort"
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2609.764726082186!2d6.989532315674923!3d49.23412917932648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795b6a73c7dd3e5%3A0x1234567890abcdef!2sMainzerstra%C3%9Fe%2029%2C%2066111%20Saarbr%C3%BCcken!5e0!3m2!1sde!2sde!4v1234567890123"
                      className="border-0"
                      allow="fullscreen"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              </div>

              {/* Contact Form */}
              <motion.div 
                className="bg-surface rounded-lg p-6 lg:p-8 border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-heading font-light text-primary mb-6">
                  {dict?.form?.title || 'Kontakt aufnehmen'}
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-heading font-light text-primary mb-2">
                      {dict?.form?.success?.title || 'Vielen Dank für Ihre Nachricht!'}
                    </h3>
                    <p className="text-text-secondary font-body mb-4">
                      {dict?.form?.success?.message || 'Wir werden uns so schnell wie möglich bei Ihnen melden.'}
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-accent hover:text-primary transition-colors duration-200 font-body font-medium"
                    >
                      {dict?.form?.sendAnother || 'Neue Nachricht senden'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-body font-medium text-primary mb-2">
                        {dict?.form?.fields?.name?.label || 'Name'} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                          errors.name 
                            ? 'border-red-500 bg-red-50 text-red-900' 
                            : 'border-border bg-background text-primary focus:border-accent'
                        }`}
                        placeholder={dict?.form?.fields?.name?.placeholder || 'Ihr vollständiger Name'}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 font-body">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-body font-medium text-primary mb-2">
                        {dict?.form?.fields?.email?.label || 'E-Mail'} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                          errors.email 
                            ? 'border-red-500 bg-red-50 text-red-900' 
                            : 'border-border bg-background text-primary focus:border-accent'
                        }`}
                        placeholder={dict?.form?.fields?.email?.placeholder || 'ihre.email@beispiel.de'}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 font-body">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-body font-medium text-primary mb-2">
                        {dict?.form?.fields?.phone?.label || 'Telefon'} *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                          errors.phone 
                            ? 'border-red-500 bg-red-50 text-red-900' 
                            : 'border-border bg-background text-primary focus:border-accent'
                        }`}
                        placeholder={dict?.form?.fields?.phone?.placeholder || '+49 123 456789'}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 font-body">{errors.phone}</p>
                      )}
                    </div>

                    {/* Project Type */}
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-body font-medium text-primary mb-2">
                        {dict?.form?.fields?.projectType?.label || 'Projekttyp'} *
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                          errors.projectType 
                            ? 'border-red-500 bg-red-50 text-red-900' 
                            : 'border-border bg-background text-primary focus:border-accent'
                        }`}
                      >
                        {projectTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p className="mt-1 text-sm text-red-600 font-body">{errors.projectType}</p>
                      )}
                    </div>

                    {/* Timeline */}
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-body font-medium text-primary mb-2">
                        {dict?.form?.fields?.timeline?.label || 'Zeitrahmen'}
                      </label>
                      <input
                        type="text"
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        placeholder={dict?.form?.fields?.timeline?.placeholder || 'z.B. In 3-6 Monaten'}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-body font-medium text-primary mb-2">
                        {dict?.form?.fields?.message?.label || 'Nachricht'} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className={`w-full px-4 py-3 rounded-lg border font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none ${
                          errors.message 
                            ? 'border-red-500 bg-red-50 text-red-900' 
                            : 'border-border bg-background text-primary focus:border-accent'
                        }`}
                        placeholder={dict?.form?.fields?.message?.placeholder || 'Beschreiben Sie Ihr Projekt...'}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600 font-body">{errors.message}</p>
                      )}
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-body text-sm">
                        {errors.submit}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-8 rounded-lg font-body font-medium transition-all duration-200 ${
                        isSubmitting
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-accent text-white hover:scale-105 hover:shadow-lg'
                      }`}
                    >
                      {isSubmitting ? (dict?.form?.submitting || 'Wird gesendet...') : (dict?.form?.submit || 'Nachricht senden')}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-surface/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
                {dict?.faq?.title || 'Häufig gestellte Fragen'}
              </h2>
              <p className="text-lg text-text-secondary font-body">
                {dict?.faq?.subtitle || 'Hier finden Sie Antworten auf die wichtigsten Fragen'}
              </p>
            </div>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-background rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-surface transition-colors duration-200"
                  >
                    <h3 className="text-lg font-body font-medium text-primary pr-4">{faq.question}</h3>
                    <Plus 
                      size={20} 
                      className={`text-accent transition-transform duration-200 ${expandedFaq === index ? 'rotate-45' : ''}`}
                    />
                  </button>
                  {expandedFaq === index && (
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
      </main>

      <Footer dict={dict.translation} lang={lang} onCopyrightClick={handleCopyrightClick} />
    </div>
  );
}