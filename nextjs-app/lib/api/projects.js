const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Process image URL to ensure it points to the backend
 */
const processImageUrl = (url) => {
  if (!url || url === '' || url === null || url === undefined) {
    return null;
  }
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it's a relative path, prepend the backend URL
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Fetch all projects from the API
 */
export async function getAllProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
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
    const processedProjects = data.projects?.map(project => ({
      ...project,
      image: processImageUrl(project.image),
      images: project.images?.map(img => processImageUrl(img)),
      thumbnail: processImageUrl(project.thumbnail),
    })) || [];

    return processedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Fetch a single project by ID
 */
export async function getProjectById(id) {
  try {
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
    
    // Process image URLs
    return {
      ...project,
      image: processImageUrl(project.image),
      images: project.images?.map(img => processImageUrl(img)),
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