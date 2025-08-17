import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/db-simple.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all translations for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const translations = await db.all(
      'SELECT * FROM project_translations WHERE project_id = ? ORDER BY language',
      [projectId]
    );
    
    // Parse JSON fields
    translations.forEach(translation => {
      if (translation.details) {
        try {
          translation.details = JSON.parse(translation.details);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }
    });
    
    res.json(translations);
  } catch (error) {
    logger.error('Error fetching project translations:', error);
    res.status(500).json({ message: 'Error fetching translations' });
  }
});

// Get a specific translation
router.get('/project/:projectId/:language', async (req, res) => {
  try {
    const { projectId, language } = req.params;
    
    const translation = await db.get(
      'SELECT * FROM project_translations WHERE project_id = ? AND language = ?',
      [projectId, language]
    );
    
    if (translation && translation.details) {
      try {
        translation.details = JSON.parse(translation.details);
      } catch (e) {
        // Keep as string if not valid JSON
      }
    }
    
    res.json(translation || {});
  } catch (error) {
    logger.error('Error fetching project translation:', error);
    res.status(500).json({ message: 'Error fetching translation' });
  }
});

// Create or update a translation (temporarily without auth for testing)
router.post('/project/:projectId/:language', 
  // authenticate,
  // authorize(['admin', 'editor']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('location').optional(),
    body('area').optional(),
    body('details').optional()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { projectId, language } = req.params;
      const { title, description, location, area, details } = req.body;
      
      // Check if project exists
      const project = await db.get('SELECT id FROM projects WHERE id = ?', [projectId]);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Check if translation exists
      const existing = await db.get(
        'SELECT id FROM project_translations WHERE project_id = ? AND language = ?',
        [projectId, language]
      );
      
      const detailsJson = details ? JSON.stringify(details) : null;
      
      if (existing) {
        // Update existing translation
        await db.run(
          `UPDATE project_translations 
           SET title = ?, description = ?, location = ?, area = ?, details = ?, updated_at = CURRENT_TIMESTAMP
           WHERE project_id = ? AND language = ?`,
          [title, description, location, area, detailsJson, projectId, language]
        );
        
        logger.info(`Updated translation for project ${projectId} in ${language}`);
        res.json({ message: 'Translation updated successfully' });
      } else {
        // Create new translation
        await db.run(
          `INSERT INTO project_translations (project_id, language, title, description, location, area, details)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [projectId, language, title, description, location, area, detailsJson]
        );
        
        logger.info(`Created translation for project ${projectId} in ${language}`);
        res.status(201).json({ message: 'Translation created successfully' });
      }
    } catch (error) {
      logger.error('Error saving project translation:', error);
      res.status(500).json({ message: 'Error saving translation' });
    }
  }
);

// Delete a translation (requires authentication)
router.delete('/project/:projectId/:language',
  authenticate,
  authorize(['admin']),
  async (req, res) => {
    try {
      const { projectId, language } = req.params;
      
      // Don't allow deleting German (default language)
      if (language === 'de') {
        return res.status(400).json({ message: 'Cannot delete default language translation' });
      }
      
      const result = await db.run(
        'DELETE FROM project_translations WHERE project_id = ? AND language = ?',
        [projectId, language]
      );
      
      if (result.changes === 0) {
        return res.status(404).json({ message: 'Translation not found' });
      }
      
      logger.info(`Deleted translation for project ${projectId} in ${language}`);
      res.json({ message: 'Translation deleted successfully' });
    } catch (error) {
      logger.error('Error deleting project translation:', error);
      res.status(500).json({ message: 'Error deleting translation' });
    }
  }
);

// Get projects with translations for a specific language
router.get('/language/:language', async (req, res) => {
  try {
    const { language } = req.params;
    const { limit = 50, page = 1, category, status = 'published' } = req.query;
    const offset = (page - 1) * limit;
    
    // Build the query
    let query = `
      SELECT 
        p.id,
        p.year,
        p.category,
        p.status,
        p.image,
        p.gallery,
        p.featured_image,
        p.images,
        p.created_at,
        p.updated_at,
        COALESCE(pt.title, p.title) as title,
        COALESCE(pt.description, p.description) as description,
        COALESCE(pt.location, p.location) as location,
        COALESCE(pt.area, p.area) as area,
        COALESCE(pt.details, p.details) as details,
        pt.language
      FROM projects p
      LEFT JOIN project_translations pt ON p.id = pt.project_id AND pt.language = ?
      WHERE 1=1
    `;
    
    const params = [language];
    
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    
    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const projects = await db.all(query, params);
    
    // Parse JSON fields
    projects.forEach(project => {
      if (project.images) project.images = JSON.parse(project.images);
      if (project.gallery) project.gallery = JSON.parse(project.gallery);
      if (project.details) {
        try {
          project.details = JSON.parse(project.details);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }
    });
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM projects p
      WHERE 1=1
    `;
    const countParams = [];
    
    if (status) {
      countQuery += ' AND p.status = ?';
      countParams.push(status);
    }
    
    if (category) {
      countQuery += ' AND p.category = ?';
      countParams.push(category);
    }
    
    const { total } = await db.get(countQuery, countParams);
    
    res.json({
      projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching projects with translations:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Bulk translate using AI (temporarily without auth for testing)
router.post('/bulk-translate/:projectId',
  // authenticate,
  // authorize(['admin']),
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const { targetLanguages = ['en', 'fr', 'it', 'es'] } = req.body;
      
      // Get the original project data
      const project = await db.get(
        'SELECT title, description, location, area, details FROM projects WHERE id = ?',
        [projectId]
      );
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Get existing German translation or use base project data
      const germanTranslation = await db.get(
        'SELECT title, description, location, area, details FROM project_translations WHERE project_id = ? AND language = ?',
        [projectId, 'de']
      );
      
      const sourceData = germanTranslation || project;
      
      // Use DeepSeek API for real translations
      const translations = [];
      
      // Import fetch for API calls
      const fetch = (await import('node-fetch')).default;
      const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-374a85178de1439d8b7438c2ac56be77';
      
      for (const lang of targetLanguages) {
        if (lang === 'de') continue; // Skip German
        
        // Check if translation already exists
        const existing = await db.get(
          'SELECT id FROM project_translations WHERE project_id = ? AND language = ?',
          [projectId, lang]
        );
        
        if (!existing) {
          let translatedTitle = sourceData.title;
          let translatedDescription = sourceData.description;
          
          // Map language codes to full names for better translation
          const langMap = {
            'en': 'English',
            'fr': 'French',
            'it': 'Italian',
            'es': 'Spanish'
          };
          
          try {
            // Translate title
            if (sourceData.title) {
              const titleResponse = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'deepseek-chat',
                  messages: [
                    {
                      role: 'system',
                      content: `You are a professional translator for an architecture firm. Translate the following German text to ${langMap[lang]}. Only return the translation, nothing else.`
                    },
                    {
                      role: 'user',
                      content: sourceData.title
                    }
                  ],
                  max_tokens: 100,
                  temperature: 0.3
                })
              });
              
              const titleData = await titleResponse.json();
              if (titleData.choices && titleData.choices[0]) {
                translatedTitle = titleData.choices[0].message.content.trim();
              }
            }
            
            // Translate description
            if (sourceData.description) {
              const descResponse = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'deepseek-chat',
                  messages: [
                    {
                      role: 'system',
                      content: `You are a professional translator for an architecture firm. Translate the following German text to ${langMap[lang]}. Only return the translation, nothing else.`
                    },
                    {
                      role: 'user',
                      content: sourceData.description
                    }
                  ],
                  max_tokens: 500,
                  temperature: 0.3
                })
              });
              
              const descData = await descResponse.json();
              if (descData.choices && descData.choices[0]) {
                translatedDescription = descData.choices[0].message.content.trim();
              }
            }
          } catch (error) {
            logger.error(`Error translating to ${lang}:`, error);
            // Fall back to placeholder if translation fails
            translatedTitle = `[${lang.toUpperCase()}] ${sourceData.title}`;
            translatedDescription = sourceData.description ? `[${lang.toUpperCase()}] ${sourceData.description}` : null;
          }
          
          // Insert translation
          await db.run(
            `INSERT INTO project_translations (project_id, language, title, description, location, area, details)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              projectId,
              lang,
              translatedTitle,
              translatedDescription,
              sourceData.location, // Keep location as is (city names usually don't translate)
              sourceData.area,
              sourceData.details
            ]
          );
          
          translations.push(lang);
        }
      }
      
      logger.info(`Created DeepSeek translations for project ${projectId}: ${translations.join(', ')}`);
      res.json({ 
        message: 'Translations created successfully using DeepSeek AI',
        languages: translations,
        note: 'These translations were generated by DeepSeek AI. Please review and adjust as needed.'
      });
    } catch (error) {
      logger.error('Error creating bulk translations:', error);
      res.status(500).json({ message: 'Error creating translations' });
    }
  }
);

export default router;