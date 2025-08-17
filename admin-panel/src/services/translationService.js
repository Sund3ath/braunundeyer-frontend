// Translation service for admin panel
import { translationsAPI } from './api';

// Language names for better context
const languageNames = {
  de: 'German',
  en: 'English',
  fr: 'French',
  it: 'Italian',
  es: 'Spanish'
};

// Enhanced translation with context for better quality
export const translateText = async (text, targetLanguage, sourceLanguage = 'de', context = '') => {
  try {
    // Use the API if available, otherwise fallback to mock
    const result = await translationsAPI.translate(text, targetLanguage, sourceLanguage);
    
    if (result && result.translatedText) {
      return result.translatedText;
    }
    
    // Fallback to simple mock translation if API fails
    if (targetLanguage === sourceLanguage) {
      return text;
    }
    
    // Simple mock translation for fallback
    const langMarkers = {
      en: '[EN]',
      fr: '[FR]', 
      it: '[IT]',
      es: '[ES]',
      de: '[DE]'
    };
    
    return `${text} ${langMarkers[targetLanguage] || `[${targetLanguage.toUpperCase()}]`}`;
  } catch (error) {
    console.error('Translation failed:', error);
    // Return original text on error
    return text;
  }
};

export const translateContent = translateText; // Alias for backward compatibility

export const translateContentObject = async (contentObj, targetLanguage, sourceLanguage = 'de', parentKey = '') => {
  try {
    const translatedObj = {};
    for (const [key, value] of Object.entries(contentObj)) {
      // Determine context based on key
      let context = parentKey ? `${parentKey}.${key}` : key;
      
      if (typeof value === 'string') {
        // Add specific context for known fields
        if (key === 'title') context = 'Architecture project title';
        if (key === 'subtitle') context = 'Architecture project subtitle';
        if (key === 'description') context = 'Architecture project description';
        
        translatedObj[key] = await translateText(value, targetLanguage, sourceLanguage, context);
      } else if (Array.isArray(value)) {
        // Handle arrays (like hero slides)
        translatedObj[key] = await Promise.all(
          value.map(item => 
            typeof item === 'object' 
              ? translateContentObject(item, targetLanguage, sourceLanguage, key)
              : item
          )
        );
      } else if (typeof value === 'object' && value !== null) {
        translatedObj[key] = await translateContentObject(value, targetLanguage, sourceLanguage, key);
      } else {
        translatedObj[key] = value;
      }
    }
    return translatedObj;
  } catch (error) {
    console.error('Content object translation failed:', error);
    return contentObj;
  }
};

// Specialized function for translating homepage content
export const translateHomepageContent = async (homepageData, targetLanguage, sourceLanguage = 'de') => {
  try {
    const translated = {
      ...homepageData,
      heroSlides: [],
      featuredProjects: []
    };
    
    // Translate hero slides with proper context
    if (homepageData.heroSlides) {
      translated.heroSlides = await Promise.all(
        homepageData.heroSlides.map(async (slide) => ({
          ...slide,
          title: await translateText(slide.title, targetLanguage, sourceLanguage, 'Hero slide title - architecture website'),
          subtitle: await translateText(slide.subtitle, targetLanguage, sourceLanguage, 'Hero slide subtitle - architecture website'),
          description: await translateText(slide.description, targetLanguage, sourceLanguage, 'Hero slide description - architecture website'),
          // Keep URLs unchanged
          image: slide.image,
          video: slide.video
        }))
      );
    }
    
    // Translate featured projects
    if (homepageData.featuredProjects) {
      translated.featuredProjects = await Promise.all(
        homepageData.featuredProjects.map(async (project) => ({
          ...project,
          title: await translateText(project.title, targetLanguage, sourceLanguage, 'Architecture project name'),
          type: await translateText(project.type, targetLanguage, sourceLanguage, 'Architecture project type'),
          location: await translateText(project.location, targetLanguage, sourceLanguage, 'Project location'),
          // Keep other fields unchanged
          image: project.image,
          year: project.year,
          id: project.id
        }))
      );
    }
    
    return translated;
  } catch (error) {
    console.error('Homepage translation failed:', error);
    return homepageData;
  }
};

export const bulkTranslate = async (texts, targetLanguages, sourceLanguage = 'de') => {
  try {
    const result = await translationsAPI.bulkTranslate(texts, targetLanguages, sourceLanguage);
    return result.translations || {};
  } catch (error) {
    console.error('Bulk translation failed:', error);
    return {};
  }
};

export const detectLanguage = (text) => {
  // Simple language detection based on common words
  const germanWords = ['der', 'die', 'das', 'und', 'ist', 'für'];
  const englishWords = ['the', 'and', 'is', 'for', 'with', 'are'];
  const frenchWords = ['le', 'la', 'les', 'et', 'est', 'pour'];
  
  const words = text.toLowerCase().split(/\s+/);
  
  let scores = {
    de: 0,
    en: 0,
    fr: 0,
    it: 0,
    es: 0
  };
  
  words.forEach(word => {
    if (germanWords.includes(word)) scores.de++;
    if (englishWords.includes(word)) scores.en++;
    if (frenchWords.includes(word)) scores.fr++;
  });
  
  const maxScore = Math.max(...Object.values(scores));
  return Object.keys(scores).find(key => scores[key] === maxScore) || 'de';
};

export const getTranslationStats = (translations) => {
  const stats = {
    total: 0,
    translated: 0,
    pending: 0,
    languages: {},
    cacheSize: 0,
    cacheEnabled: true,
    hasDeepSeekKey: false // Will be updated when we add real API
  };
  
  if (translations && typeof translations === 'object') {
    Object.keys(translations).forEach(key => {
      stats.total++;
      if (translations[key]) {
        stats.translated++;
      } else {
        stats.pending++;
      }
    });
  }
  
  return stats;
};