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
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it's a relative path, prepend the backend URL
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Fetch all team members from the API
 */
export async function getAllTeamMembers(language = 'de') {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/team?active_only=true&lang=${language}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data on each request
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch team members:', response.status);
      return [];
    }

    const members = await response.json();
    
    // Process image URLs for all members
    const processedMembers = members.map(member => ({
      ...member,
      image: processImageUrl(member.image)
    }));

    return processedMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

/**
 * Fetch a single team member by ID
 */
export async function getTeamMemberById(id, language = 'de') {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/team/${id}?lang=${language}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch team member:', response.status);
      return null;
    }

    const member = await response.json();
    
    // Process image URL
    return {
      ...member,
      image: processImageUrl(member.image)
    };
  } catch (error) {
    console.error('Error fetching team member:', error);
    return null;
  }
}

export default {
  getAllTeamMembers,
  getTeamMemberById,
};