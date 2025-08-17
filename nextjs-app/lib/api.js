const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  // In Next.js, we'll handle auth differently for SSR
  if (typeof window === 'undefined') {
    // Server-side
    return {
      'Content-Type': 'application/json',
    };
  }
  
  // Client-side
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

// Projects API
export const projectsAPI = {
  getAll: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: getAuthHeaders(),
        next: { revalidate: 3600 }, // Cache for 1 hour
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout');
        return { projects: [] };
      }
      console.error('API Error:', error);
      return { projects: [] };
    }
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }
    });
    return handleResponse(response);
  },

  getBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/projects/slug/${slug}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }
    });
    return handleResponse(response);
  },
};

// Content API
export const contentAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/content${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }
    });
    return handleResponse(response);
  },

  getByKey: async (key, language = 'de') => {
    const response = await fetch(`${API_BASE_URL}/content/${key}?language=${language}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }
    });
    return handleResponse(response);
  },
};

// Media API
export const mediaAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/media`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }
    });
    return handleResponse(response);
  },
};