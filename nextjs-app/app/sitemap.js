import {
  INDEXABLE_LOCALES,
  ROUTES,
  buildLanguageAlternates,
  localizedUrl,
} from '@/lib/seo';

/**
 * XML sitemap generated from the live project list.
 *
 * - Only indexable route/locale combinations (lib/seo.js INDEXABLE_LOCALES).
 * - Real project ids from the API (only published projects).
 * - lastModified from the project's `updated_at`.
 * - Regenerated at most once per hour (ISR), so new projects show up without
 *   a rebuild.
 */
export const revalidate = 3600;

function apiBase() {
  if (process.env.BACKEND_URL) return `${process.env.BACKEND_URL.replace(/\/$/, '')}/api`;
  return (process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
}

function parseDate(value) {
  if (!value) return undefined;
  // SQLite CURRENT_TIMESTAMP format "YYYY-MM-DD HH:MM:SS" is UTC.
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value) ? `${value.replace(' ', 'T')}Z` : value;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function getPublishedProjects() {
  try {
    const res = await fetch(`${apiBase()}/projects?status=published`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    return projects.filter((p) => p && p.id != null && (!p.status || p.status === 'published'));
  } catch (error) {
    console.error('sitemap: could not load projects', error?.message || error);
    return [];
  }
}

function entriesFor(route, path, { lastModified, changeFrequency, priority }) {
  const languages = buildLanguageAlternates(route, path);
  return (INDEXABLE_LOCALES[route] || []).map((lang) => ({
    url: localizedUrl(lang, path),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
    ...(languages ? { alternates: { languages } } : {}),
  }));
}

export default async function sitemap() {
  const projects = await getPublishedProjects();

  const projectDates = projects.map((p) => parseDate(p.updated_at)).filter(Boolean);
  const newestProject = projectDates.length
    ? new Date(Math.max(...projectDates.map((d) => d.getTime())))
    : undefined;

  const staticRoutes = [
    { route: 'home', lastModified: newestProject, changeFrequency: 'weekly', priority: 1 },
    { route: 'projects', lastModified: newestProject, changeFrequency: 'weekly', priority: 0.9 },
    { route: 'services', changeFrequency: 'monthly', priority: 0.8 },
    { route: 'about', changeFrequency: 'monthly', priority: 0.7 },
    { route: 'contact', changeFrequency: 'yearly', priority: 0.7 },
    { route: 'gallery', changeFrequency: 'monthly', priority: 0.5 },
    { route: 'imprint', changeFrequency: 'yearly', priority: 0.2 },
    { route: 'privacy', changeFrequency: 'yearly', priority: 0.2 },
  ];

  return [
    ...staticRoutes.flatMap(({ route, ...opts }) => entriesFor(route, ROUTES[route], opts)),
    ...projects.flatMap((p) =>
      entriesFor('project', `/projekte/${p.id}`, {
        lastModified: parseDate(p.updated_at),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    ),
  ];
}
