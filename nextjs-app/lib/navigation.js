// Navigation settings fetcher
export async function getNavigationSettings(lang = 'de') {
  // Skip fetching during build time to avoid errors
  if (!process.env.BACKEND_URL) {
    return getDefaultNavigation(lang);
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:3001';
    const response = await fetch(`${backendUrl}/api/content/navigation?language=de`, {
      next: { revalidate: 60 }, // ISR with 60-second revalidation
      cache: 'force-cache'
    });

    if (!response.ok) {
      console.log('Navigation settings not found, using defaults');
      return getDefaultNavigation(lang);
    }

    const data = await response.json();
    if (data && data.value) {
      const navigation = JSON.parse(data.value);
      
      // Process navigation items for the current language
      const processedNavigation = {
        mainMenu: processNavItems(navigation.mainMenu || [], lang),
        footerMenu: processNavItems(navigation.footerMenu || [], lang),
        mobileMenu: processNavItems(navigation.mobileMenu || navigation.mainMenu || [], lang)
      };
      
      return processedNavigation;
    }
    
    return getDefaultNavigation(lang);
  } catch (error) {
    console.error('Error fetching navigation settings:', error);
    return getDefaultNavigation(lang);
  }
}

function processNavItems(items, lang) {
  return items
    .filter(item => item.visible !== false) // Only show visible items
    .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
    .map(item => ({
      id: item.id,
      href: item.url?.[lang] || item.url?.de || '#',
      label: item.label?.[lang] || item.label?.de || 'Link',
      icon: item.icon,
      type: item.type,
      visible: item.visible,
      children: item.children ? processNavItems(item.children, lang) : []
    }));
}

function getDefaultNavigation(lang) {
  const defaults = {
    mainMenu: [
      { 
        id: '1',
        href: `/${lang}/homepage`, 
        label: getLabel('home', lang), 
        icon: 'Home',
        visible: true 
      },
      { 
        id: '2',
        href: `/${lang}/projekte`, 
        label: getLabel('projects', lang), 
        icon: 'Building2',
        visible: true 
      },
      { 
        id: '3',
        href: `/${lang}/gallery`, 
        label: getLabel('gallery', lang), 
        icon: 'Images',
        visible: true 
      },
      { 
        id: '4',
        href: `/${lang}/uber-uns`, 
        label: getLabel('about', lang), 
        icon: 'Users',
        visible: true 
      },
      { 
        id: '5',
        href: `/${lang}/leistungen`, 
        label: getLabel('services', lang), 
        icon: 'Settings',
        visible: true 
      },
      { 
        id: '6',
        href: `/${lang}/kontakt`, 
        label: getLabel('contact', lang), 
        icon: 'Mail',
        visible: true 
      }
    ],
    footerMenu: [
      { 
        id: 'f1',
        href: `/${lang}/impressum`, 
        label: getLabel('imprint', lang),
        visible: true 
      },
      { 
        id: 'f2',
        href: `/${lang}/datenschutz`, 
        label: getLabel('privacy', lang),
        visible: true 
      }
    ],
    mobileMenu: [] // Will use mainMenu if empty
  };
  
  // Use mainMenu for mobileMenu if not set
  defaults.mobileMenu = defaults.mainMenu;
  
  return defaults;
}

function getLabel(key, lang) {
  const labels = {
    home: { 
      de: 'Startseite', 
      en: 'Home', 
      fr: 'Accueil', 
      it: 'Home', 
      es: 'Inicio' 
    },
    projects: { 
      de: 'Projekte', 
      en: 'Projects', 
      fr: 'Projets', 
      it: 'Progetti', 
      es: 'Proyectos' 
    },
    gallery: { 
      de: 'Galerie', 
      en: 'Gallery', 
      fr: 'Galerie', 
      it: 'Galleria', 
      es: 'Galería' 
    },
    about: { 
      de: 'Über Uns', 
      en: 'About Us', 
      fr: 'À propos', 
      it: 'Chi siamo', 
      es: 'Nosotros' 
    },
    services: { 
      de: 'Leistungen', 
      en: 'Services', 
      fr: 'Services', 
      it: 'Servizi', 
      es: 'Servicios' 
    },
    contact: { 
      de: 'Kontakt', 
      en: 'Contact', 
      fr: 'Contact', 
      it: 'Contatto', 
      es: 'Contacto' 
    },
    imprint: { 
      de: 'Impressum', 
      en: 'Imprint', 
      fr: 'Mentions légales', 
      it: 'Impronta', 
      es: 'Aviso legal' 
    },
    privacy: { 
      de: 'Datenschutz', 
      en: 'Privacy', 
      fr: 'Confidentialité', 
      it: 'Privacy', 
      es: 'Privacidad' 
    }
  };
  
  return labels[key]?.[lang] || labels[key]?.de || key;
}