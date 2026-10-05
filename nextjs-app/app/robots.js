import { SITE_URL } from '@/lib/site';

/**
 * One rule group for every crawler. CSS/JS (/_next/) and query-string URLs
 * stay crawlable so pages can be rendered and images indexed; pages that must
 * not be indexed use `noindex` (lib/seo.js), not robots.txt.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cms', '/admin'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
