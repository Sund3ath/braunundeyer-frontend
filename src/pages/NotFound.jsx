import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={48} className="text-accent" />
          </div>
          <h1 className="text-6xl font-heading font-light text-primary mb-4">404</h1>
          <h2 className="text-2xl font-heading font-light text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-text-secondary font-body mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/homepage"
            className="inline-flex items-center space-x-2 bg-accent text-white px-6 py-3 rounded transition-all duration-200 hover:scale-102 hover:shadow-lg font-body font-medium"
          >
            <Icon name="Home" size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-text-secondary text-sm font-body">
            or{' '}
            <Link
              to="/project-gallery"
              className="text-accent hover:underline font-medium"
            >
              browse our projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;