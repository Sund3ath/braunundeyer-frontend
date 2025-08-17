'use client';

import React from 'react';
import Head from 'next/head';

const SEO = ({ 
  title = 'Braun & Eyer Architekten | Architekturbüro Saarbrücken',
  description = 'Braun & Eyer Architekten GbR - Ihr Architekturbüro in Saarbrücken. Spezialisiert auf Neubau, Altbausanierung, Denkmalschutz und innovative Architektur. Seit 1999 gestalten wir Räume mit Leidenschaft.',
  keywords = 'Architekten Saarbrücken, Braun Eyer, Architekturbüro, Neubau, Altbausanierung, Denkmalschutz, Christian Braun, Patric Eyer, Architektur Saarland',
  image = 'https://braunundeyer.de/og-image.jpg',
  url = 'https://braunundeyer.de',
  type = 'website',
  lang = 'de',
  structuredData = null,
  noindex = false,
  canonical = null
}) => {
  // Construct full title
  const fullTitle = title.includes('Braun & Eyer') ? title : `${title} | Braun & Eyer Architekten`;
  
  // Language-specific meta tags
  const langMeta = {
    de: {
      locale: 'de_DE',
      siteName: 'Braun & Eyer Architekten'
    },
    en: {
      locale: 'en_US',
      siteName: 'Braun & Eyer Architects'
    },
    fr: {
      locale: 'fr_FR',
      siteName: 'Braun & Eyer Architectes'
    },
    it: {
      locale: 'it_IT',
      siteName: 'Braun & Eyer Architetti'
    },
    es: {
      locale: 'es_ES',
      siteName: 'Braun & Eyer Arquitectos'
    }
  };

  const currentLangMeta = langMeta[lang] || langMeta.de;

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "ArchitectureFirm",
    "name": "Braun & Eyer Architekten GbR",
    "alternateName": "Braun und Eyer",
    "url": "https://braunundeyer.de",
    "logo": "https://braunundeyer.de/logo.png",
    "description": "Architekturbüro in Saarbrücken spezialisiert auf Neubau, Altbausanierung und Denkmalschutz",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mainzerstraße 29",
      "addressLocality": "Saarbrücken",
      "postalCode": "66111",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.2341,
      "longitude": 6.9895
    },
    "telephone": "+496819541748",
    "email": "info@braunundeyer.de",
    "foundingDate": "1999",
    "founders": [
      {
        "@type": "Person",
        "name": "Christian F. Braun",
        "jobTitle": "Dipl.-Ing. Architekt"
      },
      {
        "@type": "Person",
        "name": "Patric Eyer",
        "jobTitle": "Dipl.-Ing. Architekt"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/braunundeyer",
      "https://www.linkedin.com/company/braun-eyer-architekten"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Architekturleistungen",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Neubau",
            "description": "Planung und Realisierung von Neubauprojekten"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Altbausanierung",
            "description": "Sanierung und Modernisierung historischer Gebäude"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Denkmalschutz",
            "description": "Fachgerechte Sanierung denkmalgeschützter Gebäude"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Innenarchitektur",
            "description": "Gestaltung und Planung von Innenräumen"
          }
        }
      ]
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Braun & Eyer Architekten GbR" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      
      {/* Language and Locale */}
      <html lang={lang} />
      <meta property="og:locale" content={currentLangMeta.locale} />
      <meta name="language" content={lang} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots Meta */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={currentLangMeta.siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:creator" content="@braunundeyer" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#059669" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Braun & Eyer" />
      <meta name="application-name" content="Braun & Eyer Architekten" />
      <meta name="msapplication-TileColor" content="#059669" />
      
      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="DE-SL" />
      <meta name="geo.placename" content="Saarbrücken" />
      <meta name="geo.position" content="49.2341;6.9895" />
      <meta name="ICBM" content="49.2341, 6.9895" />
      
      {/* Performance and Security */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data / JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finalStructuredData) }}
      />
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Alternative Languages */}
      <link rel="alternate" hrefLang="de" href="https://braunundeyer.de/de" />
      <link rel="alternate" hrefLang="en" href="https://braunundeyer.de/en" />
      <link rel="alternate" hrefLang="fr" href="https://braunundeyer.de/fr" />
      <link rel="alternate" hrefLang="it" href="https://braunundeyer.de/it" />
      <link rel="alternate" hrefLang="es" href="https://braunundeyer.de/es" />
      <link rel="alternate" hrefLang="x-default" href="https://braunundeyer.de" />
    </Head>
  );
};

export default SEO;