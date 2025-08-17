import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware
import errorHandler from './middleware/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/projects.routes.js';
import contentRoutes from './routes/content.routes.js';
import mediaRoutes from './routes/media.routes.v2.js';
import settingsRoutes from './routes/settings.routes.js';
import translateRoutes from './routes/translate.routes.js';
import testRoutes from './routes/test.routes.js';
import aiOptimizeRoutes from './routes/ai-optimize.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import projectTranslationsRoutes from './routes/project-translations.routes.js';

// Import database
import db from './config/db-simple.js';

// Import configurations
import corsOptions from './config/cors.config.js';

// Import utils
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Apply CORS middleware with imported configuration
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable for development, configure properly for production
}));
app.use(compression());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Special rate limiter for translation endpoints (more lenient)
const translationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Allow more requests for translations
  message: 'Too many translation requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Special rate limiter for analytics endpoints (very lenient)
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Allow many requests for analytics
  message: 'Too many analytics requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/translate', translationLimiter); // Apply translation limiter
app.use('/api/analytics', analyticsLimiter); // Apply analytics limiter
app.use('/api/', limiter); // Then apply general limiter to other routes

// Serve uploaded files with caching headers for better performance
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: '1d', // Cache images for 1 day
  etag: true,
  lastModified: true,
  setHeaders: (res, filepath) => {
    // Set caching headers based on file type
    if (filepath.endsWith('.jpg') || filepath.endsWith('.jpeg') || filepath.endsWith('.png') || filepath.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable'); // 1 day
    } else if (filepath.endsWith('.mp4') || filepath.endsWith('.webm')) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable'); // 7 days
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-translations', projectTranslationsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/ai', aiOptimizeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/test', testRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await db.initialize();
    logger.info('Database initialized successfully');
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`CORS enabled for: ${process.env.ALLOWED_ORIGINS || 'http://localhost:4028'}`);
      logger.info(`API available at: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await db.close();
  process.exit(0);
});

// Start the server
startServer();

export default app;