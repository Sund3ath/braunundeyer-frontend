import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { languages } from '../i18n/config';

const MultiLanguageSEO = ({ 
  titleKey,
  descriptionKey,
  keywordsKey,
  title,
  description,
  keywords,
  image,
  structuredData,
  noindex = false,
  canonical,
  type = 'website'
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { lang } = useParams();
  const currentLang = lang || i18n.language || 'de';
  
  // Get translated content or use provided values
  const pageTitle = titleKey ? t(titleKey) : title;
  const pageDescription = descriptionKey ? t(descriptionKey) : description;
  const pageKeywords = keywordsKey ? t(keywordsKey) : keywords;
  
  // Build base URL
  const baseUrl = 'https://braunundeyer.de';
  const currentPath = location.pathname.replace(/^\/(de|en|fr|it|es)/, '');
  
  // Generate hreflang links for all languages
  const hreflangLinks = languages.map(language => ({
    rel: 'alternate',
    hreflang: language.code,
    href: `${baseUrl}/${language.code}${currentPath}`
  }));
  
  // Add x-default
  hreflangLinks.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${baseUrl}/de${currentPath}`
  });
  
  // Canonical URL
  const canonicalUrl = canonical || `${baseUrl}/${currentLang}${currentPath}`;
  
  // Enhanced structured data with language
  const enhancedStructuredData = structuredData ? {
    ...structuredData,
    '@context': 'https://schema.org',
    inLanguage: currentLang,
    url: canonicalUrl
  } : null;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLang} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {pageKeywords && <meta name="keywords" content={pageKeywords} />}
      
      {/* Language and Region */}
      <meta name="language" content={currentLang} />
      <meta httpEquiv="content-language" content={currentLang} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Links */}
      {hreflangLinks.map((link, index) => (
        <link key={index} rel={link.rel} hreflang={link.hreflang} href={link.href} />
      ))}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={currentLang === 'de' ? 'de_DE' : 
                                         currentLang === 'en' ? 'en_US' :
                                         currentLang === 'fr' ? 'fr_FR' :
                                         currentLang === 'it' ? 'it_IT' :
                                         currentLang === 'es' ? 'es_ES' : 'de_DE'} />
      
      {/* Alternate locales for Open Graph */}
      {languages.filter(l => l.code !== currentLang).map(language => (
        <meta 
          key={language.code}
          property="og:locale:alternate" 
          content={language.code === 'de' ? 'de_DE' : 
                   language.code === 'en' ? 'en_US' :
                   language.code === 'fr' ? 'fr_FR' :
                   language.code === 'it' ? 'it_IT' :
                   language.code === 'es' ? 'es_ES' : 'de_DE'} 
        />
      ))}
      
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="Braun & Eyer Architekturbüro" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Structured Data */}
      {enhancedStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(enhancedStructuredData)}
        </script>
      )}
      
      {/* Additional Language-specific meta tags */}
      <meta name="geo.region" content={currentLang === 'de' ? 'DE-SL' : 'DE'} />
      <meta name="geo.placename" content="Saarbrücken" />
      <meta name="geo.position" content="49.2333;6.9833" />
      <meta name="ICBM" content="49.2333, 6.9833" />
    </Helmet>
  );
};

export default MultiLanguageSEO;