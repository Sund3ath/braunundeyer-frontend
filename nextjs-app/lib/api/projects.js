// Use internal Docker URL for server-side requests, public URL for client-side
const API_BASE_URL = typeof window === 'undefined' 
  ? (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001')
  : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001');

/**
 * Process image URL to ensure it points to the backend
 */
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

/**
 * Fetch all projects from the API with optional language support
 */
export async function getAllProjects(language = 'de') {
  try {
    // Use the translation endpoint for non-German languages
    const endpoint = language && language !== 'de' 
      ? `${API_BASE_URL}/api/project-translations/language/${language}`
      : `${API_BASE_URL}/api/projects`;
      
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // In server components, we can't use credentials: 'include'
      // but we can pass cookies if needed
      cache: 'no-store', // Ensure fresh data on each request
    });

    if (!response.ok) {
      console.error('Failed to fetch projects:', response.status);
      return [];
    }

    const data = await response.json();
    
    // Process image URLs for all projects
    const processedProjects = data.projects?.map(project => {
      // Combine main image, gallery and images arrays
      const processedImages = [];
      
      // Add main image first if it exists
      if (project.image) {
        processedImages.push(processImageUrl(project.image));
      }
      
      // Add images from the gallery field
      if (project.gallery && Array.isArray(project.gallery)) {
        processedImages.push(...project.gallery.map(img => processImageUrl(img)));
      }
      
      // Add images from the images field
      if (project.images && Array.isArray(project.images)) {
        processedImages.push(...project.images.map(img => processImageUrl(img)));
      }
      
      return {
        ...project,
        image: processImageUrl(project.image),
        images: processedImages,
        gallery: project.gallery?.map(img => processImageUrl(img)),
        thumbnail: processImageUrl(project.thumbnail),
      };
    }) || [];

    return processedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Fetch a single project by ID with optional language support
 */
export async function getProjectById(id, language = 'de') {
  try {
    // First fetch the base project
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch project:', response.status);
      return null;
    }

    const project = await response.json();
    
    // If a different language is requested, fetch the translation
    if (language && language !== 'de') {
      try {
        const translationResponse = await fetch(
          `${API_BASE_URL}/api/project-translations/project/${id}/${language}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        );
        
        if (translationResponse.ok) {
          const translation = await translationResponse.json();
          // Merge translation with base project data
          if (translation) {
            project.title = translation.title || project.title;
            project.description = translation.description || project.description;
            project.location = translation.location || project.location;
            project.area = translation.area || project.area;
            if (translation.details) {
              project.details = translation.details;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching project translation:', error);
        // Continue with untranslated project
      }
    }
    
    // Process image URLs - combine main image, gallery and images arrays
    const processedImages = [];
    
    // Add main image first if it exists
    if (project.image) {
      processedImages.push(processImageUrl(project.image));
    }
    
    // Add images from the gallery field
    if (project.gallery && Array.isArray(project.gallery)) {
      processedImages.push(...project.gallery.map(img => processImageUrl(img)));
    }
    
    // Add images from the images field
    if (project.images && Array.isArray(project.images)) {
      processedImages.push(...project.images.map(img => processImageUrl(img)));
    }
    
    return {
      ...project,
      image: processImageUrl(project.image),
      images: processedImages,
      gallery: project.gallery?.map(img => processImageUrl(img)),
      thumbnail: processImageUrl(project.thumbnail),
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

/**
 * Fetch projects by category
 */
export async function getProjectsByCategory(category) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects?category=${encodeURIComponent(category)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch projects by category:', response.status);
      return [];
    }

    const data = await response.json();
    
    // Process image URLs
    const processedProjects = data.projects?.map(project => ({
      ...project,
      image: processImageUrl(project.image),
      images: project.images?.map(img => processImageUrl(img)),
      thumbnail: processImageUrl(project.thumbnail),
    })) || [];

    return processedProjects;
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    return [];
  }
}

/**
 * Fetch featured projects
 */
export async function getFeaturedProjects(limit = 6) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects?featured=true&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch featured projects:', response.status);
      return [];
    }

    const data = await response.json();
    
    // Process image URLs
    const processedProjects = data.projects?.map(project => ({
      ...project,
      image: processImageUrl(project.image),
      images: project.images?.map(img => processImageUrl(img)),
      thumbnail: processImageUrl(project.thumbnail),
    })) || [];

    return processedProjects;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export default {
  getAllProjects,
  getProjectById,
  getProjectsByCategory,
  getFeaturedProjects,
};