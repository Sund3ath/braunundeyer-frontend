import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RelatedProjects = ({ currentProjectId, currentCategory, projects }) => {
  // Filter related projects (same category, exclude current)
  const relatedProjects = projects
    .filter(project => 
      project.category === currentCategory && 
      project.id !== currentProjectId
    )
    .slice(0, 3);

  // If no related projects in same category, show other projects
  const displayProjects = relatedProjects.length > 0 
    ? relatedProjects 
    : projects.filter(project => project.id !== currentProjectId).slice(0, 3);

  if (displayProjects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-heading font-light text-primary">
          Related Projects
        </h2>
        <Link
          to="/project-gallery"
          className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors duration-200 font-body font-medium"
        >
          <span>View All</span>
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {displayProjects.map((project) => (
          <Link
            key={project.id}
            to={`/de/projekte/${project.id}`}
            className="group space-y-4"
          >
            <div className="relative aspect-video bg-surface rounded overflow-hidden">
              <Image
                src={project.heroImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <Icon name="ArrowUpRight" size={16} className="text-primary" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-heading font-medium text-primary group-hover:text-accent transition-colors duration-200">
                {project.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-text-secondary font-body">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProjects;