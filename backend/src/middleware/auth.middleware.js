import jwt from 'jsonwebtoken';
import db from '../config/db-simple.js';
import logger from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

/**
 * Role check. Accepts every call shape used in the routes:
 *   authorize('admin'), authorize(['admin', 'editor']), authorize('admin', 'editor')
 * All arguments are flattened into one list of allowed roles. (Before, only the
 * first argument was read, so authorize('admin', 'editor') silently meant
 * admin-only.)
 */
export const authorize = (...roles) => {
  const requiredRoles = roles.flat(Infinity).filter(Boolean);

  return (req, res, next) => {
    if (!req.user) {
      logger.error('Authorization failed: No user in request');
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    logger.debug(`Authorization check: User role="${req.user.role}", Required roles=[${requiredRoles.join(',')}]`);
    
    if (!requiredRoles.includes(req.user.role)) {
      logger.error(`Authorization failed: User role '${req.user.role}' not in required roles [${requiredRoles.join(',')}]`);
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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