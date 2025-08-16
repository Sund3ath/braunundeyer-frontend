import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import CursorTrail from '../../components/ui/CursorTrail';
import SEO from '../../components/SEO';
import Footer from '../../components/Footer';
import { generateBreadcrumbSchema, generateLocalBusinessSchema, combineSchemas } from '../../utils/structuredData';

const Contact = () => {
  const { t, i18n } = useTranslation(['contact', 'translation']);
  const location = useLocation();
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';
  
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

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const projectTypes = [
    { value: '', label: t('contact:form.fields.projectType.options.select') },
    { value: 'neubau', label: t('contact:form.fields.projectType.options.newConstruction') },
    { value: 'altbausanierung', label: t('contact:form.fields.projectType.options.renovation') },
    { value: 'innenarchitektur', label: t('contact:form.fields.projectType.options.interior') },
    { value: 'energieberatung', label: t('contact:form.fields.projectType.options.energy') },
    { value: 'projektmanagement', label: t('contact:form.fields.projectType.options.projectManagement') },
    { value: 'beratung', label: t('contact:form.fields.projectType.options.consulting') }
  ];

  const budgetRanges = [
    { value: '', label: t('contact:form.fields.budget.options.select') },
    { value: 'unter-100k', label: t('contact:form.fields.budget.options.under100k') },
    { value: '100k-250k', label: t('contact:form.fields.budget.options.100to250k') },
    { value: '250k-500k', label: t('contact:form.fields.budget.options.250to500k') },
    { value: '500k-1m', label: t('contact:form.fields.budget.options.500to1m') },
    { value: 'ueber-1m', label: t('contact:form.fields.budget.options.over1m') },
    { value: 'besprechen', label: t('contact:form.fields.budget.options.discuss') }
  ];

  const contactInfo = {
    address: t('contact:info.address.value'),
    phone: t('contact:info.phone.office'),
    mobile: t('contact:info.phone.mobile'),
    email: t('contact:info.email.value'),
    businessHours: `${t('contact:info.hours.weekdays')}\n${t('contact:info.hours.saturday')}\n${t('contact:info.hours.sunday')}`
  };

  const socialLinks = [
    { name: 'Instagram', icon: 'Instagram', url: 'https://www.instagram.com/braunundeyer' },
    { name: 'LinkedIn', icon: 'Linkedin', url: '#' },
    { name: 'Facebook', icon: 'Facebook', url: '#' },
    { name: 'Twitter', icon: 'Twitter', url: '#' }
  ];

  const faqData = t('contact:faq.items', { returnObjects: true }).map((item, index) => ({
    id: index + 1,
    question: item.question,
    answer: item.answer
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact:form.fields.name.error');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact:form.fields.email.error');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contact:form.fields.email.errorInvalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('contact:form.fields.phone.error');
    }

    if (!formData.projectType) {
      newErrors.projectType = t('contact:form.fields.projectType.error');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact:form.fields.message.error');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact:form.fields.message.errorShort');
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

  // Background typography words for Contact page - removed as we'll place them per section

  return (
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
      <SEO 
        title={`${t('contact:title')} | Braun & Eyer ${t('translation:hero.title')}`}
        description={t('contact:subtitle')}
        keywords={`${t('contact:title')}, ${t('contact:form.title')}, ${t('contact:info.title')}`}
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
        {/* Breadcrumb Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border relative z-base">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb />
            <div className="mt-6">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
                {t('contact:title')}
              </h1>
              <p className="text-xl lg:text-2xl text-text-secondary font-body leading-relaxed">
                {t('contact:subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24 relative" style={{ zIndex: 5 }}>
          {/* Background Typography for Contact Form */}
          <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
            <motion.div
              className="absolute text-[13rem] opacity-[0.08] text-gray-400 font-thin select-none whitespace-nowrap"
              style={{ left: "-10%", top: "35%" }}
              animate={{
                x: [0, 25, -15, 0],
                y: [0, -12, 8, 0],
                rotate: [0, 0.3, -0.2, 0],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              KONTAKT
            </motion.div>
            <motion.div
              className="absolute text-8xl opacity-[0.11] text-gray-400 font-thin select-none whitespace-nowrap"
              style={{ right: "-8%", top: "65%" }}
              animate={{
                x: [0, -20, 10, 0],
                y: [0, 15, -10, 0],
                rotate: [0, -0.4, 0.5, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                delay: 3,
                ease: "linear"
              }}
            >
              dialog
            </motion.div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative" style={{ zIndex: 3 }}>
            
            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="card-elevated rounded-lg p-6 lg:p-8">
                <h2 className="text-2xl font-heading font-light text-primary mb-6">
                  {t('contact:info.title')}
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="MapPin" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-body font-medium text-primary mb-1">{t('contact:info.address.label')}</h3>
                      <p className="text-text-secondary font-body">{contactInfo.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Phone" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-body font-medium text-primary mb-1">{t('contact:info.phone.label')}</h3>
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
                      <h3 className="font-body font-medium text-primary mb-1">{t('contact:info.hours.label')}</h3>
                      <div className="text-text-secondary font-body whitespace-pre-line">
                        {contactInfo.businessHours}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-body font-medium text-primary mb-4">{t('contact:social.title')}</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                        aria-label={`${t('contact:social.title')} ${social.name}`}
                      >
                        <Icon name={social.icon} size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="card-elevated rounded-lg overflow-hidden">
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
                {t('contact:form.title')}
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle" size={32} className="text-success" />
                  </div>
                  <h3 className="text-xl font-heading font-light text-primary mb-2">
                    {t('contact:form.success.title')}
                  </h3>
                  <p className="text-text-secondary font-body mb-4">
                    {t('contact:form.success.message')}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-accent hover:text-primary transition-colors duration-200 font-body font-medium"
                  >
                    {t('contact:form.title')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-body font-medium text-primary mb-2">
                      {t('contact:form.fields.name.label')} *
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
                      placeholder={t('contact:form.fields.name.placeholder')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-error font-body">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-body font-medium text-primary mb-2">
                      {t('contact:form.fields.email.label')} *
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
                      placeholder={t('contact:form.fields.email.placeholder')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-error font-body">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-body font-medium text-primary mb-2">
                      {t('contact:form.fields.phone.label')} *
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
                      placeholder={t('contact:form.fields.phone.placeholder')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-error font-body">{errors.phone}</p>
                    )}
                  </div>

                  {/* Project Type */}
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-body font-medium text-primary mb-2">
                      {t('contact:form.fields.projectType.label')} *
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


                  {/* Timeline */}
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-body font-medium text-primary mb-2">
                      {t('contact:form.fields.timeline.label')}
                    </label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary font-body transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      placeholder={t('contact:form.fields.timeline.placeholder')}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-body font-medium text-primary mb-2">
                      {t('contact:form.fields.message.label')} *
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
                      placeholder={t('contact:form.fields.message.placeholder')}
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
                        <span>{t('contact:form.submitting')}</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={20} />
                        <span>{t('contact:form.submit')}</span>
                      </>
                    )}
                  </button>

                  <p className="text-sm text-text-secondary font-body text-center">
                    {t('contact:form.success.message')}
                  </p>
                </form>
              )}
            </div>
          </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-surface/95 backdrop-blur-sm py-16 lg:py-24 relative z-base">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
                {t('contact:faq.title')}
              </h2>
              <p className="text-lg text-text-secondary font-body">
                {t('contact:faq.subtitle')}
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

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;