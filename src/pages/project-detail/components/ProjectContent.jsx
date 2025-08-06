import React from 'react';
import Icon from 'components/AppIcon';

const ProjectContent = ({ project }) => {
  const sections = [
    {
      title: 'Project Overview',
      icon: 'FileText',
      content: project.description
    },
    {
      title: 'Design Challenges',
      icon: 'AlertTriangle',
      content: project.challenges
    },
    {
      title: 'Our Solutions',
      icon: 'Lightbulb',
      content: project.solutions
    },
    {
      title: 'Materials & Features',
      icon: 'Package',
      content: project.materials
    }
  ];

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <Icon 
                name={section.icon} 
                size={18} 
                className="text-accent" 
              />
            </div>
            <h2 className="text-xl lg:text-2xl font-heading font-light text-primary">
              {section.title}
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-text-primary font-body leading-relaxed">
            <p>{section.content}</p>
          </div>
        </div>
      ))}

      {/* Key Features */}
      <div className="bg-surface rounded border border-border p-6 lg:p-8">
        <h3 className="text-lg font-heading font-medium text-primary mb-6">
          Key Project Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Sustainable design principles',
            'Energy-efficient systems',
            'Smart building technology',
            'Natural lighting optimization',
            'Community-focused spaces',
            'Flexible interior layouts'
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Icon 
                name="Check" 
                size={16} 
                className="text-success flex-shrink-0" 
              />
              <span className="text-sm font-body text-text-primary">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectContent;