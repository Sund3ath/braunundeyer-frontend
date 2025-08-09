import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/db-simple.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { status, category, featured, limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (featured === 'true') {
      query += ' AND featured_image IS NOT NULL';
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const projects = await db.all(query, params);
    
    // Parse JSON fields
    projects.forEach(project => {
      if (project.images) project.images = JSON.parse(project.images);
      if (project.gallery) project.gallery = JSON.parse(project.gallery);
      if (project.details) project.details = JSON.parse(project.details);
    });
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM projects WHERE 1=1';
    const countParams = [];
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    const { total } = await db.get(countQuery, countParams);
    
    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Parse JSON fields
    if (project.images) project.images = JSON.parse(project.images);
    if (project.gallery) project.gallery = JSON.parse(project.gallery);
    if (project.details) project.details = JSON.parse(project.details);
    
    res.json(project);
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
router.post('/',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').notEmpty().trim(),
    body('description').optional().trim(),
    body('location').optional().trim(),
    body('area').optional().trim(),
    body('year').optional().isInt({ min: 1900, max: 2100 }),
    body('category').optional().trim(),
    body('status').optional().isIn(['draft', 'published', 'archived'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { 
        title, description, location, area, year, category, 
        status = 'draft', image, gallery, featured_image, images, details 
      } = req.body;
      
      const result = await db.run(
        `INSERT INTO projects (
          title, description, location, area, year, category, 
          status, image, gallery, featured_image, images, details, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, description, location, area, year, category,
          status, 
          image || null,
          gallery ? JSON.stringify(gallery) : null,
          featured_image || null,
          images ? JSON.stringify(images) : null,
          details ? JSON.stringify(details) : null,
          req.user.id
        ]
      );
      
      const project = await db.get('SELECT * FROM projects WHERE id = ?', [result.lastInsertRowid]);
      
      // Parse JSON fields
      if (project.images) project.images = JSON.parse(project.images);
      if (project.details) project.details = JSON.parse(project.details);
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'create', 'project', project.id, JSON.stringify({ title })]
      );
      
      logger.info(`Project created: ${title} by ${req.user.email}`);
      
      res.status(201).json(project);
    } catch (error) {
      logger.error('Create project error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }
);

// Update project
router.put('/:id',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('location').optional().trim(),
    body('area').optional().trim(),
    body('year').optional().isInt({ min: 1900, max: 2100 }),
    body('category').optional().trim(),
    body('status').optional().isIn(['draft', 'published', 'archived'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updates = req.body;
      
      // Check if project exists
      const existing = await db.get('SELECT id FROM projects WHERE id = ?', [id]);
      if (!existing) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Build update query
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (key === 'images' || key === 'details' || key === 'gallery') {
          fields.push(`${key} = ?`);
          // Ensure proper JSON stringification for arrays and objects
          if (value === null || value === undefined) {
            values.push(null);
          } else if (typeof value === 'string') {
            // If it's already a string, check if it's valid JSON
            try {
              JSON.parse(value);
              values.push(value);
            } catch {
              // If not valid JSON, stringify it
              values.push(JSON.stringify(value));
            }
          } else {
            values.push(JSON.stringify(value));
          }
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
      }
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      await db.run(
        `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
      
      // Parse JSON fields
      if (project.images) project.images = JSON.parse(project.images);
      if (project.details) project.details = JSON.parse(project.details);
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'update', 'project', id, JSON.stringify(updates)]
      );
      
      logger.info(`Project updated: ${id} by ${req.user.email}`);
      
      res.json(project);
    } catch (error) {
      logger.error('Update project error:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  }
);

// Delete project
router.delete('/:id',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const project = await db.get('SELECT title FROM projects WHERE id = ?', [id]);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      await db.run('DELETE FROM projects WHERE id = ?', [id]);
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'delete', 'project', id, JSON.stringify({ title: project.title })]
      );
      
      logger.info(`Project deleted: ${id} by ${req.user.email}`);
      
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      logger.error('Delete project error:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
);

// Publish project
router.post('/:id/publish',
  authenticate,
  authorize('admin', 'editor'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.run(
        'UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['published', id]
      );
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id) VALUES (?, ?, ?, ?)',
        [req.user.id, 'publish', 'project', id]
      );
      
      logger.info(`Project published: ${id} by ${req.user.email}`);
      
      res.json({ message: 'Project published successfully' });
    } catch (error) {
      logger.error('Publish project error:', error);
      res.status(500).json({ error: 'Failed to publish project' });
    }
  }
);

// Unpublish project
router.post('/:id/unpublish',
  authenticate,
  authorize('admin', 'editor'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.run(
        'UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['draft', id]
      );
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id) VALUES (?, ?, ?, ?)',
        [req.user.id, 'unpublish', 'project', id]
      );
      
      logger.info(`Project unpublished: ${id} by ${req.user.email}`);
      
      res.json({ message: 'Project unpublished successfully' });
    } catch (error) {
      logger.error('Unpublish project error:', error);
      res.status(500).json({ error: 'Failed to unpublish project' });
    }
  }
);

export default router;