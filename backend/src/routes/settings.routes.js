import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/db-simple.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all settings
router.get('/', authenticate, async (req, res) => {
  try {
    const settings = await db.all('SELECT * FROM settings ORDER BY key ASC');
    
    // Transform to key-value object
    const settingsMap = {};
    settings.forEach(setting => {
      settingsMap[setting.key] = {
        value: setting.value,
        type: setting.type,
        updatedAt: setting.updated_at
      };
    });
    
    res.json({
      settings: settingsMap,
      items: settings
    });
  } catch (error) {
    logger.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get single setting
router.get('/:key', authenticate, async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await db.get('SELECT * FROM settings WHERE key = ?', [key]);
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json(setting);
  } catch (error) {
    logger.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// Update setting
router.put('/:key',
  authenticate,
  authorize('admin'),
  [
    body('value').notEmpty(),
    body('type').optional().isIn(['string', 'number', 'boolean', 'json'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { key } = req.params;
      const { value, type = 'string' } = req.body;
      
      // Check if setting exists
      const existing = await db.get('SELECT id FROM settings WHERE key = ?', [key]);
      
      if (existing) {
        // Update existing setting
        await db.run(
          'UPDATE settings SET value = ?, type = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
          [value, type, req.user.id, key]
        );
      } else {
        // Create new setting
        await db.run(
          'INSERT INTO settings (key, value, type, updated_by) VALUES (?, ?, ?, ?)',
          [key, value, type, req.user.id]
        );
      }
      
      const setting = await db.get('SELECT * FROM settings WHERE key = ?', [key]);
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, details) VALUES (?, ?, ?, ?)',
        [req.user.id, existing ? 'update' : 'create', 'setting', JSON.stringify({ key, value })]
      );
      
      logger.info(`Setting ${existing ? 'updated' : 'created'}: ${key} by ${req.user.email}`);
      
      res.json(setting);
    } catch (error) {
      logger.error('Update setting error:', error);
      res.status(500).json({ error: 'Failed to update setting' });
    }
  }
);

// Delete setting
router.delete('/:key',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { key } = req.params;
      
      const setting = await db.get('SELECT value FROM settings WHERE key = ?', [key]);
      
      if (!setting) {
        return res.status(404).json({ error: 'Setting not found' });
      }
      
      await db.run('DELETE FROM settings WHERE key = ?', [key]);
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'delete', 'setting', JSON.stringify({ key, value: setting.value })]
      );
      
      logger.info(`Setting deleted: ${key} by ${req.user.email}`);
      
      res.json({ message: 'Setting deleted successfully' });
    } catch (error) {
      logger.error('Delete setting error:', error);
      res.status(500).json({ error: 'Failed to delete setting' });
    }
  }
);

// Get audit logs
router.get('/audit/logs',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { limit = 100, page = 1, user_id, action, resource_type } = req.query;
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT a.*, u.email, u.name 
        FROM audit_log a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE 1=1
      `;
      const params = [];
      
      if (user_id) {
        query += ' AND a.user_id = ?';
        params.push(user_id);
      }
      
      if (action) {
        query += ' AND a.action = ?';
        params.push(action);
      }
      
      if (resource_type) {
        query += ' AND a.resource_type = ?';
        params.push(resource_type);
      }
      
      query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);
      
      const logs = await db.all(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM audit_log WHERE 1=1';
      const countParams = [];
      
      if (user_id) {
        countQuery += ' AND user_id = ?';
        countParams.push(user_id);
      }
      
      if (action) {
        countQuery += ' AND action = ?';
        countParams.push(action);
      }
      
      if (resource_type) {
        countQuery += ' AND resource_type = ?';
        countParams.push(resource_type);
      }
      
      const { total } = await db.get(countQuery, countParams);
      
      res.json({
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get audit logs error:', error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  }
);

export default router;