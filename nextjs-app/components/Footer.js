'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Triangle } from 'lucide-react';

export default function Footer({ dict, lang, onCopyrightClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);
  const currentYear = new Date().getFullYear();
  
  // Handle triple-click on footer copyright for CMS access
  const handleCopyrightClick = () => {
    // Clear previous timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    // Use functional update to ensure we get the latest state
    setClickCount(prevCount => {
      const newClickCount = prevCount + 1;
      
      if (newClickCount >= 3) { // Triple click (3 clicks)
        // Reset count immediately
        setClickCount(0);
        
        // Redirect to CMS/Admin panel
        // Check if we're on localhost for development
        const isLocalhost = window.location.hostname === 'localhost';
        const cmsUrl = isLocalhost 
          ? 'http://localhost:4028/de/admin'  // Vite admin panel in development
          : 'https://cms.braunundeyer.de';     // Production CMS subdomain
        
        // Try different methods to ensure navigation works
        try {
          // Method 1: Direct assignment
          window.location.href = cmsUrl;
        } catch (e) {
          // Method 2: Create and click a link as fallback
          const link = document.createElement('a');
          link.href = cmsUrl;
          link.target = '_self';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        return 0; // Reset count
      } else {
        // Reset count after 1 second
        clickTimeoutRef.current = setTimeout(() => {
          setClickCount(0);
        }, 1000);
        
        return newClickCount;
      }
    });
  };

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-primary text-white py-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <motion.div 
                className="w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Triangle size={20} color="white" />
              </motion.div>
              <div className="font-heading font-semibold text-xl">Braun & Eyer</div>
            </div>
            <p className="font-body text-white/80 mb-4">
              Außergewöhnliche Architekturlösungen, die Innovation mit Funktionalität verbinden.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a 
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200"
                    whileHover={{ y: -3 }}
                    aria-label={social.label}
                  >
                    <Icon size={16} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-heading font-medium text-lg mb-4">Leistungen</h3>
            <ul className="space-y-2 font-body">
              <li>
                <Link 
                  href={`/${lang}/leistungen`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Neubau
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${lang}/leistungen`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Altbausanierung
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${lang}/leistungen`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Innenarchitektur
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${lang}/leistungen`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Beratung
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-heading font-medium text-lg mb-4">Unternehmen</h3>
            <ul className="space-y-2 font-body">
              <li>
                <Link 
                  href={`/${lang}/uber-uns`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${lang}/projekte`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Projekte
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${lang}/kontakt`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Karriere
                </a>
              </li>
              <li>
                <Link 
                  href={`/${lang}/impressum`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${lang}/datenschutz`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-heading font-medium text-lg mb-4">Kontakt</h3>
            <div className="space-y-3 font-body text-white/80">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  Mainzerstrasse 29<br />
                  66111 Saarbrücken
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="flex-shrink-0" />
                <span>+49 681 95417488</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@braunundeyer.de</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p 
            className="font-body text-white/60 cursor-pointer select-none transition-colors duration-200 hover:text-white/80"
            onClick={handleCopyrightClick}
            style={{ userSelect: 'none' }}
          >
            © {currentYear} Braun & Eyer Architekturbüro. Alle Rechte vorbehalten.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}