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

const resources = {
  de: { translation: deTranslations },
  en: { translation: enTranslations },
  fr: { translation: frTranslations },
  it: { translation: itTranslations },
  es: { translation: esTranslations }
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de', // default language
    fallbackLng: 'de',
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