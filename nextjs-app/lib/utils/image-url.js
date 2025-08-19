/**
 * Utility to handle image URLs for both Docker and local development
 * Ensures proper URL formatting for Next.js Image component
 */

// Get the backend URL based on environment
export const getBackendUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use internal Docker URL if available
    return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  }
  // Client-side: always use public URL
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
};

/**
 * Convert image URLs to use the correct backend host
 * @param {string} imageUrl - The image URL to process
 * @returns {string} - Processed image URL
 */
export const processImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Check if it's a localhost URL that needs to be replaced with backend URL for Docker
    if (typeof window === 'undefined' && imageUrl.includes('localhost:3001')) {
      const backendUrl = getBackendUrl();
      // Only replace if we're in Docker environment (BACKEND_URL is set to http://backend:3001)
      if (backendUrl.includes('backend:3001')) {
        return imageUrl.replace('http://localhost:3001', backendUrl);
      }
    }
    // Return the URL as is if it's already a full URL
    return imageUrl;
  }
  
  // If it's a relative path, prepend the backend URL
  const backendUrl = getBackendUrl();
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${backendUrl}${cleanPath}`;
};

/**
 * Process an array of objects containing image URLs
 * @param {Array} items - Array of items with image properties
 * @param {Array} imageFields - List of field names containing image URLs
 * @returns {Array} - Processed items
 */
export const processImageUrls = (items, imageFields = ['image', 'featured_image', 'thumbnail']) => {
  if (!Array.isArray(items)) return items;
  
  return items.map(item => {
    const processedItem = { ...item };
    imageFields.forEach(field => {
      if (processedItem[field]) {
        processedItem[field] = processImageUrl(processedItem[field]);
      }
    });
    return processedItem;
  });
};

/**
 * Get image loader for Next.js Image component
 * This ensures images are loaded through the correct URL
 */
export const imageLoader = ({ src, width, quality }) => {
  // If src is already a full URL with the image optimization endpoint, return as is
  if (src.includes('/_next/image')) {
    return src;
  }
  
  // Process the image URL to use the correct backend
  const processedSrc = processImageUrl(src);
  
  // For Docker environments, we need to ensure the URL is accessible from the client
  if (typeof window !== 'undefined') {
    // Client-side: use the public backend URL
    return processedSrc;
  }
  
  // Server-side: return the processed URL
  return processedSrc;
};