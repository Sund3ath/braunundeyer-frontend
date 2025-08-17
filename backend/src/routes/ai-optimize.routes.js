import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import aiOptimizeService from '../services/ai-optimize.service.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Optimize text endpoint
router.post('/optimize',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('text').notEmpty().withMessage('Text is required'),
    body('type').optional().isIn(['extend', 'optimize', 'shorten']).withMessage('Invalid type'),
    body('language').optional().isIn(['de', 'en', 'fr', 'it', 'es']).withMessage('Invalid language'),
    body('context').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { text, type = 'optimize', language = 'de', context = '' } = req.body;
      
      // Call the optimization service
      const optimizedText = await aiOptimizeService.optimizeText(text, type, language, context);
      
      logger.info(`Text optimized (${type}) by ${req.user.email}`);
      
      res.json({
        originalText: text,
        optimizedText,
        type,
        language,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error('Text optimization error:', error);
      res.status(500).json({ 
        error: 'Failed to optimize text',
        message: error.message 
      });
    }
  }
);

// Optimize project content endpoint
router.post('/optimize-project',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('details').optional().isString(),
    body('language').optional().isIn(['de', 'en', 'fr', 'it', 'es']).withMessage('Invalid language')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, details, language = 'de' } = req.body;
      
      // Prepare project data
      const projectData = {};
      if (title) projectData.title = title;
      if (description) projectData.description = description;
      if (details) projectData.details = details;
      
      // Call the optimization service
      const optimizedContent = await aiOptimizeService.optimizeProjectContent(projectData, language);
      
      logger.info(`Project content optimized by ${req.user.email}`);
      
      res.json({
        original: projectData,
        optimized: optimizedContent,
        language,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error('Project content optimization error:', error);
      res.status(500).json({ 
        error: 'Failed to optimize project content',
        message: error.message 
      });
    }
  }
);

// Get AI service status
router.get('/status',
  authenticate,
  async (req, res) => {
    try {
      const hasApiKey = !!(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'your-api-key-here');
      
      res.json({
        available: true,
        provider: hasApiKey ? 'DeepSeek' : 'Mock',
        features: ['extend', 'optimize', 'shorten'],
        languages: ['de', 'en', 'fr', 'it', 'es'],
        apiConfigured: hasApiKey
      });
      
    } catch (error) {
      logger.error('AI service status error:', error);
      res.status(500).json({ 
        error: 'Failed to get AI service status' 
      });
    }
  }
);

export default router;