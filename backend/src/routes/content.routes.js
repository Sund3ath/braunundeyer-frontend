import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/db-simple.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all content
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { language = 'de', key } = req.query;
    
    let query = 'SELECT * FROM content WHERE 1=1';
    const params = [];
    
    if (language) {
      query += ' AND language = ?';
      params.push(language);
    }
    
    if (key) {
      query += ' AND key LIKE ?';
      params.push(`%${key}%`);
    }
    
    query += ' ORDER BY key ASC';
    
    const contents = await db.all(query, params);
    
    // Transform to key-value object for easier use
    const contentMap = {};
    contents.forEach(item => {
      if (!contentMap[item.language]) {
        contentMap[item.language] = {};
      }
      contentMap[item.language][item.key] = item.value;
    });
    
    res.json({
      content: contentMap,
      items: contents
    });
  } catch (error) {
    logger.error('Get content error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get content by key
router.get('/:key', optionalAuth, async (req, res) => {
  try {
    const { key } = req.params;
    const { language = 'de' } = req.query;
    
    const content = await db.get(
      'SELECT * FROM content WHERE key = ? AND language = ?',
      [key, language]
    );
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    logger.error('Get content by key error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update content
router.put('/:key',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('value').notEmpty(),
    body('language').optional().isIn(['de', 'en', 'fr', 'it', 'es'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { key } = req.params;
      const { value, language = 'de' } = req.body;
      
      // Use UPSERT pattern with INSERT OR REPLACE
      // This handles both insert and update cases without a separate check
      await db.run(
        `INSERT INTO content (key, value, language, updated_by, created_at, updated_at) 
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT(key, language) 
         DO UPDATE SET 
           value = excluded.value,
           updated_by = excluded.updated_by,
           updated_at = CURRENT_TIMESTAMP`,
        [key, value, language, req.user.id]
      );
      
      const content = await db.get(
        'SELECT * FROM content WHERE key = ? AND language = ?',
        [key, language]
      );
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'update', 'content', JSON.stringify({ key, language })]
      );
      
      logger.info(`Content updated: ${key} (${language}) by ${req.user.email}`);
      
      res.json(content);
    } catch (error) {
      logger.error('Update content error:', error);
      res.status(500).json({ error: 'Failed to update content' });
    }
  }
);

// Bulk update content
router.put('/bulk',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('updates').isArray(),
    body('updates.*.key').notEmpty(),
    body('updates.*.value').notEmpty(),
    body('updates.*.language').optional().isIn(['de', 'en', 'fr', 'it', 'es'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { updates } = req.body;
      const results = [];
      
      for (const update of updates) {
        const { key, value, language = 'de' } = update;
        
        // Use UPSERT pattern for bulk updates as well
        await db.run(
          `INSERT INTO content (key, value, language, updated_by, created_at, updated_at) 
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           ON CONFLICT(key, language) 
           DO UPDATE SET 
             value = excluded.value,
             updated_by = excluded.updated_by,
             updated_at = CURRENT_TIMESTAMP`,
          [key, value, language, req.user.id]
        );
        
        results.push({ key, language, success: true });
      }
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'bulk_update', 'content', JSON.stringify({ count: updates.length })]
      );
      
      logger.info(`Bulk content update: ${updates.length} items by ${req.user.email}`);
      
      res.json({ results });
    } catch (error) {
      logger.error('Bulk update content error:', error);
      res.status(500).json({ error: 'Failed to bulk update content' });
    }
  }
);

// Delete content
router.delete('/:key',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { key } = req.params;
      const { language } = req.query;
      
      if (language) {
        await db.run(
          'DELETE FROM content WHERE key = ? AND language = ?',
          [key, language]
        );
      } else {
        // Delete all languages for this key
        await db.run('DELETE FROM content WHERE key = ?', [key]);
      }
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'delete', 'content', JSON.stringify({ key, language })]
      );
      
      logger.info(`Content deleted: ${key} (${language || 'all languages'}) by ${req.user.email}`);
      
      res.json({ message: 'Content deleted successfully' });
    } catch (error) {
      logger.error('Delete content error:', error);
      res.status(500).json({ error: 'Failed to delete content' });
    }
  }
);

// Translate content
router.post('/translate',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('text').notEmpty(),
    body('targetLanguage').isIn(['de', 'en', 'fr', 'it', 'es']),
    body('sourceLanguage').optional().isIn(['de', 'en', 'fr', 'it', 'es'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { text, targetLanguage, sourceLanguage = 'de' } = req.body;
      
      // For now, return a mock translation
      // In production, this would call DeepSeek API or another translation service
      const translatedText = `[Translated to ${targetLanguage}] ${text}`;
      
      res.json({
        originalText: text,
        translatedText,
        sourceLanguage,
        targetLanguage
      });
    } catch (error) {
      logger.error('Translation error:', error);
      res.status(500).json({ error: 'Translation failed' });
    }
  }
);

export default router;