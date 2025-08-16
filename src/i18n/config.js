import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Import translations
import deTranslations from './locales/de/translation.json';
import enTranslations from './locales/en/translation.json';
import frTranslations from './locales/fr/translation.json';
import itTranslations from './locales/it/translation.json';
import esTranslations from './locales/es/translation.json';

// Import homepage translations
import deHomepage from './locales/de/homepage.json';
import enHomepage from './locales/en/homepage.json';

// Import projects translations
import deProjects from './locales/de/projects.json';
import enProjects from './locales/en/projects.json';

// Import about translations
import deAbout from './locales/de/about.json';
import enAbout from './locales/en/about.json';
import frAbout from './locales/fr/about.json';
import itAbout from './locales/it/about.json';
import esAbout from './locales/es/about.json';

// Import services translations
import deServices from './locales/de/services.json';
import enServices from './locales/en/services.json';
import frServices from './locales/fr/services.json';
import itServices from './locales/it/services.json';
import esServices from './locales/es/services.json';

// Import contact translations
import deContact from './locales/de/contact.json';
import enContact from './locales/en/contact.json';
import frContact from './locales/fr/contact.json';
import itContact from './locales/it/contact.json';
import esContact from './locales/es/contact.json';

const resources = {
  de: { 
    translation: deTranslations,
    homepage: deHomepage,
    projects: deProjects,
    about: deAbout,
    services: deServices,
    contact: deContact
  },
  en: { 
    translation: enTranslations,
    homepage: enHomepage,
    projects: enProjects,
    about: enAbout,
    services: enServices,
    contact: enContact
  },
  fr: { 
    translation: frTranslations,
    homepage: deHomepage, // Using German as fallback for now
    projects: deProjects, // Using German as fallback for now
    about: frAbout,
    services: frServices,
    contact: frContact
  },
  it: { 
    translation: itTranslations,
    homepage: deHomepage, // Using German as fallback for now
    projects: deProjects, // Using German as fallback for now
    about: itAbout,
    services: itServices,
    contact: itContact
  },
  es: { 
    translation: esTranslations,
    homepage: deHomepage, // Using German as fallback for now
    projects: deProjects, // Using German as fallback for now
    about: esAbout,
    services: esServices,
    contact: esContact
  }
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de', // default language
    fallbackLng: 'de',
    defaultNS: 'translation',
    ns: ['translation', 'homepage', 'projects', 'about', 'services', 'contact'],
    debug: false,
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
      cookieOptions: { path: '/', sameSite: 'strict' }
    },
    
    react: {
      useSuspense: false
    }
  });

export const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export default i18n;