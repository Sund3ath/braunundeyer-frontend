import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Icon from './AppIcon';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);
  
  // Get current language from URL or i18n
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';

  // Handle triple-click on footer copyright for admin access
  const handleCopyrightClick = () => {
    // Clear previous timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    setClickCount(prev => prev + 1);
    
    if (clickCount >= 2) { // Triple click
      navigate('/admin/login');
      setClickCount(0);
    } else {
      // Reset count after 1 second
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1000);
    }
  };

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
                <Icon name="Triangle" size={20} color="white" />
              </motion.div>
              <div className="font-heading font-semibold text-xl">Braun & Eyer</div>
            </div>
            <p className="font-body text-white/80 mb-4">
              Außergewöhnliche Architekturlösungen, die Innovation mit Funktionalität verbinden.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'Linkedin'].map((social) => (
                <motion.a 
                  key={social}
                  href="#"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200"
                  whileHover={{ y: -3 }}
                  aria-label={social}
                >
                  <Icon name={social} size={16} />
                </motion.a>
              ))}
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
                  to={`/${currentLang}/leistungen`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Neubau
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${currentLang}/leistungen`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Altbausanierung
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${currentLang}/leistungen`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Innenarchitektur
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${currentLang}/leistungen`} 
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
                  to={`/${currentLang}/uber-uns`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${currentLang}/projekte`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Projekte
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${currentLang}/kontakt`} 
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
                  to={`/${currentLang}/impressum`} 
                  className="text-white/80 hover:text-accent transition-colors duration-200"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${currentLang}/datenschutz`} 
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
                <Icon name="MapPin" size={16} className="mt-1 flex-shrink-0" />
                <span>
                  Mainzerstrasse 29<br />
                  66111 Saarbrücken
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={16} className="flex-shrink-0" />
                <span>+49 681 95417488</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={16} className="flex-shrink-0" />
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
            © {new Date().getFullYear()} Braun & Eyer Architekturbüro. Alle Rechte vorbehalten.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;