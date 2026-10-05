import { unstable_cache } from 'next/cache';

// CMS navigation (content key "navigation"). Cached for 60 s including the
// "not configured" (404) answer, so the site chrome, which renders on every
// page and on every request of dynamic pages, makes at most one API call per
// minute (the backend rate-limits per IP). Network errors are not cached.
const fetchNavigationValue = unstable_cache(
  async () => {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:3001';
    const response = await fetch(`${backendUrl}/api/content/navigation?language=de`, {
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Navigation API responded ${response.status}`);
    const data = await response.json();
    return data?.value ? JSON.parse(data.value) : null;
  },
  ['cms-navigation-v1'],
  { revalidate: 60 },
);

// Navigation settings fetcher
export async function getNavigationSettings(lang = 'de') {
  // Skip fetching during build time to avoid errors
  if (!process.env.BACKEND_URL) {
    return getDefaultNavigation(lang);
  }

  try {
    const navigation = await fetchNavigationValue();
    if (navigation) {
      // Process navigation items for the current language
      return {
        mainMenu: processNavItems(navigation.mainMenu || [], lang),
        footerMenu: processNavItems(navigation.footerMenu || [], lang),
        mobileMenu: processNavItems(navigation.mobileMenu || navigation.mainMenu || [], lang),
      };
    }
    return getDefaultNavigation(lang);
  } catch (error) {
    console.error('Error fetching navigation settings:', error.message);
    return getDefaultNavigation(lang);
  }
}

// The homepage moved from /{lang}/homepage to /{lang}; normalise any CMS-stored
// links so navigation never points at the (308-redirecting) old URL.
function normalizeHref(href) {
  if (typeof href !== 'string') return href;
  return href.replace(/^(\/[a-z]{2})\/homepage\/?(?=$|[?#])/, '$1');
}

function processNavItems(items, lang) {
  return items
    .filter(item => item.visible !== false) // Only show visible items
    .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
    .map(item => ({
      id: item.id,
      href: normalizeHref(item.url?.[lang] || item.url?.de || '#'),
      label: item.label?.[lang] || item.label?.de || 'Link',
      icon: item.icon,
      type: item.type,
      visible: item.visible,
      children: item.children ? processNavItems(item.children, lang) : []
    }));
}

function getDefaultNavigation(lang) {
  // Order and labels follow the redesign (design REVIEW §1.7 / §2.6):
  // Projekte, Galerie, Leistungen, Büro, Kontakt. "Startseite" is listed for
  // the mobile sheet; the desktop bar drops it (the wordmark links home).
  const item = (id, key, path) => ({ id, href: `/${lang}${path}`, label: getLabel(key, lang), visible: true });
  const mainMenu = [
    item('1', 'home', ''),
    item('2', 'projects', '/projekte'),
    item('3', 'gallery', '/gallery'),
    item('4', 'services', '/leistungen'),
    item('5', 'about', '/uber-uns'),
    item('6', 'contact', '/kontakt'),
  ];
  return {
    mainMenu,
    footerMenu: [item('f1', 'imprint', '/impressum'), item('f2', 'privacy', '/datenschutz')],
    mobileMenu: mainMenu,
  };
}

const LABELS = {
  home: { de: 'Startseite', en: 'Home', fr: 'Accueil', it: 'Home', es: 'Inicio', pt: 'Início' },
  projects: { de: 'Projekte', en: 'Projects', fr: 'Projets', it: 'Progetti', es: 'Proyectos', pt: 'Projetos' },
  gallery: { de: 'Galerie', en: 'Gallery', fr: 'Galerie', it: 'Galleria', es: 'Galería', pt: 'Galeria' },
  about: { de: 'Büro', en: 'Office', fr: 'Agence', it: 'Studio', es: 'Estudio', pt: 'Atelier' },
  services: { de: 'Leistungen', en: 'Services', fr: 'Prestations', it: 'Servizi', es: 'Servicios', pt: 'Serviços' },
  contact: { de: 'Kontakt', en: 'Contact', fr: 'Contact', it: 'Contatti', es: 'Contacto', pt: 'Contacto' },
  imprint: { de: 'Impressum', en: 'Legal notice', fr: 'Mentions légales', it: 'Note legali', es: 'Aviso legal', pt: 'Informação legal' },
  privacy: { de: 'Datenschutz', en: 'Privacy', fr: 'Confidentialité', it: 'Privacy', es: 'Privacidad', pt: 'Privacidade' },
};

function getLabel(key, lang) {
  return LABELS[key]?.[lang] || LABELS[key]?.de || key;
}

/**
 * Navigation as the site chrome renders it (Header + Footer).
 * CMS menus (content key "navigation") win when present; defaults otherwise.
 */
export async function getSiteNavigation(lang = 'de') {
  const nav = await getNavigationSettings(lang);
  const home = `/${lang}`;
  const flat = (items = []) => items.filter((i) => i && i.href && i.href !== '#').map((i) => ({ href: i.href, label: i.label }));
  const main = flat(nav.mainMenu);
  const mobile = flat(nav.mobileMenu?.length ? nav.mobileMenu : nav.mainMenu);
  const legal = flat(nav.footerMenu);
  return {
    items: main.filter((i) => i.href !== home),
    mobileItems: mobile.some((i) => i.href === home) ? mobile : [{ href: home, label: getLabel('home', lang) }, ...mobile],
    pages: main.filter((i) => i.href !== home),
    legal: legal.length ? legal : flat(getDefaultNavigation(lang).footerMenu),
  };
}
