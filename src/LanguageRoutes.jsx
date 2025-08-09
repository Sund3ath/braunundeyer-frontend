import React, { useEffect } from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollToTop from 'components/ScrollToTop';
import ErrorBoundary from 'components/ErrorBoundary';
import AdminToolbar from './cms/components/AdminToolbar';
import LoginModal from './cms/components/LoginModal';
import { useEditMode } from './cms/contexts/EditModeContext';

// Import pages
import Landing from 'pages/landing';
import Homepage from 'pages/homepage';
import ProjectGallery from 'pages/project-gallery';
import ProjectDetail from 'pages/project-detail';
import AboutUs from 'pages/about-us';
import Contact from 'pages/contact';
import Services from 'pages/services';
import Impressum from 'pages/impressum';
import Datenschutz from 'pages/datenschutz';
import NotFound from 'pages/NotFound';
import AdminDashboard from './cms/pages/AdminDashboard';

// Language wrapper component
const LanguageWrapper = ({ children }) => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();
  
  useEffect(() => {
    const supportedLanguages = ['de', 'en', 'fr', 'it', 'es'];
    if (lang && supportedLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  return children;
};

const LanguageRoutes = () => {
  const { isAuthenticated } = useEditMode();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  
  // Handle keyboard shortcut for CMS login
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Shift + L to open login
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setShowLoginModal(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        
        {/* Admin Toolbar */}
        {isAuthenticated && <AdminToolbar />}
        
        {/* Login Modal */}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
        
        {/* Add padding when admin toolbar is visible */}
        <div className={isAuthenticated ? 'pt-16' : ''}>
          <RouterRoutes>
            {/* Root redirect to German */}
            <Route path="/" element={<Navigate to="/de" replace />} />
            
            {/* Language-specific routes */}
            <Route path="/:lang/*" element={<LanguageWrapper><LanguageSpecificRoutes /></LanguageWrapper>} />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

// Separate component for language-specific routes
const LanguageSpecificRoutes = () => {
  const { lang } = useParams();
  const { t } = useTranslation();
  
  // Use static routes to avoid translation loading issues
  const routes = {
    home: '',
    homepage: 'homepage',
    projects: 'projekte',
    projectDetail: 'projekte/:id',
    about: 'uber-uns',
    services: 'leistungen',
    contact: 'kontakt',
    impressum: 'impressum',
    datenschutz: 'datenschutz'
  };
  
  return (
    <RouterRoutes>
      <Route index element={<Landing />} />
      <Route path={routes.homepage} element={<Homepage />} />
      <Route path={routes.projects} element={<ProjectGallery />} />
      <Route path={routes.projectDetail} element={<ProjectDetail />} />
      <Route path={routes.about} element={<AboutUs />} />
      <Route path={routes.services} element={<Services />} />
      <Route path={routes.contact} element={<Contact />} />
      <Route path={routes.impressum} element={<Impressum />} />
      <Route path={routes.datenschutz} element={<Datenschutz />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default LanguageRoutes;