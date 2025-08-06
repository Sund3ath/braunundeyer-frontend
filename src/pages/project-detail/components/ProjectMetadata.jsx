import React from 'react';
import Icon from 'components/AppIcon';

const ProjectMetadata = ({ project }) => {
  const metadata = [
    {
      icon: 'MapPin',
      label: 'Location',
      value: project.location
    },
    {
      icon: 'Calendar',
      label: 'Year Completed',
      value: project.year
    },
    {
      icon: 'Square',
      label: 'Total Area',
      value: project.area
    },
    {
      icon: 'Building2',
      label: 'Project Type',
      value: project.type
    },
    {
      icon: 'Users',
      label: 'Client',
      value: project.client
    }
  ];

  return (
    <div className="bg-surface rounded border border-border p-6 space-y-6">
      <h3 className="text-lg font-heading font-medium text-primary">
        Project Details
      </h3>
      
      <div className="space-y-4">
        {metadata.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5">
              <Icon 
                name={item.icon} 
                size={20} 
                className="text-accent" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-caption text-text-secondary mb-1">
                {item.label}
              </div>
              <div className="text-sm font-body text-text-primary font-medium">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Client Testimonial */}
      {project.testimonial && (
        <div className="pt-6 border-t border-border">
          <h4 className="text-sm font-caption text-text-secondary mb-3">
            Client Testimonial
          </h4>
          <blockquote className="space-y-3">
            <p className="text-sm font-body text-text-primary italic leading-relaxed">
              "{project.testimonial.text}"
            </p>
            <footer className="text-xs font-caption text-text-secondary">
              <div className="font-medium">{project.testimonial.author}</div>
              <div>{project.testimonial.position}</div>
            </footer>
          </blockquote>
        </div>
      )}
    </div>
  );
};

export default ProjectMetadata;