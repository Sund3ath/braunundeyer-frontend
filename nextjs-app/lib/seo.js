/**
 * Shared SEO metadata builder (Next.js App Router Metadata API).
 *
 * One place decides, per route and language:
 *  - the self-referencing canonical URL,
 *  - hreflang alternates (only between indexable locales, plus x-default),
 *  - robots (index vs. noindex,follow),
 *  - Open Graph / Twitter cards.
 *
 * The sitemap (app/sitemap.js) uses the same helpers, so on-page hreflang and
 * sitemap hreflang can never drift apart.
 */
import { i18n } from './i18n';
import { SITE, SITE_URL, absoluteUrl } from './site';
import { getSeoCopy } from './seo-copy';

export { SITE_URL };
export const LOCALES = i18n.locales;
export const DEFAULT_LOCALE = i18n.defaultLocale;

/** Route keys -> path below /{lang}. */
export const ROUTES = {
  home: '',
  projects: '/projekte',
  services: '/leistungen',
  about: '/uber-uns',
  contact: '/kontakt',
  gallery: '/gallery',
  imprint: '/impressum',
  privacy: '/datenschutz',
  project: '/projekte', // + `/${id}`
};

/**
 * Which locales may be indexed, per route.
 *
 * A locale is only indexable when the *page content* (UI strings + CMS data)
 * is really in that language. Today the non-German locales still render
 * German CMS content (project titles/descriptions, hero slides, service
 * texts, team bios, opening-hours day names) and the legal pages are German
 * only, so they would be near-duplicates with wrong language signals.
 *
 * Non-indexable locales get `robots: noindex, follow`, are left out of
 * hreflang and out of the sitemap, and stay reachable for visitors.
 *
 * To enable a language for a route once it is translated, add it here, e.g.
 * `services: ['de', 'fr']`. Nothing else needs to change.
 */
export const INDEXABLE_LOCALES = {
  home: ['de'],
  projects: ['de'],
  project: ['de'],
  services: ['de'],
  about: ['de'],
  contact: ['de'],
  imprint: ['de'],
  privacy: ['de'],
  // Gallery: server-rendered since the redesign (every photo is in the HTML
  // with descriptive alt text, components/gallery/GalleryView.js), so the
  // German version is indexable like the other routes. Filtered views
  // (?kategorie=...) canonicalise to /de/gallery.
  gallery: ['de'],
};

const OG_LOCALE = { de: 'de_DE', en: 'en_GB', fr: 'fr_FR', it: 'it_IT', es: 'es_ES', pt: 'pt_PT' };

export function isValidLocale(lang) {
  return LOCALES.includes(lang);
}

export function isIndexable(route, lang) {
  return (INDEXABLE_LOCALES[route] || []).includes(lang);
}

export function localizedUrl(lang, path = '') {
  return `${SITE_URL}/${lang}${path}`;
}

/**
 * hreflang map for a route: only indexable locales, plus x-default pointing to
 * the default-locale version (when that one is indexable).
 * Returns undefined when nothing on the route is indexable.
 */
export function buildLanguageAlternates(route, path = '') {
  const indexable = INDEXABLE_LOCALES[route] || [];
  if (indexable.length === 0) return undefined;
  const languages = Object.fromEntries(indexable.map((l) => [l, localizedUrl(l, path)]));
  const xDefault = indexable.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : indexable[0];
  languages['x-default'] = localizedUrl(xDefault, path);
  return languages;
}

export function buildAlternates(route, lang, path = '') {
  const languages = buildLanguageAlternates(route, path);
  return {
    canonical: localizedUrl(lang, path),
    ...(languages ? { languages } : {}),
  };
}

/** Trim text to a meta-description friendly length on a word boundary. */
export function summarize(text, max = 155) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:–-]+$/, '')}…`;
}

const DEFAULT_OG_IMAGE = {
  url: absoluteUrl(SITE.assets.ogImage.path),
  width: SITE.assets.ogImage.width,
  height: SITE.assets.ogImage.height,
  alt: `${SITE.name} – Architekturbüro in Saarbrücken`,
};

/**
 * Build the full Metadata object for a page.
 *
 * @param {object} opts
 * @param {string} opts.lang         current locale
 * @param {string} opts.route        key of ROUTES / INDEXABLE_LOCALES
 * @param {string} [opts.path]       path below /{lang} (defaults to ROUTES[route])
 * @param {string} opts.title
 * @param {boolean} [opts.absoluteTitle] bypass the layout's title template
 * @param {string} opts.description
 * @param {string|{url:string,width?:number,height?:number,alt?:string}} [opts.image]
 * @param {'website'|'article'} [opts.type]
 * @param {boolean} [opts.noindex]   force noindex (e.g. missing data)
 */
export function pageMetadata({
  lang,
  route,
  path,
  title,
  absoluteTitle = false,
  description,
  image,
  type = 'website',
  noindex = false,
}) {
  const resolvedPath = path ?? ROUTES[route] ?? '';
  const indexable = !noindex && isIndexable(route, lang);
  const url = localizedUrl(lang, resolvedPath);
  const copy = getSeoCopy(lang);
  const fullTitle = absoluteTitle ? title : `${title} | ${copy.brand}`;

  const ogImage = image
    ? (typeof image === 'string' ? { url: image, alt: title } : { alt: title, ...image })
    : DEFAULT_OG_IMAGE;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: buildAlternates(route, lang, resolvedPath),
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
        }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: copy.brand,
      locale: OG_LOCALE[lang] || OG_LOCALE.de,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}

/** Convenience for static routes whose copy lives in lib/seo-copy.js. */
export function staticPageMetadata(route, lang) {
  const copy = getSeoCopy(lang)[route];
  return pageMetadata({
    lang,
    route,
    title: copy.title,
    absoluteTitle: Boolean(copy.absoluteTitle),
    description: copy.description,
  });
}
