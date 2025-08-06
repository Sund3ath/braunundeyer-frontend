import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  
  const pathMap = {
    '/homepage': 'Startseite',
    '/project-gallery': 'Projekte',
    '/project-detail': 'Projektdetails',
    '/about-us': 'Über uns',
    '/services': 'Leistungen',
    '/contact': 'Kontakt',
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ label: 'Startseite', path: '/homepage' }];

    if (pathSegments.length > 0) {
      let currentPath = '';
      pathSegments.forEach((segment) => {
        currentPath += `/${segment}`;
        const label = pathMap[currentPath] || segment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        breadcrumbs.push({ label, path: currentPath });
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