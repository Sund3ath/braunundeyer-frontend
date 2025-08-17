import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import translationService from '../services/translation.service.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Translate single text
router.post('/', authenticate, async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'de', context = '' } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Missing required fields: text and targetLanguage' 
      });
    }
    
    const translatedText = await translationService.translateText(
      text, 
      targetLanguage, 
      sourceLanguage,
      context
    );
    
    res.json({ 
      translatedText,
      sourceLanguage,
      targetLanguage,
      cached: false
    });
    
  } catch (error) {
    logger.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Translation failed',
      message: error.message 
    });
  }
});

// Bulk translate
router.post('/bulk', authenticate, async (req, res) => {
  try {
    const { texts, targetLanguages, sourceLanguage = 'de' } = req.body;
    
    if (!texts || !targetLanguages || !Array.isArray(texts) || !Array.isArray(targetLanguages)) {
      return res.status(400).json({ 
        error: 'Missing or invalid fields: texts and targetLanguages must be arrays' 
      });
    }
    
    const translations = {};
    
    for (const targetLang of targetLanguages) {
      translations[targetLang] = {};
      
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        translations[targetLang][i] = await translationService.translateText(
          text,
          targetLang,
          sourceLanguage
        );
      }
    }
    
    res.json({ translations });
    
  } catch (error) {
    logger.error('Bulk translation error:', error);
    res.status(500).json({ 
      error: 'Bulk translation failed',
      message: error.message 
    });
  }
});

// Translate object with context
router.post('/object', authenticate, async (req, res) => {
  try {
    const { object, targetLanguage, sourceLanguage = 'de', context = '' } = req.body;
    
    if (!object || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Missing required fields: object and targetLanguage' 
      });
    }
    
    const translatedObject = await translationService.translateObject(
      object,
      targetLanguage,
      sourceLanguage,
      context
    );
    
    res.json({ 
      translatedObject,
      sourceLanguage,
      targetLanguage
    });
    
  } catch (error) {
    logger.error('Object translation error:', error);
    res.status(500).json({ 
      error: 'Object translation failed',
      message: error.message 
    });
  }
});

// Translate homepage content
router.post('/homepage', authenticate, async (req, res) => {
  try {
    const { homepageData, targetLanguage, sourceLanguage = 'de' } = req.body;
    
    if (!homepageData || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Missing required fields: homepageData and targetLanguage' 
      });
    }
    
    const translatedHomepage = await translationService.translateHomepageContent(
      homepageData,
      targetLanguage,
      sourceLanguage
    );
    
    res.json({ 
      translatedHomepage,
      sourceLanguage,
      targetLanguage
    });
    
  } catch (error) {
    logger.error('Homepage translation error:', error);
    res.status(500).json({ 
      error: 'Homepage translation failed',
      message: error.message 
    });
  }
});

// Get translation stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await translationService.getStats();
    res.json(stats);
  } catch (error) {
    logger.error('Failed to get translation stats:', error);
    res.status(500).json({ 
      error: 'Failed to get stats',
      message: error.message 
    });
  }
});

// Clear translation cache
router.delete('/cache', authenticate, async (req, res) => {
  try {
    await translationService.clearCache();
    res.json({ message: 'Translation cache cleared successfully' });
  } catch (error) {
    logger.error('Failed to clear translation cache:', error);
    res.status(500).json({ 
      error: 'Failed to clear cache',
      message: error.message 
    });
  }
});

export default router;