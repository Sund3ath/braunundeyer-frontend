'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Building2, Users, Settings, Mail } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header({ dict, lang }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Prevent body scroll when mobile menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const navItems = [
    { href: `/${lang}/homepage`, label: dict?.nav?.home || 'Startseite', icon: Home },
    { href: `/${lang}/projekte`, label: dict?.nav?.projects || 'Projekte', icon: Building2 },
    { href: `/${lang}/uber-uns`, label: dict?.nav?.about || 'Über Uns', icon: Users },
    { href: `/${lang}/leistungen`, label: dict?.nav?.services || 'Leistungen', icon: Settings },
    { href: `/${lang}/kontakt`, label: dict?.nav?.contact || 'Kontakt', icon: Mail },
  ];

  const isActive = (href) => pathname === href;

  return (
    <>
      <style jsx global>{`
        .mobile-menu-panel {
          animation: slide-in 0.3s ease-out;
        }
        
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
      
      <header
        className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-subtle' : 'bg-background'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo - Landing page style with black background extending below navbar */}
            <Link 
              href={`/${lang}/homepage`} 
              className="group transition-all duration-200 relative"
            >
              <div 
                className="bg-primary px-6 lg:px-8 text-center relative z-10 mt-3 mb-3" 
                style={{ 
                  paddingTop: '12px', 
                  paddingBottom: '18px', 
                  marginBottom: '-12px' 
                }}
              >
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
                  />
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
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-body font-medium text-sm xl:text-base transition-colors duration-200 hover:text-accent ${
                      isActive(item.href)
                        ? 'text-accent border-b-2 border-accent pb-1' 
                        : 'text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {/* Language Switcher */}
              <LanguageSwitcher currentLang={lang} className="ml-4" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[10000] lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          <div className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-background shadow-elevation mobile-menu-panel overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <div className="font-heading font-semibold text-lg text-primary">
                Navigation
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200 flex-shrink-0"
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="p-4 overflow-y-auto h-full pb-20">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 p-3 rounded transition-colors duration-200 ${
                          isActive(item.href)
                            ? 'bg-accent/10 text-accent border-l-4 border-accent' 
                            : 'text-text-secondary hover:bg-surface hover:text-accent'
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        <Icon size={20} />
                        <span className="font-body font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              
              {/* Language switcher in mobile menu */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="px-3 mb-3 text-sm text-text-secondary font-body">
                  {dict?.language || 'Sprache'}
                </div>
                <LanguageSwitcher currentLang={lang} className="w-full" mobile />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}