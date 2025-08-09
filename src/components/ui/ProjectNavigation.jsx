import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ProjectNavigation = ({ 
  currentProjectId = 1, 
  totalProjects = 12,
  showBackToGallery = true 
}) => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (currentProjectId > 1) {
      navigate(`/de/projekte/${currentProjectId - 1}`);
    }
  };

  const handleNext = () => {
    if (currentProjectId < totalProjects) {
      navigate(`/de/projekte/${currentProjectId + 1}`);
    }
  };

  const handleBackToGallery = () => {
    navigate('/de/projekte');
  };

  return (
    <div className="flex flex-col space-y-4 lg:space-y-6">
      {/* Back to Gallery */}
      {showBackToGallery && (
        <button
          onClick={handleBackToGallery}
          className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors duration-200 font-body font-medium group"
        >
          <Icon 
            name="ArrowLeft" 
            size={20} 
            className="group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" 
          />
          <span>Back to Gallery</span>
        </button>
      )}

      {/* Project Counter */}
      <div className="flex items-center justify-between bg-surface rounded-minimal p-4 border border-border">
        <div className="font-caption text-text-secondary text-sm">
          Project {currentProjectId} of {totalProjects}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentProjectId <= 1}
            className={`p-2 rounded-minimal transition-colors duration-200 ${
              currentProjectId <= 1
                ? 'text-text-secondary/50 cursor-not-allowed' :'text-text-secondary hover:text-accent hover:bg-background'
            }`}
            aria-label="Previous project"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentProjectId >= totalProjects}
            className={`p-2 rounded-minimal transition-colors duration-200 ${
              currentProjectId >= totalProjects
                ? 'text-text-secondary/50 cursor-not-allowed' :'text-text-secondary hover:text-accent hover:bg-background'
            }`}
            aria-label="Next project"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="hidden lg:block">
        <div className="text-text-secondary text-sm font-caption mb-3">
          Quick Navigation
        </div>
        <div className="space-y-2">
          <Link
            to="/de/projekte"
            className="flex items-center space-x-2 p-2 rounded-minimal text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200 text-sm"
          >
            <Icon name="Grid3X3" size={16} />
            <span>All Projects</span>
          </Link>
          <Link
            to="/de/leistungen"
            className="flex items-center space-x-2 p-2 rounded-minimal text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200 text-sm"
          >
            <Icon name="Settings" size={16} />
            <span>Our Services</span>
          </Link>
          <Link
            to="/de/kontakt"
            className="flex items-center space-x-2 p-2 rounded-minimal text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200 text-sm"
          >
            <Icon name="Mail" size={16} />
            <span>Start a Project</span>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-100">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentProjectId <= 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-minimal transition-colors duration-200 ${
              currentProjectId <= 1
                ? 'text-text-secondary/50 cursor-not-allowed' :'text-text-secondary hover:text-accent hover:bg-surface'
            }`}
          >
            <Icon name="ChevronLeft" size={20} />
            <span className="text-sm font-medium">Previous</span>
          </button>
          
          <div className="text-text-secondary text-sm font-caption">
            {currentProjectId} / {totalProjects}
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentProjectId >= totalProjects}
            className={`flex items-center space-x-2 px-4 py-2 rounded-minimal transition-colors duration-200 ${
              currentProjectId >= totalProjects
                ? 'text-text-secondary/50 cursor-not-allowed' :'text-text-secondary hover:text-accent hover:bg-surface'
            }`}
          >
            <span className="text-sm font-medium">Next</span>
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectNavigation;