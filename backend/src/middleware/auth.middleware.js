import jwt from 'jsonwebtoken';
import db from '../config/db-simple.js';
import logger from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Development mode: Accept mock token for testing
    if (process.env.NODE_ENV === 'development' && token === 'mock_token_123') {
      // Create a mock user for development
      req.user = {
        id: 1,
        email: 'admin@braunundeyer.de',
        name: 'Admin User',
        role: 'admin'
      };
      req.token = token;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    const user = await db.get('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.id]);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Development mode: Accept mock token
      if (process.env.NODE_ENV === 'development' && token === 'mock_token_123') {
        req.user = {
          id: 1,
          email: 'admin@braunundeyer.de',
          name: 'Admin User',
          role: 'admin'
        };
        req.token = token;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
      const user = await db.get('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.id]);
      
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};