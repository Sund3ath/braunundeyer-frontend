// Use internal URL for server-side requests (in Docker), public URL for client-side
const getApiUrl = () => {
  // Server-side: use internal Docker network URL if available
  if (typeof window === 'undefined') {
    return process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }
  // Client-side: use public URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
  const apiUrl = getApiUrl(); // Get fresh URL for each request
  const url = `${apiUrl}${endpoint}`;
  
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

// Helper function to process image URLs
const processImageUrl = (url) => {
  if (!url || url === '' || url === null || url === undefined) {
    return null;
  }
  
  // If it's already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Check if it's a localhost URL that needs to be replaced with backend URL for Docker
    if (typeof window === 'undefined' && url.includes('localhost:3001')) {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
      // Only replace if we're in Docker environment (BACKEND_URL is set to http://backend:3001)
      if (backendUrl.includes('backend:3001')) {
        return url.replace('http://localhost:3001', backendUrl);
      }
    }
    // Return the URL as is if it's already a full URL
    return url;
  }
  
  // Get the appropriate backend URL for relative paths
  const backendUrl = typeof window === 'undefined' 
    ? (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001')
    : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001');
  
  // If it's a relative path, prepend the backend URL
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Projects API
export const projectsAPI = {
  // Get all projects
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';
    const response = await fetchAPI(endpoint);
    
    // Process image URLs for all projects
    if (response.projects && Array.isArray(response.projects)) {
      response.projects = response.projects.map(project => ({
        ...project,
        image: processImageUrl(project.image),
        featured_image: processImageUrl(project.featured_image),
        gallery: project.gallery && Array.isArray(project.gallery) 
          ? project.gallery.map(img => processImageUrl(img))
          : []
      }));
    }
    
    return response;
  },

  // Get single project by ID
  async getById(id) {
    const project = await fetchAPI(`/projects/${id}`);
    
    // Process image URLs
    if (project) {
      project.image = processImageUrl(project.image);
      project.featured_image = processImageUrl(project.featured_image);
      if (project.gallery && Array.isArray(project.gallery)) {
        project.gallery = project.gallery.map(img => processImageUrl(img));
      }
    }
    
    return project;
  },

  // Get projects by category
  async getByCategory(category) {
    const response = await fetchAPI(`/projects?category=${category}`);
    
    // Process image URLs for all projects
    if (response.projects && Array.isArray(response.projects)) {
      response.projects = response.projects.map(project => ({
        ...project,
        image: processImageUrl(project.image),
        featured_image: processImageUrl(project.featured_image),
        gallery: project.gallery && Array.isArray(project.gallery) 
          ? project.gallery.map(img => processImageUrl(img))
          : []
      }));
    }
    
    return response;
  },

  // Get featured projects
  async getFeatured() {
    const response = await fetchAPI('/projects?featured=true');
    
    // Process image URLs for all projects
    if (response.projects && Array.isArray(response.projects)) {
      response.projects = response.projects.map(project => ({
        ...project,
        image: processImageUrl(project.image),
        featured_image: processImageUrl(project.featured_image),
        gallery: project.gallery && Array.isArray(project.gallery) 
          ? project.gallery.map(img => processImageUrl(img))
          : []
      }));
    }
    
    return response;
  },

  // Search projects
  async search(query) {
    const response = await fetchAPI(`/projects/search?q=${encodeURIComponent(query)}`);
    
    // Process image URLs for all projects
    if (response.projects && Array.isArray(response.projects)) {
      response.projects = response.projects.map(project => ({
        ...project,
        image: processImageUrl(project.image),
        featured_image: processImageUrl(project.featured_image),
        gallery: project.gallery && Array.isArray(project.gallery) 
          ? project.gallery.map(img => processImageUrl(img))
          : []
      }));
    }
    
    return response;
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
  },

  // Get content by key
  async getByKey(key, lang = 'de') {
    try {
      return await fetchAPI(`/content/${key}?language=${lang}`);
    } catch (error) {
      console.error(`Failed to fetch content for ${key}:`, error);
      return null;
    }
  },

  // Get all content for a language
  async getAll(lang = 'de') {
    try {
      const response = await fetchAPI(`/content?language=${lang}`);
      return response.content || {};
    } catch (error) {
      console.error('Failed to fetch all content:', error);
      return {};
    }
  }
};

// Homepage API
export const homepageAPI = {
  // Get homepage configuration (hero slides and featured projects)
  async getConfig() {
    try {
      const response = await fetchAPI('/content/homepage');
      // Parse the value if it's a JSON string
      let config = response.value || response;
      if (typeof config === 'string') {
        try {
          config = JSON.parse(config);
        } catch (e) {
          console.error('Failed to parse homepage config:', e);
          config = { heroSlides: [], featuredProjects: [] };
        }
      }
      
      // Process image URLs in hero slides
      if (config.heroSlides && Array.isArray(config.heroSlides)) {
        config.heroSlides = config.heroSlides.map(slide => ({
          ...slide,
          image: processImageUrl(slide.image),
          video: slide.video ? processImageUrl(slide.video) : null
        }));
      }
      
      // Process image URLs in featured projects
      if (config.featuredProjects && Array.isArray(config.featuredProjects)) {
        config.featuredProjects = config.featuredProjects.map(project => ({
          ...project,
          image: processImageUrl(project.image)
        }));
      }
      
      return config || {
        heroSlides: [],
        featuredProjects: []
      };
    } catch (error) {
      console.error('Failed to fetch homepage config:', error);
      // Return fallback data
      return {
        heroSlides: [
          {
            id: '1',
            image: '',
            title: 'Modern Architecture',
            subtitle: 'Innovative Design',
            description: 'Creating spaces that inspire and endure',
            order: 0
          }
        ],
        featuredProjects: []
      };
    }
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
  homepage: homepageAPI,
  media: mediaAPI,
  settings: settingsAPI,
  auth: authAPI,
  stats: statsAPI,
  newsletter: newsletterAPI,
};