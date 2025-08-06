export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://braunundeyer.de/#organization",
  "name": "Braun & Eyer Architekturbüro",
  "alternateName": "Braun und Eyer",
  "url": "https://braunundeyer.de",
  "logo": {
    "@type": "ImageObject",
    "url": "https://braunundeyer.de/assets/images/logo.png",
    "width": 600,
    "height": 200
  },
  "description": "Professionelles Architekturbüro für innovative Neubauprojekte und fachgerechte Altbausanierung",
  "foundingDate": "1990",
  "founder": [
    {
      "@type": "Person",
      "name": "Herr Braun"
    },
    {
      "@type": "Person",
      "name": "Herr Eyer"
    }
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
    "contactType": "Kundenservice",
    "areaServed": "DE",
    "availableLanguage": ["Deutsch", "Englisch"]
  },
  "sameAs": [
    "https://www.facebook.com/brauneyer",
    "https://www.instagram.com/brauneyer",
    "https://www.linkedin.com/company/brauneyer",
    "https://www.xing.com/companies/brauneyer"
  ]
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://braunundeyer.de/#website",
  "url": "https://braunundeyer.de",
  "name": "Braun & Eyer Architekturbüro",
  "description": "Architekturbüro für Neubau und Altbausanierung",
  "publisher": {
    "@id": "https://braunundeyer.de/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://braunundeyer.de/suche?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "de-DE"
});

export const generateServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://braunundeyer.de/#service",
  "serviceType": "Architekturdienstleistungen",
  "provider": {
    "@id": "https://braunundeyer.de/#organization"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Deutschland"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Architekturleistungen",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Neubauplanung",
          "description": "Planung und Realisierung von Neubauprojekten"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Altbausanierung",
          "description": "Fachgerechte Sanierung und Modernisierung von Bestandsgebäuden"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Energieberatung",
          "description": "Beratung zu energieeffizientem Bauen und Sanieren"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Denkmalschutz",
          "description": "Sanierung denkmalgeschützter Gebäude"
        }
      }
    ]
  }
});

export const generateProjectSchema = (project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": `https://braunundeyer.de/projekte/${project.id}`,
  "name": project.title,
  "description": project.description,
  "image": project.images?.map(img => ({
    "@type": "ImageObject",
    "url": img.url,
    "caption": img.caption || project.title
  })),
  "dateCreated": project.dateCreated,
  "dateModified": project.dateModified,
  "creator": {
    "@id": "https://braunundeyer.de/#organization"
  },
  "keywords": project.tags?.join(", "),
  "about": {
    "@type": "Thing",
    "name": project.category || "Architekturprojekt"
  },
  "locationCreated": project.location ? {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": project.location.city,
      "addressCountry": "DE"
    }
  } : undefined
});

export const generateBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateFAQSchema = (questions) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": questions.map(q => ({
    "@type": "Question",
    "name": q.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.answer
    }
  }))
});

export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://braunundeyer.de/#localbusiness",
  "name": "Braun & Eyer Architekturbüro",
  "image": "https://braunundeyer.de/assets/images/office.jpg",
  "priceRange": "€€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Mainzerstraße 29",
    "addressLocality": "Saarbrücken",
    "postalCode": "66111",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 49.2333,
    "longitude": 7.0000
  },
  "url": "https://braunundeyer.de",
  "telephone": "+49-681-9541-7488",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "89"
  }
});

export const generatePersonSchema = (person) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": person.name,
  "jobTitle": person.jobTitle || "Architekt",
  "worksFor": {
    "@id": "https://braunundeyer.de/#organization"
  },
  "description": person.bio,
  "image": person.image,
  "sameAs": person.socialLinks || []
});

export const combineSchemas = (...schemas) => {
  const validSchemas = schemas.filter(s => s);
  if (validSchemas.length === 0) return null;
  if (validSchemas.length === 1) return validSchemas[0];
  
  return {
    "@context": "https://schema.org",
    "@graph": validSchemas
  };
};