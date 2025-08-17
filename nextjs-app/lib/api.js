const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Projects API
export const projectsAPI = {
  // Get all projects
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';
    return fetchAPI(endpoint);
  },

  // Get single project by ID
  async getById(id) {
    return fetchAPI(`/projects/${id}`);
  },

  // Get projects by category
  async getByCategory(category) {
    return fetchAPI(`/projects?category=${category}`);
  },

  // Get featured projects
  async getFeatured() {
    return fetchAPI('/projects?featured=true');
  },

  // Search projects
  async search(query) {
    return fetchAPI(`/projects/search?q=${encodeURIComponent(query)}`);
  }
};

// Services API
export const servicesAPI = {
  // Get all services
  async getAll() {
    return fetchAPI('/services');
  },

  // Get single service by ID
  async getById(id) {
    return fetchAPI(`/services/${id}`);
  }
};

// Team API
export const teamAPI = {
  // Get all team members
  async getAll() {
    return fetchAPI('/team');
  },

  // Get single team member by ID
  async getById(id) {
    return fetchAPI(`/team/${id}`);
  }
};

// Contact API
export const contactAPI = {
  // Submit contact form
  async submit(formData) {
    return fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  // Get contact information
  async getInfo() {
    return fetchAPI('/contact/info');
  }
};

// Content API (for static content)
export const contentAPI = {
  // Get page content
  async getPageContent(page, lang = 'de') {
    return fetchAPI(`/content/${page}?lang=${lang}`);
  },

  // Get translations
  async getTranslations(lang = 'de') {
    return fetchAPI(`/translations/${lang}`);
  },

  // Get SEO metadata
  async getSEOData(page, lang = 'de') {
    return fetchAPI(`/seo/${page}?lang=${lang}`);
  }
};

// Media API
export const mediaAPI = {
  // Get all media
  async getAll(type = null) {
    const endpoint = type ? `/media?type=${type}` : '/media';
    return fetchAPI(endpoint);
  },

  // Get single media by ID
  async getById(id) {
    return fetchAPI(`/media/${id}`);
  },

  // Upload media (for CMS)
  async upload(file, metadata = {}) {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    return fetch(`${API_URL}/media/upload`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  }
};

// Settings API
export const settingsAPI = {
  // Get general settings
  async getGeneral() {
    return fetchAPI('/settings/general');
  },

  // Get social media links
  async getSocialLinks() {
    return fetchAPI('/settings/social');
  },

  // Get opening hours
  async getOpeningHours() {
    return fetchAPI('/settings/hours');
  }
};

// Authentication API (for CMS access)
export const authAPI = {
  // Login
  async login(email, password) {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Logout
  async logout() {
    return fetchAPI('/auth/logout', {
      method: 'POST',
    });
  },

  // Verify token
  async verify(token) {
    return fetchAPI('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Refresh token
  async refresh(refreshToken) {
    return fetchAPI('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }
};

// Statistics API (for dashboard)
export const statsAPI = {
  // Get visitor statistics
  async getVisitors(period = '30d') {
    return fetchAPI(`/stats/visitors?period=${period}`);
  },

  // Get project views
  async getProjectViews() {
    return fetchAPI('/stats/projects');
  },

  // Get contact form submissions
  async getContactStats() {
    return fetchAPI('/stats/contact');
  }
};

// Newsletter API
export const newsletterAPI = {
  // Subscribe to newsletter
  async subscribe(email, name = '') {
    return fetchAPI('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  },

  // Unsubscribe from newsletter
  async unsubscribe(email) {
    return fetchAPI('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
};

// Export all APIs
export default {
  projects: projectsAPI,
  services: servicesAPI,
  team: teamAPI,
  contact: contactAPI,
  content: contentAPI,
  media: mediaAPI,
  settings: settingsAPI,
  auth: authAPI,
  stats: statsAPI,
  newsletter: newsletterAPI,
};