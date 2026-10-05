import { NextResponse } from 'next/server';

const locales = ['de', 'en', 'fr', 'it', 'es', 'pt'];
const defaultLocale = 'de';

// First path segments of real pages. Only these (and "/") get a locale prefix
// added; any other locale-less path (/foo/bar, /cms-test, /admin) falls through
// to the router, where app/[lang]/layout.js returns a real 404 instead of a
// redirect chain that ends in a 404.
const KNOWN_SEGMENTS = new Set([
  'homepage',
  'projekte',
  'leistungen',
  'uber-uns',
  'kontakt',
  'impressum',
  'datenschutz',
  'gallery',
]);

function detectLocale(request) {
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const detected = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0].toLowerCase())
      .find((lang) => locales.includes(lang));
    if (detected) return detected;
  }
  return defaultLocale;
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  const firstSegment = pathname.split('/')[1] || '';
  if (pathname !== '/' && !KNOWN_SEGMENTS.has(firstSegment)) {
    // Not a page we know: let the router answer (404).
    return;
  }

  const locale = detectLocale(request);
  // "/homepage" (old URL) -> "/{locale}" directly, no second hop.
  const rest = firstSegment === 'homepage' ? pathname.slice('/homepage'.length) : pathname;
  const target = new URL(`/${locale}${rest === '/' ? '' : rest}`, request.url);
  target.search = search;

  // Default locale (what crawlers without Accept-Language get): permanent 308.
  // Language-negotiated redirects stay temporary (307) and vary by header so
  // caches don't serve one visitor's language to another.
  if (locale === defaultLocale) {
    return NextResponse.redirect(target, 308);
  }
  const response = NextResponse.redirect(target, 307);
  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  matcher: [
    // Skip Next internals, API routes and anything that looks like a file
    // (has a dot). `cms` is intentionally NOT excluded any more.
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
