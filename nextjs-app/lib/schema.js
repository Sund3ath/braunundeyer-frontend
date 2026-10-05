/**
 * Schema.org JSON-LD builders.
 *
 * One business entity only: `ArchitectureFirm` (a subtype of LocalBusiness),
 * referenced everywhere by its @id. All facts come from lib/site.js.
 *
 * - organizationGraph(lang): ArchitectureFirm + WebSite (rendered by the
 *   [lang] layout on every page).
 * - webPageGraph(...): WebPage + BreadcrumbList for a single page.
 * - projectGraph(...): adds a CreativeWork node for a project page.
 *
 * Deliberately NOT emitted: SearchAction (the site has no search, and Google
 * retired the sitelinks search box), Review/AggregateRating (self-collected
 * reviews are ignored and risky), unverified `sameAs` profiles, priceRange.
 */
import { SITE, SITE_URL, absoluteUrl, publicAssetUrl } from './site';
import { getSeoCopy } from './seo-copy';
import { INDEXABLE_LOCALES, localizedUrl } from './seo';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const LANG_TAG = { de: 'de-DE', en: 'en', fr: 'fr', it: 'it', es: 'es', pt: 'pt' };

function openingHoursSpecification() {
  // Group consecutive days with identical hours into one specification.
  const groups = [];
  for (const d of SITE.openingHours) {
    if (d.closed || !d.open || !d.close) continue;
    const last = groups[groups.length - 1];
    if (last && last.opens === d.open && last.closes === d.close) {
      last.dayOfWeek.push(d.day);
    } else {
      groups.push({ dayOfWeek: [d.day], opens: d.open, closes: d.close });
    }
  }
  return groups.map((g) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: g.dayOfWeek.length === 1 ? g.dayOfWeek[0] : g.dayOfWeek,
    opens: g.opens,
    closes: g.closes,
  }));
}

export function organizationNode(lang = 'de') {
  const copy = getSeoCopy(lang);
  const sameAs = (SITE.socialProfiles || []).map((p) => p.url).filter(Boolean);
  return {
    '@type': 'ArchitectureFirm',
    '@id': ORG_ID,
    name: SITE.legalName,
    alternateName: SITE.alternateNames,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: absoluteUrl(SITE.assets.logo.path),
      width: SITE.assets.logo.width,
      height: SITE.assets.logo.height,
      caption: SITE.name,
    },
    image: absoluteUrl(SITE.assets.ogImage.path),
    description: copy.orgDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    telephone: SITE.phone.display,
    faxNumber: SITE.fax.display,
    email: SITE.email,
    foundingDate: SITE.foundingYear,
    founder: SITE.founders.map((f) => ({ '@type': 'Person', name: f.name, jobTitle: f.jobTitle })),
    memberOf: { '@type': 'Organization', name: SITE.chamber.name, url: SITE.chamber.url },
    areaServed: [
      { '@type': 'City', name: 'Saarbrücken' },
      { '@type': 'State', name: 'Saarland' },
    ],
    openingHoursSpecification: openingHoursSpecification(),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteNode() {
  const languages = Array.from(new Set(Object.values(INDEXABLE_LOCALES).flat()));
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE.name,
    publisher: { '@id': ORG_ID },
    inLanguage: languages.map((l) => LANG_TAG[l] || l),
  };
}

export function organizationGraph(lang = 'de') {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(lang), websiteNode()],
  };
}

/**
 * @param {object} opts
 * @param {string} opts.lang
 * @param {string} opts.path   path below /{lang}
 * @param {string} opts.name   page name (usually the h1 / title)
 * @param {string} [opts.description]
 * @param {{name:string, path?:string}[]} opts.breadcrumbs  path relative to /{lang}; last item = current page
 * @param {'WebPage'|'CollectionPage'|'AboutPage'|'ContactPage'} [opts.type]
 */
export function webPageNodes({ lang, path = '', name, description, breadcrumbs = [], type = 'WebPage' }) {
  const url = localizedUrl(lang, path);
  const nodes = [];
  const breadcrumbId = `${url}#breadcrumb`;

  nodes.push({
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    ...(description ? { description } : {}),
    inLanguage: LANG_TAG[lang] || lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    ...(breadcrumbs.length > 1 ? { breadcrumb: { '@id': breadcrumbId } } : {}),
  });

  if (breadcrumbs.length > 1) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: localizedUrl(lang, b.path ?? path),
      })),
    });
  }
  return nodes;
}

export function webPageGraph(opts) {
  return { '@context': 'https://schema.org', '@graph': webPageNodes(opts) };
}

/** Standard breadcrumb trail: Startseite > {page}. */
export function simpleBreadcrumbs(lang, routeKey, path) {
  const b = getSeoCopy(lang).breadcrumb;
  return [
    { name: b.home, path: '' },
    { name: b[routeKey], path },
  ];
}

const PLACEHOLDER_LOCATIONS = new Set(['divers', 'diverse', '-', '.']);

export function isMeaningfulLocation(location) {
  return Boolean(location) && !PLACEHOLDER_LOCATIONS.has(String(location).trim().toLowerCase());
}

/**
 * Project detail page: WebPage + BreadcrumbList + CreativeWork.
 */
export function projectGraph({ lang, project, description }) {
  const path = `/projekte/${project.id}`;
  const url = localizedUrl(lang, path);
  const b = getSeoCopy(lang).breadcrumb;
  const images = Array.from(
    new Set([project.image, ...(project.images || [])].map(publicAssetUrl).filter(Boolean))
  ).slice(0, 10);

  const creativeWork = {
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: project.title,
    url,
    ...(description ? { description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    ...(project.category ? { genre: project.category } : {}),
    ...(isMeaningfulLocation(project.location)
      ? { locationCreated: { '@type': 'Place', name: project.location } }
      : {}),
    creator: { '@id': ORG_ID },
    inLanguage: LANG_TAG[lang] || lang,
    mainEntityOfPage: { '@id': `${url}#webpage` },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...webPageNodes({
        lang,
        path,
        name: project.title,
        description,
        breadcrumbs: [
          { name: b.home, path: '' },
          { name: b.projects, path: '/projekte' },
          { name: project.title, path },
        ],
      }),
      creativeWork,
    ],
  };
}

/** Serialize JSON-LD safely for a <script> tag. */
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
