'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Grid3X3, Settings, Mail } from 'lucide-react';

const ProjectNavigation = ({ 
  currentProjectId = 1, 
  totalProjects = 12,
  showBackToGallery = true,
  lang = 'de'
}) => {
  const router = useRouter();

  const handlePrevious = () => {
    if (currentProjectId > 1) {
      router.push(`/${lang}/projekte/${currentProjectId - 1}`);
    }
  };

  const handleNext = () => {
    if (currentProjectId < totalProjects) {
      router.push(`/${lang}/projekte/${currentProjectId + 1}`);
    }
  };

  const handleBackToGallery = () => {
    router.push(`/${lang}/projekte`);
  };

  return (
    <div className="flex flex-col space-y-4 lg:space-y-6">
      {/* Back to Gallery */}
      {showBackToGallery && (
        <button
          onClick={handleBackToGallery}
          className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors duration-200 font-body font-medium group"
        >
          <ArrowLeft 
            size={20} 
            className="group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" 
          />
          <span>Back to Gallery</span>
        </button>
      )}

      {/* Project Counter */}
      <div className="flex items-center justify-between bg-surface rounded-lg p-4 border border-border">
        <div className="font-body text-text-secondary text-sm">
          Project {currentProjectId} of {totalProjects}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentProjectId <= 1}
            className={`p-2 rounded transition-colors duration-200 ${
              currentProjectId <= 1
                ? 'text-text-secondary/50 cursor-not-allowed' 
                : 'text-text-secondary hover:text-accent hover:bg-background'
            }`}
            aria-label="Previous project"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentProjectId >= totalProjects}
            className={`p-2 rounded transition-colors duration-200 ${
              currentProjectId >= totalProjects
                ? 'text-text-secondary/50 cursor-not-allowed' 
                : 'text-text-secondary hover:text-accent hover:bg-background'
            }`}
            aria-label="Next project"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="hidden lg:block">
        <div className="text-text-secondary text-sm font-body mb-3">
          Quick Navigation
        </div>
        <div className="space-y-2">
          <Link
            href={`/${lang}/projekte`}
            className="flex items-center space-x-2 p-2 rounded text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200 text-sm"
          >
            <Grid3X3 size={16} />
            <span>All Projects</span>
          </Link>
          <Link
            href={`/${lang}/leistungen`}
            className="flex items-center space-x-2 p-2 rounded text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200 text-sm"
          >
            <Settings size={16} />
            <span>Our Services</span>
          </Link>
          <Link
            href={`/${lang}/kontakt`}
            className="flex items-center space-x-2 p-2 rounded text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200 text-sm"
          >
            <Mail size={16} />
            <span>Start a Project</span>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-[100]">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentProjectId <= 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 ${
              currentProjectId <= 1
                ? 'text-text-secondary/50 cursor-not-allowed' 
                : 'text-text-secondary hover:text-accent hover:bg-surface'
            }`}
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Previous</span>
          </button>
          
          <div className="text-text-secondary text-sm font-body">
            {currentProjectId} / {totalProjects}
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentProjectId >= totalProjects}
            className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 ${
              currentProjectId >= totalProjects
                ? 'text-text-secondary/50 cursor-not-allowed' 
                : 'text-text-secondary hover:text-accent hover:bg-surface'
            }`}
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectNavigation;