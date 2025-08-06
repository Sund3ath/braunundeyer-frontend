import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title = 'Braun & Eyer Architekturbüro | Neubau und Altbausanierung',
  description = 'Professionelles Architekturbüro für innovative Neubauprojekte und fachgerechte Altbausanierung. Wir verbinden moderne Architektur mit nachhaltiger Bauweise.',
  keywords = 'Architekt, Architekturbüro, Neubau, Altbausanierung, Bauplanung, Architektur, Sanierung, Modernisierung, nachhaltiges Bauen, Energieeffizienz',
  image = '/assets/images/og-image.jpg',
  url = window.location.href,
  type = 'website',
  author = 'Braun & Eyer Architekturbüro',
  publishedDate,
  modifiedDate,
  structuredData,
  noindex = false,
  canonical,
  alternates = []
}) => {
  const siteUrl = window.location.origin;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const canonicalUrl = canonical || url;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "ArchitectAction",
    "name": "Braun & Eyer Architekturbüro",
    "description": description,
    "url": siteUrl,
    "logo": `${siteUrl}/assets/images/logo.png`,
    "sameAs": [
      "https://www.facebook.com/brauneyer",
      "https://www.instagram.com/brauneyer",
      "https://www.linkedin.com/company/brauneyer"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mainzerstraße 29",
      "addressLocality": "Saarbrücken",
      "postalCode": "66111",
      "addressCountry": "DE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49-681-9541-7488",
      "contactType": "customer service",
      "availableLanguage": ["German", "English"]
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "€€€",
    "servesCuisine": "Architecture Services",
    "knowsAbout": [
      "Neubau",
      "Altbausanierung",
      "Energieeffizientes Bauen",
      "Denkmalschutz",
      "Bauplanung",
      "Projektentwicklung"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      <html lang="de" />
      
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}
      
      <link rel="canonical" href={canonicalUrl} />
      
      {alternates.map((alt, index) => (
        <link key={index} rel="alternate" hreflang={alt.lang} href={alt.url} />
      ))}
      
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Braun & Eyer Architekturbüro" />
      <meta property="og:locale" content="de_DE" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@brauneyer" />
      <meta name="twitter:creator" content="@brauneyer" />
      
      {publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#1a1a1a" />
      
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;