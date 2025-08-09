import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import db from '../config/db-simple.js';
import { authenticate } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      
      // Get user
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate tokens
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      
      // Store refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      await db.run(
        'INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expiresAt.toISOString()]
      );
      
      // Log audit
      await db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, 'login', 'auth', JSON.stringify({ email }), req.ip, req.get('user-agent')]
      );
      
      logger.info(`User logged in: ${email}`);
      
      res.json({
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Register
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;
      
      // Check if user exists
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const result = await db.run(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, 'user']
      );
      
      const user = {
        id: result.lastInsertRowid,
        email,
        name,
        role: 'user'
      };
      
      // Generate tokens
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      
      // Store refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      await db.run(
        'INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expiresAt.toISOString()]
      );
      
      logger.info(`New user registered: ${email}`);
      
      res.status(201).json({
        token,
        refreshToken,
        user
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    
    // Check if session exists and is valid
    const session = await db.get(
      'SELECT * FROM sessions WHERE refresh_token = ? AND expires_at > datetime("now")',
      [refreshToken]
    );
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Get user
    const user = await db.get('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.id]);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Generate new access token
    const token = generateToken(user);
    
    res.json({ token, user });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Remove refresh token
    await db.run('DELETE FROM sessions WHERE user_id = ?', [req.user.id]);
    
    // Log audit
    await db.run(
      'INSERT INTO audit_log (user_id, action, resource_type, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'logout', 'auth', req.ip, req.get('user-agent')]
    );
    
    logger.info(`User logged out: ${req.user.email}`);
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get profile
router.get('/profile', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
});

// Update profile
router.put('/profile',
  authenticate,
  [
    body('name').optional().trim(),
    body('password').optional().isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, password } = req.body;
      const updates = [];
      const params = [];
      
      if (name) {
        updates.push('name = ?');
        params.push(name);
      }
      
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push('password = ?');
        params.push(hashedPassword);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
      }
      
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(req.user.id);
      
      await db.run(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
      
      // Get updated user
      const user = await db.get('SELECT id, email, name, role FROM users WHERE id = ?', [req.user.id]);
      
      logger.info(`Profile updated: ${user.email}`);
      
      res.json({ user });
    } catch (error) {
      logger.error('Profile update error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

export default router;