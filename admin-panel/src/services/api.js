// API Service for Braun & Eyer CMS
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://api.braunundeyer.de/api';
export { API_BASE_URL };
export const BACKEND_URL = API_BASE_URL.replace('/api', '');
const API_TIMEOUT = 30000; // 30 seconds timeout (increased for large file uploads)

// Helper function to add timeout to fetch
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - API unavailable');
    }
    throw error;
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    const data = await handleResponse(response);
    
    // Store tokens
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  register: async (userData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return handleResponse(response);
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include'
    });
    
    const data = await handleResponse(response);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  getProfile: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  updateProfile: async (updates) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Projects API
export const projectsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetchWithTimeout(`${API_BASE_URL}/projects${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  create: async (projectData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  update: async (id, updates) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  publish: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/projects/${id}/publish`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  unpublish: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/projects/${id}/unpublish`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Content API
export const contentAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetchWithTimeout(`${API_BASE_URL}/content${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getByKey: async (key, language = 'de') => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/content/${key}?language=${language}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  update: async (key, value, language = 'de') => {
    // Ensure value is properly serialized if it's an object
    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/content/${key}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ value: serializedValue, language }),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  bulkUpdate: async (updates) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/content/bulk`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ updates }),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Media API
export const mediaAPI = {
  upload: async (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('image', file);
    
    // Add metadata
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const token = localStorage.getItem('token');
    const response = await fetchWithTimeout(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData,
      credentials: 'include'
    });
    return handleResponse(response);
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('token');
    const response = await fetchWithTimeout(`${API_BASE_URL}/media/upload-multiple`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData,
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetchWithTimeout(`${API_BASE_URL}/media${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getUploadUrl: async (filename, contentType) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/media/upload-url`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ filename, contentType }),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Settings API
export const settingsAPI = {
  getAll: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/settings`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  update: async (key, value) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/settings/${key}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ value }),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Translations API
export const translationsAPI = {
  translate: async (text, targetLanguage, sourceLanguage = 'de') => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, targetLanguage, sourceLanguage }),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  bulkTranslate: async (texts, targetLanguages, sourceLanguage = 'de') => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/translate/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ texts, targetLanguages, sourceLanguage }),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Audit Log API
export const auditAPI = {
  getLogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetchWithTimeout(`${API_BASE_URL}/audit${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Auto-refresh token interceptor
let refreshPromise = null;
let interceptorSetup = false;

const setupInterceptor = () => {
  // Only set up once to avoid multiple interceptors
  if (interceptorSetup) return;
  interceptorSetup = true;
  
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    let response = await originalFetch(...args);
    
    // If we get a 401 and we have a refresh token, try to refresh
    if (response.status === 401 && localStorage.getItem('refreshToken')) {
      // Don't try to refresh for auth endpoints
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      if (url && (url.includes('/auth/login') || url.includes('/auth/refresh'))) {
        return response;
      }
      
      if (!refreshPromise) {
        refreshPromise = authAPI.refreshToken()
          .catch(() => {
            // If refresh fails, clear storage but don't redirect immediately
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            throw new Error('Session expired');
          })
          .finally(() => {
            refreshPromise = null;
          });
      }
      
      try {
        await refreshPromise;
        
        // Retry the original request with new token
        if (args[1] && args[1].headers) {
          args[1].headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        }
        response = await originalFetch(...args);
      } catch (error) {
        // Return original 401 response if refresh failed
        return response;
      }
    }
    
    return response;
  };
};

// Setup interceptor on load
setupInterceptor();

export default {
  auth: authAPI,
  projects: projectsAPI,
  content: contentAPI,
  media: mediaAPI,
  settings: settingsAPI,
  translations: translationsAPI,
  audit: auditAPI
};