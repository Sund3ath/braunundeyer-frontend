import React from 'react';

const AppImage = ({ src, alt, className = '', width, height, ...props }) => {
  return (
    <img 
      src={src} 
      alt={alt || ''} 
      className={className}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  );
};

export default AppImage;