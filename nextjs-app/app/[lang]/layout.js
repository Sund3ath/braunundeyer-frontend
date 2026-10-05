import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n';
import { fontVariables } from '@/lib/fonts';
import { SITE, SITE_URL, absoluteUrl } from '@/lib/site';
import { getSeoCopy } from '@/lib/seo-copy';
import { isValidLocale } from '@/lib/seo';
import { organizationGraph } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteNavigation } from '@/lib/navigation';
import { getUiCopy } from '@/lib/ui-copy';
import { INTRO_BOOT } from '@/lib/intro';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

/**
 * Layout-level metadata: only values that are the same for every page of a
 * language. Canonical, hreflang, robots and og:url are set per page via
 * lib/seo.js (pageMetadata). Setting them here would make every page inherit
 * the language root as canonical.
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const copy = getSeoCopy(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: copy.defaultTitle,
      template: `%s | ${copy.brand}`,
    },
    description: copy.defaultDescription,
    applicationName: SITE.name,
    authors: SITE.founders.map((f) => ({ name: f.name, url: `${SITE_URL}/de/uber-uns` })),
    creator: SITE.legalName,
    publisher: SITE.legalName,
    category: 'Architecture',
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      siteName: copy.brand,
      type: 'website',
      images: [{ url: absoluteUrl(SITE.assets.ogImage.path), width: 1200, height: 630, alt: SITE.name }],
    },
    other: {
      'geo.region': `DE-${SITE.address.regionCode}`,
      'geo.placename': SITE.address.city,
      'geo.position': `${SITE.geo.latitude};${SITE.geo.longitude}`,
      ICBM: `${SITE.geo.latitude}, ${SITE.geo.longitude}`,
    },
  };
}

export default async function LanguageLayout({ children, params }) {
  const { lang } = await params;

  // Any first path segment that is not a supported locale (e.g. /foo/…,
  // /og-image.jpg when the file is missing, /cms-test) is a real 404 instead
  // of a soft 200 page rendered with lang="foo".
  if (!isValidLocale(lang)) {
    notFound();
  }

  const nav = await getSiteNavigation(lang);
  const copy = getUiCopy(lang);

  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Flags a first, direct visit of /{lang} for the intro overlay
            (components/home/EntryOverlay.js); never hides content. */}
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        <JsonLd data={organizationGraph(lang)} />
        {/* Without JS the fade-in never runs: keep photos visible. */}
        <noscript>
          <style>{'.ph>img,.tile img,.cell img{opacity:1!important}'}</style>
        </noscript>
      </head>
      <body>
        <a className="skip" href="#main">{copy.common.skip}</a>
        <Header lang={lang} items={nav.items} mobileItems={nav.mobileItems} copy={copy.common} />
        {children}
        <Footer lang={lang} copy={copy} pages={nav.pages} legal={nav.legal} />
        <Analytics />
        <CookieConsent copy={copy.cookie} privacyHref={`/${lang}/datenschutz`} />
      </body>
    </html>
  );
}
