import React from 'react';

// Placeholder SEO component for admin panel
// Admin panel doesn't need SEO since it's behind authentication
const MultiLanguageSEO = ({ title, description }) => {
  React.useEffect(() => {
    if (title) {
      document.title = `${title} | Admin Panel`;
    }
  }, [title]);
  
  return null;
};

export default MultiLanguageSEO;