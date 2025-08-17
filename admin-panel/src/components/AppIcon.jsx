import React from 'react';
import * as LucideIcons from 'lucide-react';

const AppIcon = ({ name, size = 24, className = '', ...props }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  
  return (
    <IconComponent 
      size={size} 
      className={className} 
      {...props} 
    />
  );
};

export default AppIcon;