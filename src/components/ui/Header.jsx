import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import { useEditMode } from '../../cms/contexts/EditModeContext';
import LanguageSwitcher from '../LanguageSwitcher';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useEditMode();
  
  // Get current language from URL or i18n
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';
  
  // Language-aware navigation items using translations
  const navigationItems = [
    { label: t('nav.home'), path: `/${currentLang}/homepage`, icon: 'Home' },
    { label: t('nav.projects'), path: `/${currentLang}/projekte`, icon: 'Building2' },
    { label: t('nav.about'), path: `/${currentLang}/uber-uns`, icon: 'Users' },
    { label: t('nav.services'), path: `/${currentLang}/leistungen`, icon: 'Settings' },
    { label: t('nav.contact'), path: `/${currentLang}/kontakt`, icon: 'Mail' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Remove body scroll lock when navigating
    document.body.classList.remove('mobile-menu-open');
  }, [location]);
  
  // Cleanup effect to remove body scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Prevent body scroll when mobile menu is open
    if (!isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const isActivePath = (path) => {
    // Check if current pathname matches the navigation path
    return location.pathname === path;
  };

  return (
    <>
      <header 
        className={`fixed left-0 right-0 z-[9000] transition-all duration-300 ${
          isAuthenticated ? 'top-16' : 'top-0'
        } ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-sm shadow-subtle' 
            : 'bg-background'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo - Landing page style with black background extending below navbar */}
            <Link 
              to={`/${currentLang}/homepage`} 
              className="group transition-smooth relative"
            >
              <div className="bg-primary px-6 lg:px-8 text-center relative z-10 mt-3 mb-3" style={{ paddingTop: '12px', paddingBottom: '18px', marginBottom: '-12px' }}>
                <div className="relative inline-block">
                  <h1 
                    className="text-sm lg:text-base font-normal text-white tracking-[0.3em] lg:tracking-[0.4em] mb-0"
                    style={{
                      fontFamily: "'Times New Roman', Times, serif",
                      fontWeight: 400,
                    }}
                  >
                    braun & eyer
                  </h1>
                  {/* Underline - extended */}
                  <div 
                    className="absolute -bottom-0 h-[1px] bg-white group-hover:bg-accent transition-colors duration-200"
                    style={{
                      left: '-5%',
                      right: '-5%',
                      width: '110%',
                    }}
                  ></div>
                </div>
                <p 
                  className="text-sm lg:text-base font-normal text-white tracking-[0.38em] lg:tracking-[0.52em] mt-0 group-hover:text-accent transition-colors duration-200"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 400,
                    marginLeft: '0.2em',
                  }}
                >
                  architekten
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-body font-medium text-sm xl:text-base transition-colors duration-200 hover:text-accent ${
                      isActivePath(item.path)
                        ? 'text-accent border-b-2 border-accent pb-1' :'text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {/* Language Switcher */}
              <LanguageSwitcher className="ml-4" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-minimal text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <Icon 
                name={isMobileMenuOpen ? 'X' : 'Menu'} 
                size={24} 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-200 lg:hidden overflow-hidden mobile-menu-container">
          <div
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          <div className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-background shadow-elevation animate-slide-in overflow-hidden mobile-menu-panel">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <div className="font-heading font-semibold text-lg text-primary">
                Navigation
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-minimal text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200 flex-shrink-0"
                aria-label="Close mobile menu"
              >
                <Icon name="X" size={24} />
              </button>
            </div>
            
            <nav className="p-4 overflow-y-auto h-full pb-20">
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 p-3 rounded-minimal transition-colors duration-200 ${
                        isActivePath(item.path)
                          ? 'bg-accent/10 text-accent border-l-4 border-accent' :'text-text-secondary hover:bg-surface hover:text-accent'
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      <Icon name={item.icon} size={20} />
                      <span className="font-body font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;