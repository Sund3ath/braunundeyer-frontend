import logger from '../utils/logger.js';

/**
 * CORS Configuration
 * Handles Cross-Origin Resource Sharing settings for the application
 */

// Parse allowed origins from environment variable
const parseAllowedOrigins = () => {
  const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:4029';
  return origins.split(',').map(origin => origin.trim());
};

// Development origins (always allowed in dev mode)
const devOrigins = [
  'http://localhost:3000',  // Next.js default
  'http://localhost:3001',  // Backend
  'http://localhost:4028',  // Old Vite port
  'http://localhost:4029',  // Admin panel
  'http://localhost:5173',  // Vite default
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4029',
];

// Production origins (add your production domains here)
const prodOrigins = [
  'https://braunundeyer.de',
  'https://www.braunundeyer.de',
  'https://admin.braunundeyer.de',
  'https://cms.braunundeyer.de',
  'https://api.braunundeyer.de',
  'http://braunundeyer.de',
  'http://www.braunundeyer.de',
  'http://cms.braunundeyer.de',
  'http://api.braunundeyer.de',
  // Demo domain for main site
  'https://demo.braunundeyer.de',
  'http://demo.braunundeyer.de',
  // Add more production origins as needed
];

export const corsOptions = {
  origin: function (origin, callback) {
    // In development, be more permissive
    if (process.env.NODE_ENV === 'development') {
      // Allow all dev origins and the ones from env
      const allowedOrigins = [...new Set([...devOrigins, ...parseAllowedOrigins()])];
      
      // Allow requests with no origin (Postman, curl, same-origin)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is allowed
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Log rejected origins in development for debugging
      logger.warn(`CORS rejected origin in development: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    }
    
    // In production, be more restrictive
    const allowedOrigins = [...prodOrigins, ...parseAllowedOrigins()];
    
    // In production, be careful with no-origin requests
    if (!origin) {
      // You might want to block these in production or handle case-by-case
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    logger.error(`CORS rejected origin in production: ${origin}`);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  
  // Allow cookies and authorization headers
  credentials: true,
  
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  
  // Allowed request headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'X-CSRF-Token',
  ],
  
  // Headers exposed to the client
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'Content-Range',
    'Content-Length',
    'ETag',
    'X-Request-Id',
  ],
  
  // Cache preflight requests for 24 hours
  maxAge: 86400,
  
  // Pass the CORS preflight response to the next handler
  preflightContinue: false,
  
  // Provides a status code to use for successful OPTIONS requests
  optionsSuccessStatus: 204,
};

export default corsOptions;