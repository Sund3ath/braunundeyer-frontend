import logger from '../utils/logger.js';
import fetch from 'node-fetch';

// Simple in-memory cache for translations
const translationCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Language names mapping
const languageNames = {
  de: 'German',
  en: 'English', 
  fr: 'French',
  it: 'Italian',
  es: 'Spanish'
};

// DeepSeek API configuration - get dynamically to ensure env vars are loaded
const getDeepSeekConfig = () => ({
  apiKey: process.env.DEEPSEEK_API_KEY,
  apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions'
});

// Call DeepSeek API for translation
const callDeepSeekAPI = async (text, targetLanguage, sourceLanguage = 'de', context = '') => {
  try {
    // Build the prompt for translation with grammar and spelling checks
    const targetLangName = languageNames[targetLanguage] || targetLanguage;
    const sourceLangName = languageNames[sourceLanguage] || sourceLanguage;
    
    const systemPrompt = `You are a professional translator specializing in architectural and construction terminology. 
Your task is to translate text from ${sourceLangName} to ${targetLangName}.

Requirements:
1. Ensure perfect grammar and spelling in the target language
2. Maintain professional architectural terminology where appropriate
3. Keep the tone formal and professional
4. Preserve any technical terms that are commonly used in the target language
5. Return ONLY the translated text without any explanations or notes
${context ? `\nContext: ${context}` : ''}`;

    const userPrompt = `Translate the following text from ${sourceLangName} to ${targetLangName}:

"${text}"

Important: Return only the translated text, nothing else.`;

    const { apiKey, apiUrl } = getDeepSeekConfig();
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const translatedText = data.choices[0].message.content.trim();
      // Remove any quotes that might have been added
      return translatedText.replace(/^["']|["']$/g, '');
    }
    
    throw new Error('Invalid response from DeepSeek API');
    
  } catch (error) {
    logger.error('DeepSeek API call failed:', error);
    throw error;
  }
};

// Mock translation function (fallback)
const mockTranslate = async (text, targetLang, sourceLang) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simple mock translations for fallback
  if (targetLang === sourceLang) {
    return text;
  }
  
  // Add language marker for mock translation
  const langMarkers = {
    en: '[EN]',
    fr: '[FR]',
    it: '[IT]',
    es: '[ES]',
    de: '[DE]'
  };
  
  return `${text} ${langMarkers[targetLang] || `[${targetLang.toUpperCase()}]`}`;
};

// Main translation function
const translateText = async (text, targetLanguage, sourceLanguage = 'de', context = '') => {
  try {
    // Check cache first
    const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
    const cached = translationCache.get(cacheKey);
    
    if (cached && cached.timestamp > Date.now() - CACHE_TTL) {
      logger.debug(`Translation cache hit for: ${cacheKey.substring(0, 50)}...`);
      return cached.translation;
    }
    
    // If source and target are the same, return original text
    if (sourceLanguage === targetLanguage) {
      return text;
    }
    
    let translation;
    
    // Check if we have DeepSeek API key configured
    const { apiKey } = getDeepSeekConfig();
    if (apiKey && apiKey !== 'your-api-key-here') {
      logger.info(`Translating with DeepSeek API: "${text.substring(0, 50)}..." from ${sourceLanguage} to ${targetLanguage}`);
      try {
        translation = await callDeepSeekAPI(text, targetLanguage, sourceLanguage, context);
        logger.info(`DeepSeek translation successful`);
      } catch (apiError) {
        logger.error('DeepSeek API failed, falling back to mock:', apiError);
        translation = await mockTranslate(text, targetLanguage, sourceLanguage);
      }
    } else {
      // Use mock translation for development
      logger.debug(`Using mock translation for: ${text.substring(0, 50)}...`);
      translation = await mockTranslate(text, targetLanguage, sourceLanguage);
    }
    
    // Cache the translation
    translationCache.set(cacheKey, {
      translation,
      timestamp: Date.now()
    });
    
    return translation;
    
  } catch (error) {
    logger.error('Translation error:', error);
    // Return original text on error
    return text;
  }
};

// Get translation statistics
const getStats = async () => {
  const { apiKey } = getDeepSeekConfig();
  const stats = {
    cacheSize: translationCache.size,
    cacheEnabled: true,
    apiConfigured: !!(apiKey && apiKey !== 'your-api-key-here'),
    apiProvider: apiKey ? 'DeepSeek' : 'Mock',
    supportedLanguages: Object.keys(languageNames),
    cacheTTL: CACHE_TTL
  };
  
  return stats;
};

// Clear translation cache
const clearCache = async () => {
  translationCache.clear();
  logger.info('Translation cache cleared');
  return true;
};

// Translate object with multiple text fields
const translateObject = async (obj, targetLanguage, sourceLanguage = 'de', parentContext = '') => {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Create context based on the key
    let context = parentContext;
    if (key === 'title') context = 'Architecture project title';
    if (key === 'subtitle') context = 'Architecture project subtitle';
    if (key === 'description') context = 'Architecture project description';
    if (key === 'location') context = 'Project location';
    if (key === 'type') context = 'Project type/category';
    
    if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLanguage, sourceLanguage, context);
    } else if (Array.isArray(value)) {
      translated[key] = await Promise.all(
        value.map(item => 
          typeof item === 'object' 
            ? translateObject(item, targetLanguage, sourceLanguage, key)
            : translateText(item, targetLanguage, sourceLanguage, context)
        )
      );
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLanguage, sourceLanguage, key);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
};

// Specialized function for translating homepage content
const translateHomepageContent = async (homepageData, targetLanguage, sourceLanguage = 'de') => {
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
        title: await translateText(
          slide.title, 
          targetLanguage, 
          sourceLanguage, 
          'Hero slide title for architecture website - should be impactful and professional'
        ),
        subtitle: await translateText(
          slide.subtitle, 
          targetLanguage, 
          sourceLanguage, 
          'Hero slide subtitle for architecture website - brief and elegant'
        ),
        description: await translateText(
          slide.description, 
          targetLanguage, 
          sourceLanguage, 
          'Hero slide description for architecture website - detailed but concise'
        ),
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
        title: await translateText(
          project.title, 
          targetLanguage, 
          sourceLanguage, 
          'Architecture project name'
        ),
        type: await translateText(
          project.type, 
          targetLanguage, 
          sourceLanguage, 
          'Architecture project type (e.g., residential, commercial, public)'
        ),
        location: await translateText(
          project.location, 
          targetLanguage, 
          sourceLanguage, 
          'Project location/address'
        ),
        // Keep other fields unchanged
        image: project.image,
        year: project.year,
        id: project.id
      }))
    );
  }
  
  return translated;
};

export default {
  translateText,
  translateObject,
  translateHomepageContent,
  getStats,
  clearCache
};