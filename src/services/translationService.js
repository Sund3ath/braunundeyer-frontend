import axios from 'axios';
import ENV from '../config/environment';

// Translation service configuration
const TRANSLATION_CONFIG = {
  // DeepSeek API endpoint (you'll need to add your API key)
  deepseekApiUrl: ENV.DEEPSEEK_API_URL,
  deepseekApiKey: ENV.DEEPSEEK_API_KEY,
  
  // Fallback to browser's translation API if available
  useBrowserApi: true,
  
  // Cache translations to reduce API calls
  cacheEnabled: true,
  cacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Translation cache
const translationCache = new Map();

// Language names for prompts
const languageNames = {
  de: 'German',
  en: 'English',
  fr: 'French',
  it: 'Italian',
  es: 'Spanish'
};

/**
 * Translate content using DeepSeek API
 */
async function translateWithDeepSeek(text, fromLang, toLang) {
  if (!TRANSLATION_CONFIG.deepseekApiKey) {
    throw new Error('DeepSeek API key not configured');
  }
  
  const prompt = `Translate the following text from ${languageNames[fromLang]} to ${languageNames[toLang]}. 
Keep the translation natural and appropriate for a professional architecture website.
Preserve any HTML tags, line breaks, and formatting.
Only return the translated text without any explanations.

Text to translate:
${text}`;
  
  try {
    const response = await axios.post(
      TRANSLATION_CONFIG.deepseekApiUrl,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator specializing in architecture and construction terminology. Provide accurate, natural translations while preserving formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${TRANSLATION_CONFIG.deepseekApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('DeepSeek translation error:', error);
    throw error;
  }
}

/**
 * Fallback translation using Google Translate API (free tier)
 */
async function translateWithGoogle(text, fromLang, toLang) {
  // This uses a free Google Translate API endpoint
  // Note: This is for demo purposes. In production, use official Google Cloud Translation API
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Extract translated text from response
    let translated = '';
    if (data && data[0]) {
      data[0].forEach(item => {
        if (item[0]) {
          translated += item[0];
        }
      });
    }
    
    return translated || text;
  } catch (error) {
    console.error('Google Translate error:', error);
    return text; // Return original text if translation fails
  }
}

/**
 * Mock translation for demo purposes
 */
function mockTranslate(text, fromLang, toLang) {
  // Simple mock translation that adds language prefix
  // In production, this would be replaced with actual API calls
  const translations = {
    'de-en': {
      'Innovative Architektur mit Tradition': 'Innovative Architecture with Tradition',
      'Unsere Projekte': 'Our Projects',
      'Über uns': 'About Us',
      'Leistungen': 'Services',
      'Kontakt': 'Contact',
      'Neubau': 'New Building',
      'Altbausanierung': 'Renovation',
      'Gewerbebau': 'Commercial',
      'Planung': 'Planning',
      'Beratung': 'Consulting',
      'Projektmanagement': 'Project Management',
      'Sanierung': 'Renovation'
    },
    'de-fr': {
      'Innovative Architektur mit Tradition': 'Architecture Innovante avec Tradition',
      'Unsere Projekte': 'Nos Projets',
      'Über uns': 'À Propos',
      'Leistungen': 'Services',
      'Kontakt': 'Contact',
      'Neubau': 'Construction Neuve',
      'Altbausanierung': 'Rénovation',
      'Gewerbebau': 'Commercial',
      'Planung': 'Planification',
      'Beratung': 'Conseil',
      'Projektmanagement': 'Gestion de Projet',
      'Sanierung': 'Rénovation'
    },
    'de-it': {
      'Innovative Architektur mit Tradition': 'Architettura Innovativa con Tradizione',
      'Unsere Projekte': 'I Nostri Progetti',
      'Über uns': 'Chi Siamo',
      'Leistungen': 'Servizi',
      'Kontakt': 'Contatti',
      'Neubau': 'Nuova Costruzione',
      'Altbausanierung': 'Ristrutturazione',
      'Gewerbebau': 'Commerciale',
      'Planung': 'Pianificazione',
      'Beratung': 'Consulenza',
      'Projektmanagement': 'Gestione Progetti',
      'Sanierung': 'Ristrutturazione'
    },
    'de-es': {
      'Innovative Architektur mit Tradition': 'Arquitectura Innovadora con Tradición',
      'Unsere Projekte': 'Nuestros Proyectos',
      'Über uns': 'Nosotros',
      'Leistungen': 'Servicios',
      'Kontakt': 'Contacto',
      'Neubau': 'Nueva Construcción',
      'Altbausanierung': 'Renovación',
      'Gewerbebau': 'Comercial',
      'Planung': 'Planificación',
      'Beratung': 'Consultoría',
      'Projektmanagement': 'Gestión de Proyectos',
      'Sanierung': 'Renovación'
    }
  };
  
  const key = `${fromLang}-${toLang}`;
  const translationMap = translations[key] || {};
  
  // Check if we have a direct translation
  if (translationMap[text]) {
    return translationMap[text];
  }
  
  // For demo, return text with language indicator
  return `[${toLang}] ${text}`;
}

/**
 * Main translation function
 */
export async function translateContent(text, fromLang, toLang, options = {}) {
  // Skip if same language
  if (fromLang === toLang) {
    return text;
  }
  
  // Check cache first
  const cacheKey = `${fromLang}-${toLang}-${text}`;
  if (TRANSLATION_CONFIG.cacheEnabled && translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey);
    if (Date.now() - cached.timestamp < TRANSLATION_CONFIG.cacheExpiry) {
      return cached.translation;
    }
  }
  
  let translation;
  
  try {
    if (options.useDeepSeek && TRANSLATION_CONFIG.deepseekApiKey) {
      // Use DeepSeek API
      translation = await translateWithDeepSeek(text, fromLang, toLang);
    } else if (options.useGoogle) {
      // Use Google Translate
      translation = await translateWithGoogle(text, fromLang, toLang);
    } else {
      // Use mock translation for demo
      translation = mockTranslate(text, fromLang, toLang);
    }
    
    // Cache the translation
    if (TRANSLATION_CONFIG.cacheEnabled) {
      translationCache.set(cacheKey, {
        translation,
        timestamp: Date.now()
      });
    }
    
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Batch translate multiple texts
 */
export async function translateBatch(texts, fromLang, toLang, options = {}) {
  const translations = await Promise.all(
    texts.map(text => translateContent(text, fromLang, toLang, options))
  );
  return translations;
}

/**
 * Translate an entire content object
 */
export async function translateContentObject(contentObj, fromLang, toLang, options = {}) {
  const translatedObj = {};
  
  for (const [key, value] of Object.entries(contentObj)) {
    if (typeof value === 'string') {
      translatedObj[key] = await translateContent(value, fromLang, toLang, options);
    } else if (typeof value === 'object' && value !== null) {
      translatedObj[key] = await translateContentObject(value, fromLang, toLang, options);
    } else {
      translatedObj[key] = value;
    }
  }
  
  return translatedObj;
}

/**
 * Auto-detect source language
 */
export async function detectLanguage(text) {
  // Simple language detection based on common words
  const languagePatterns = {
    de: /\b(der|die|das|und|oder|aber|mit|von|zu|für|auf|in|an|bei)\b/gi,
    en: /\b(the|and|or|but|with|from|to|for|on|in|at|by|is|are|was|were)\b/gi,
    fr: /\b(le|la|les|et|ou|mais|avec|de|à|pour|sur|dans|par)\b/gi,
    it: /\b(il|la|le|e|o|ma|con|di|a|per|su|in|da)\b/gi,
    es: /\b(el|la|los|las|y|o|pero|con|de|a|para|sobre|en|por)\b/gi
  };
  
  let maxScore = 0;
  let detectedLang = 'de'; // Default to German
  
  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    const matches = text.match(pattern);
    const score = matches ? matches.length : 0;
    
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }
  
  return detectedLang;
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
}

/**
 * Get translation statistics
 */
export function getTranslationStats() {
  return {
    cacheSize: translationCache.size,
    cacheEnabled: TRANSLATION_CONFIG.cacheEnabled,
    hasDeepSeekKey: !!TRANSLATION_CONFIG.deepseekApiKey
  };
}

export default {
  translateContent,
  translateBatch,
  translateContentObject,
  detectLanguage,
  clearTranslationCache,
  getTranslationStats
};