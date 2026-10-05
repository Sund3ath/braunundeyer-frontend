import './globals.css';
import { SITE_URL } from '@/lib/site';
import { getSeoCopy } from '@/lib/seo-copy';

/**
 * Root layout: intentionally a pass-through.
 *
 * <html>/<body> are rendered by app/[lang]/layout.js so the server HTML carries
 * the correct per-locale `lang` attribute (<html lang="de">, <html lang="en">…).
 * The only other page outside [lang] is app/not-found.js, which renders its own
 * <html lang="de">. Route handlers (sitemap.xml, robots.txt, /api/*) need no
 * layout. This is the documented pattern for locale-prefixed App Router sites.
 */

const de = getSeoCopy('de');

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: de.defaultTitle,
  description: de.defaultDescription,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return children;
}
