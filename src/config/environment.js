// Environment configuration for browser
// In Vite, environment variables are accessed via import.meta.env

const getEnvVar = (key, defaultValue = '') => {
  // For Vite, use import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  
  // Fallback for other environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
};

export const ENV = {
  // API URLs
  DEEPSEEK_API_URL: getEnvVar('VITE_DEEPSEEK_API_URL', 'https://api.deepseek.com/v1/chat/completions'),
  DEEPSEEK_API_KEY: getEnvVar('VITE_DEEPSEEK_API_KEY', ''),
  
  // App Configuration
  APP_URL: getEnvVar('VITE_APP_URL', 'https://braunundeyer.de'),
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:3001/api'),
  
  // Feature Flags
  USE_MOCK_DATA: getEnvVar('VITE_USE_MOCK_DATA', 'true') === 'true',
  ENABLE_ANALYTICS: getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
  
  // Development
  IS_DEVELOPMENT: getEnvVar('NODE_ENV', 'development') === 'development',
  IS_PRODUCTION: getEnvVar('NODE_ENV', 'development') === 'production',
};

export default ENV;