'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, CheckCircle, Instagram, Linkedin, Facebook, Twitter, Youtube } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FloatingTypography from '@/components/FloatingTypography';

export default function ContactClient({ contactSettings, dict, lang, navigationSettings }) {
  const params = useParams();
  const router = useRouter();
  const langParam = lang || params.lang || 'de';
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

  // Use data from CMS or fallback to defaults
  const officeInfo = contactSettings?.officeInfo || {
    companyName: 'Braun & Eyer Architekten GbR',
    street: 'Mainzerstrasse 29',
    zipCode: '66111',
    city: 'Saarbrücken',
    country: 'Deutschland',
    phone: '+49 681 95417488',
    fax: '+49 681 95417487',
    email: 'info@braunundeyer.de'
  };

  const openingHours = contactSettings?.openingHours || [
    { day: 'Monday', dayDe: 'Montag', open: '09:00', close: '18:00', closed: false },
    { day: 'Tuesday', dayDe: 'Dienstag', open: '09:00', close: '18:00', closed: false },
    { day: 'Wednesday', dayDe: 'Mittwoch', open: '09:00', close: '18:00', closed: false },
    { day: 'Thursday', dayDe: 'Donnerstag', open: '09:00', close: '18:00', closed: false },
    { day: 'Friday', dayDe: 'Freitag', open: '09:00', close: '17:00', closed: false },
    { day: 'Saturday', dayDe: 'Samstag', open: '10:00', close: '14:00', closed: false },
    { day: 'Sunday', dayDe: 'Sonntag', open: '', close: '', closed: true }
  ];

  const socialLinks = contactSettings?.socialLinks?.filter(link => link.active) || [];

  const projectTypes = [
    { value: '', label: dict?.form?.fields?.projectType?.options?.select || 'Projekt auswählen' },
    { value: 'neubau', label: dict?.form?.fields?.projectType?.options?.newConstruction || 'Neubau' },
    { value: 'altbausanierung', label: dict?.form?.fields?.projectType?.options?.renovation || 'Altbausanierung' },
    { value: 'innenarchitektur', label: dict?.form?.fields?.projectType?.options?.interior || 'Innenarchitektur' },
    { value: 'energieberatung', label: dict?.form?.fields?.projectType?.options?.energy || 'Energieberatung' },
    { value: 'arztpraxen', label: dict?.form?.fields?.projectType?.options?.medicalPractices || 'Arztpraxen' },
    { value: 'beratung', label: dict?.form?.fields?.projectType?.options?.consulting || 'Beratung' }
  ];

  // Format business hours
  const businessHours = openingHours.map(hour => {
    if (hour.closed) {
      return `${hour.dayDe}: ${dict?.info?.hours?.closed || 'Geschlossen'}`;
    }
    return `${hour.dayDe}: ${hour.open} - ${hour.close}`;
  }).join('\n');

  const faqData = dict?.faq?.items || [
    {
      question: 'Wie lange dauert ein typisches Projekt?',
      answer: 'Die Projektdauer hängt von der Art und dem Umfang ab. Ein Neubau dauert typischerweise 6-12 Monate, während kleinere Renovierungen oft in 2-4 Monaten abgeschlossen werden können.'
    },
    {
      question: 'Was kostet eine Erstberatung?',
      answer: 'Die erste Beratung ist bei uns unverbindlich und kostenlos. Wir besprechen Ihre Ideen und erstellen ein individuelles Angebot.'
    },
    {
      question: 'Arbeiten Sie auch mit Privatpersonen?',
      answer: 'Ja, wir betreuen sowohl gewerbliche als auch private Projekte. Von der Einzelhaus-Planung bis zum großen Bürokomplex.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = dict?.form?.errors?.name || 'Name ist erforderlich';
    if (!formData.email.trim()) newErrors.email = dict?.form?.errors?.email || 'E-Mail ist erforderlich';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = dict?.form?.errors?.emailInvalid || 'Ungültige E-Mail-Adresse';
    }
    if (!formData.phone.trim()) newErrors.phone = dict?.form?.errors?.phone || 'Telefon ist erforderlich';
    if (!formData.projectType) newErrors.projectType = dict?.form?.errors?.projectType || 'Projekttyp ist erforderlich';
    if (!formData.message.trim()) newErrors.message = dict?.form?.errors?.message || 'Nachricht ist erforderlich';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
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

  // Get social icon component
  const getSocialIcon = (iconName) => {
    const icons = {
      Facebook,
      Instagram,
      Linkedin,
      Twitter,
      Youtube
    };
    return icons[iconName] || null;
  };

  const breadcrumbItems = [
    { href: `/${lang}/homepage`, label: dict?.translation?.nav?.home || 'Startseite' },
    { label: dict?.title || 'Kontakt' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <Header dict={dict.translation || {}} lang={langParam} navigationSettings={navigationSettings} />
      
      {/* Enhanced Floating Typography Background */}
      <FloatingTypography variant="contact" />
      
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
                        <p className="text-text-secondary font-body whitespace-pre-line">{`${officeInfo.street}\n${officeInfo.zipCode} ${officeInfo.city}`}</p>
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
                            href={`tel:${officeInfo.phone}`}
                            className="block text-text-secondary font-body hover:text-accent transition-colors duration-200"
                          >
                            {officeInfo.phone}
                          </a>
                          {officeInfo.fax && (
                            <span className="block text-text-secondary font-body text-sm">
                              Fax: {officeInfo.fax}
                            </span>
                          )}
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
                          href={`mailto:${officeInfo.email}`}
                          className="text-text-secondary font-body hover:text-accent transition-colors duration-200"
                        >
                          {officeInfo.email}
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
                          {businessHours}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  {socialLinks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-border">
                      <h3 className="font-body font-medium text-primary mb-4">{dict?.social?.title || 'Folgen Sie uns'}</h3>
                      <div className="flex space-x-4">
                        {socialLinks.map((link, index) => {
                          const Icon = getSocialIcon(link.icon);
                          return Icon ? (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                              aria-label={link.platform}
                            >
                              <Icon size={20} />
                            </a>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
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

                    {/* Error message for submit */}
                    {errors.submit && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600 font-body">{errors.submit}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-text-secondary font-body">
                        * {dict?.form?.required || 'Pflichtfelder'}
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-accent text-white font-body font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {dict?.form?.submitting || 'Wird gesendet...'}
                          </span>
                        ) : (
                          dict?.form?.submit || 'Nachricht senden'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>

            {/* FAQ Section */}
            {faqData.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl lg:text-3xl font-heading font-light text-primary mb-8">
                  {dict?.faq?.title || 'Häufig gestellte Fragen'}
                </h2>
                <div className="grid gap-4">
                  {faqData.map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-surface rounded-lg border border-border overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <button
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-accent/5 transition-colors duration-200"
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      >
                        <span className="font-body font-medium text-primary pr-4">{item.question}</span>
                        <svg
                          className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-200 ${
                            expandedFaq === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedFaq === index && (
                        <div className="px-6 pb-4">
                          <p className="text-text-secondary font-body">{item.answer}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer dict={dict} lang={lang} onCopyrightClick={handleCopyrightClick} />
    </div>
  );
}