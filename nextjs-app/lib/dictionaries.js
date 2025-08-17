import deTranslation from './locales/de/translation.json';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import itTranslation from './locales/it/translation.json';
import esTranslation from './locales/es/translation.json';

import deHomepage from './locales/de/homepage.json';
import enHomepage from './locales/en/homepage.json';

import deProjects from './locales/de/projects.json';
import enProjects from './locales/en/projects.json';

import deAbout from './locales/de/about.json';
import enAbout from './locales/en/about.json';
import frAbout from './locales/fr/about.json';
import itAbout from './locales/it/about.json';
import esAbout from './locales/es/about.json';

import deServices from './locales/de/services.json';
import enServices from './locales/en/services.json';
import frServices from './locales/fr/services.json';
import itServices from './locales/it/services.json';
import esServices from './locales/es/services.json';

import deContact from './locales/de/contact.json';
import enContact from './locales/en/contact.json';
import frContact from './locales/fr/contact.json';
import itContact from './locales/it/contact.json';
import esContact from './locales/es/contact.json';

const dictionaries = {
  de: {
    translation: deTranslation,
    homepage: deHomepage,
    projects: deProjects,
    about: deAbout,
    services: deServices,
    contact: deContact,
  },
  en: {
    translation: enTranslation,
    homepage: enHomepage,
    projects: enProjects,
    about: enAbout,
    services: enServices,
    contact: enContact,
  },
  fr: {
    translation: frTranslation,
    homepage: deHomepage, // Using German as fallback
    projects: deProjects, // Using German as fallback
    about: frAbout,
    services: frServices,
    contact: frContact,
  },
  it: {
    translation: itTranslation,
    homepage: deHomepage, // Using German as fallback
    projects: deProjects, // Using German as fallback
    about: itAbout,
    services: itServices,
    contact: itContact,
  },
  es: {
    translation: esTranslation,
    homepage: deHomepage, // Using German as fallback
    projects: deProjects, // Using German as fallback
    about: esAbout,
    services: esServices,
    contact: esContact,
  },
};

export async function getDictionary(locale) {
  return dictionaries[locale] || dictionaries.de;
}