import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/db-simple.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createFileFilter, generateFilename } from '../utils/upload-policy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Team photos live in backend/uploads/team (the persistent uploads volume in
// Docker; served at /uploads/team/...). Older photos may still sit in
// public/uploads/team, which server.js serves as a fallback for /uploads.
const TEAM_UPLOAD_DIR = path.join(__dirname, '../..', 'uploads', 'team');
const LEGACY_TEAM_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'team');

// Delete a stored team photo. Only the file name from the DB value is used,
// so a manipulated path can never point outside the team upload folders.
const deleteTeamImage = async (imageUrl) => {
  if (!imageUrl || !String(imageUrl).startsWith('/uploads/team/')) return;
  const name = path.basename(String(imageUrl));
  for (const dir of [TEAM_UPLOAD_DIR, LEGACY_TEAM_UPLOAD_DIR]) {
    try {
      await fs.unlink(path.join(dir, name));
      return;
    } catch (err) {
      if (err.code !== 'ENOENT') {
        logger.warn('Could not delete team member image:', err);
      }
    }
  }
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(TEAM_UPLOAD_DIR, { recursive: true })
      .then(() => cb(null, TEAM_UPLOAD_DIR))
      .catch((err) => cb(err));
  },
  filename: (req, file, cb) => {
    cb(null, generateFilename('team', file));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  // Images only: jpg, jpeg, png, webp, gif, avif (extension AND MIME type)
  fileFilter: createFileFilter({ allowVideo: false })
});

