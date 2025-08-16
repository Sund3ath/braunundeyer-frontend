import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n/config';
import Icon from './AppIcon';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentLang = lang || i18n.language || 'de';
  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLanguageChange = (newLang) => {
    // Update i18n language
    i18n.changeLanguage(newLang);
    
    // Get current path without language prefix
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentLangInPath = languages.find(l => l.code === pathSegments[0]);
    
    if (currentLangInPath) {
      pathSegments.shift(); // Remove current language
    }
    
    // Build new path with new language
    const newPath = `/${newLang}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : '/homepage'}`;
    
    // Navigate to new path
    navigate(newPath);
    setIsOpen(false);
    
    // Store language preference
    localStorage.setItem('preferredLanguage', newLang);
    document.documentElement.lang = newLang;
    
    // Update meta tags
    updateMetaTags(newLang);
  };
  
  const updateMetaTags = (lang) => {
    // Update html lang attribute
    document.documentElement.setAttribute('lang', lang);
    
    // Update content-language meta tag
    const contentLangMeta = document.querySelector('meta[http-equiv="content-language"]');
    if (contentLangMeta) {
      contentLangMeta.content = lang;
    }
    
    // Update og:locale
    const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
    if (ogLocaleMeta) {
      const localeMap = {
        'de': 'de_DE',
        'en': 'en_US',
        'fr': 'fr_FR',
        'it': 'it_IT',
        'es': 'es_ES'
      };
      ogLocaleMeta.content = localeMap[lang] || 'de_DE';
    }
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white border border-white/20"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span className="text-xl" role="img" aria-label={currentLanguage.name}>
          {currentLanguage.flag}
        </span>
        <span className="font-medium text-sm">{currentLanguage.code.toUpperCase()}</span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150 ${
                    language.code === currentLang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  aria-label={`Switch to ${language.name}`}
                >
                  <span className="text-xl" role="img" aria-label={language.name}>
                    {language.flag}
                  </span>
                  <span className="flex-1 text-left font-medium">
                    {language.name}
                  </span>
                  {language.code === currentLang && (
                    <Icon name="Check" size={16} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
            
            {/* SEO Info */}
            <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
              <p className="text-xs text-gray-500">
                Content available in all languages with proper SEO optimization
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;