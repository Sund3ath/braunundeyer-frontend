import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  
  const pathMap = {
    'homepage': 'Startseite',
    'projekte': 'Projekte',
    'uber-uns': 'Über uns',
    'leistungen': 'Leistungen',
    'kontakt': 'Kontakt',
    'impressum': 'Impressum',
    'datenschutz': 'Datenschutz',
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    // Filter out language codes
    const supportedLanguages = ['de', 'en', 'fr', 'it', 'es'];
    const filteredSegments = pathSegments.filter(segment => !supportedLanguages.includes(segment));
    
    // Get the language prefix for building proper links
    const langPrefix = supportedLanguages.includes(pathSegments[0]) ? `/${pathSegments[0]}` : '/de';
    
    const breadcrumbs = [{ label: 'Startseite', path: `${langPrefix}/homepage` }];

    if (filteredSegments.length > 0) {
      let currentPath = langPrefix;
      filteredSegments.forEach((segment) => {
        currentPath += `/${segment}`;
        // Special case for project details
        if (segment.match(/^\d+$/)) {
          breadcrumbs.push({ label: `Projekt ${segment}`, path: currentPath });
        } else {
          const label = pathMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          breadcrumbs.push({ label, path: currentPath });
        }
      });
    }

    return breadcrumbs.length > 1 ? breadcrumbs : [];
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm font-body" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-text-secondary mx-2" 
              />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-text-secondary font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-text-secondary hover:text-accent transition-colors duration-200 font-medium"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;