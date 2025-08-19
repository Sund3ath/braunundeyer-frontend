// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// For production, BACKEND_URL should be http://api.braunundeyer.de
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || API_BASE_URL.replace('/api', '');

export default {
  API_BASE_URL,
  BACKEND_URL
};