// Get all team members (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { active_only = 'true', lang = 'de' } = req.query;
    
    let query = 'SELECT * FROM team_members';
    const params = [];
    
    if (active_only === 'true') {
      query += ' WHERE is_active = 1';
    }
    
    query += ' ORDER BY order_index ASC, id ASC';
    
    const members = await db.all(query, params);
    
    // Format members with language-specific fields
    const formattedMembers = members.map(member => {
      const formatted = {
        id: member.id,
        name: member.name,
        position: member[`position_${lang}`] || member.position,
        bio: member[`bio_${lang}`] || member.bio,
        image: member.image,
        email: member.email,
        phone: member.phone,
        linkedin: member.linkedin,
        order_index: member.order_index,
        is_active: member.is_active
      };
      
      // Include all translations for admin panel
      if (req.query.include_translations === 'true') {
        formatted.translations = {
          position: {
            de: member.position,
            en: member.position_en,
            fr: member.position_fr,
            it: member.position_it,
            es: member.position_es
          },
          bio: {
            de: member.bio,
            en: member.bio_en,
            fr: member.bio_fr,
            it: member.bio_it,
            es: member.bio_es
          }
        };
      }
      
      return formatted;
    });
    
    res.json(formattedMembers);
  } catch (error) {
    logger.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get single team member (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { lang = 'de' } = req.query;
    
    const member = await db.get('SELECT * FROM team_members WHERE id = ?', [id]);
    
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    // Format with language-specific fields
    const formatted = {
      id: member.id,
      name: member.name,
      position: member[`position_${lang}`] || member.position,
      bio: member[`bio_${lang}`] || member.bio,
      image: member.image,
      email: member.email,
      phone: member.phone,
      linkedin: member.linkedin,
      order_index: member.order_index,
      is_active: member.is_active,
      translations: {
        position: {
          de: member.position,
          en: member.position_en,
          fr: member.position_fr,
          it: member.position_it,
          es: member.position_es
        },
        bio: {
          de: member.bio,
          en: member.bio_en,
          fr: member.bio_fr,
          it: member.bio_it,
          es: member.bio_es
        }
      }
    };
    
    res.json(formatted);
  } catch (error) {
    logger.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// Update team member order (must be before /:id route)
router.put('/reorder',
  authenticate,
  authorize(['admin', 'editor']),
  async (req, res) => {
    try {
      const { memberIds } = req.body;
      
      if (!Array.isArray(memberIds)) {
        return res.status(400).json({ error: 'memberIds must be an array' });
      }
      
      // Update order for each member
      for (let i = 0; i < memberIds.length; i++) {
        await db.run(
          'UPDATE team_members SET order_index = ? WHERE id = ?',
          [i + 1, memberIds[i]]
        );
      }
      
      logger.info(`Team members reordered by ${req.user?.email || 'anonymous'}`);
      res.json({ message: 'Team members reordered successfully' });
    } catch (error) {
      logger.error('Error reordering team members:', error);
      res.status(500).json({ error: 'Failed to reorder team members' });
    }
  }
);

// Create new team member
router.post('/',
  authenticate,
  authorize(['admin', 'editor']),
  upload.single('image'),
  [
    body('name').notEmpty().trim(),
    body('position').notEmpty().trim(),
    body('bio').optional().trim(),
    body('email').optional().isEmail(),
    body('phone').optional().trim(),
    body('linkedin').optional().trim(),
    body('order_index').optional().isInt()
  ],
  async (req, res) => {
    try {
      logger.info('Creating team member, user:', req.user);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { 
        name, position, position_en, position_fr, position_it, position_es,
        bio, bio_en, bio_fr, bio_it, bio_es,
        email, phone, linkedin, order_index = 0
      } = req.body;
      
      const image = req.file ? `/uploads/team/${req.file.filename}` : null;
      
      const result = await db.run(
        `INSERT INTO team_members (
          name, position, position_en, position_fr, position_it, position_es,
          bio, bio_en, bio_fr, bio_it, bio_es,
          image, email, phone, linkedin, order_index
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, position, position_en, position_fr, position_it, position_es,
          bio, bio_en, bio_fr, bio_it, bio_es,
          image, email, phone, linkedin, order_index
        ]
      );
      
      const member = await db.get('SELECT * FROM team_members WHERE id = ?', [result.lastInsertRowid]);
      
      logger.info(`Team member created: ${name} by ${req.user?.email || 'anonymous'}`);
      res.status(201).json(member);
    } catch (error) {
      logger.error('Error creating team member:', error);
      res.status(500).json({ error: 'Failed to create team member' });
    }
  }
);

// Update team member
router.put('/:id',
  authenticate,
  authorize(['admin', 'editor']),
  upload.single('image'),
  [
    body('name').optional().trim(),
    body('position').optional().trim(),
    body('bio').optional().trim(),
    body('email').optional().isEmail(),
    body('phone').optional().trim(),
    body('linkedin').optional().trim(),
    body('order_index').optional().isInt()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { id } = req.params;
      const member = await db.get('SELECT * FROM team_members WHERE id = ?', [id]);
      
      if (!member) {
        return res.status(404).json({ error: 'Team member not found' });
      }
      
      const { 
        name, position, position_en, position_fr, position_it, position_es,
        bio, bio_en, bio_fr, bio_it, bio_es,
        email, phone, linkedin, order_index, is_active
      } = req.body;
      
      let image = member.image;
      if (req.file) {
        image = `/uploads/team/${req.file.filename}`;
        
        // Delete old image if exists
        await deleteTeamImage(member.image);
      }
      
      await db.run(
        `UPDATE team_members SET 
          name = ?, position = ?, position_en = ?, position_fr = ?, position_it = ?, position_es = ?,
          bio = ?, bio_en = ?, bio_fr = ?, bio_it = ?, bio_es = ?,
          image = ?, email = ?, phone = ?, linkedin = ?, order_index = ?, is_active = ?,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          name || member.name,
          position || member.position,
          position_en !== undefined ? position_en : member.position_en,
          position_fr !== undefined ? position_fr : member.position_fr,
          position_it !== undefined ? position_it : member.position_it,
          position_es !== undefined ? position_es : member.position_es,
          bio !== undefined ? bio : member.bio,
          bio_en !== undefined ? bio_en : member.bio_en,
          bio_fr !== undefined ? bio_fr : member.bio_fr,
          bio_it !== undefined ? bio_it : member.bio_it,
          bio_es !== undefined ? bio_es : member.bio_es,
          image,
          email !== undefined ? email : member.email,
          phone !== undefined ? phone : member.phone,
          linkedin !== undefined ? linkedin : member.linkedin,
          order_index !== undefined ? order_index : member.order_index,
          is_active !== undefined ? is_active : member.is_active,
          id
        ]
      );
      
      const updatedMember = await db.get('SELECT * FROM team_members WHERE id = ?', [id]);
      
      logger.info(`Team member updated: ${updatedMember.name} by ${req.user?.email || 'anonymous'}`);
      res.json(updatedMember);
    } catch (error) {
      logger.error('Error updating team member:', error);
      res.status(500).json({ error: 'Failed to update team member' });
    }
  }
);

// Delete team member
router.delete('/:id',
  authenticate,
  authorize(['admin']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const member = await db.get('SELECT * FROM team_members WHERE id = ?', [id]);
      
      if (!member) {
        return res.status(404).json({ error: 'Team member not found' });
      }
      
      // Delete image if exists
      await deleteTeamImage(member.image);
      
      await db.run('DELETE FROM team_members WHERE id = ?', [id]);
      
      logger.info(`Team member deleted: ${member.name} by ${req.user?.email || 'anonymous'}`);
      res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
      logger.error('Error deleting team member:', error);
      res.status(500).json({ error: 'Failed to delete team member' });
    }
  }
);

export default router;