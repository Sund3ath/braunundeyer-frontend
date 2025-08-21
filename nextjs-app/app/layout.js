import { Inter, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import CustomCursor from '@/components/ui/CustomCursor';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sourceSans = Source_Sans_3({ 
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://braunundeyer.de'),
  title: 'Braun & Eyer Architekturbüro',
  description: 'Innovative Architektur mit Tradition - Braun & Eyer Architekturbüro',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ArchitectureFirm",
        "@id": "https://braunundeyer.de/#organization",
        "name": "Braun & Eyer Architekten GbR",
        "alternateName": "Braun und Eyer",
        "url": "https://braunundeyer.de",
        "logo": {
          "@type": "ImageObject",
          "url": "https://braunundeyer.de/logo.png",
          "width": 300,
          "height": 100
        },
        "description": "Architekturbüro in Saarbrücken spezialisiert auf Neubau, Altbausanierung und Denkmalschutz seit 1999",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Mainzerstraße 29",
          "addressLocality": "Saarbrücken",
          "addressRegion": "SL",
          "postalCode": "66111",
          "addressCountry": "DE"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 49.2341,
          "longitude": 6.9895
        },
        "telephone": "+49 681 95417488",
        "email": "info@braunundeyer.de",
        "foundingDate": "1999",
        "founders": [
          {
            "@type": "Person",
            "name": "Christian F. Braun",
            "jobTitle": "Dipl.-Ing. Architekt",
            "description": "Geschäftsführender Architekt mit über 20 Jahren Erfahrung"
          },
          {
            "@type": "Person",
            "name": "Patric Eyer",
            "jobTitle": "Dipl.-Ing. Architekt",
            "description": "Partner und Architekt, spezialisiert auf Innenarchitektur"
          }
        ],
        "sameAs": [
          "https://www.instagram.com/braunundeyer",
          "https://www.linkedin.com/company/braun-eyer-architekten",
          "https://www.facebook.com/braunundeyer"
        ],
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 49.2341,
            "longitude": 6.9895
          },
          "geoRadius": "100km"
        },
        "priceRange": "€€€",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "10:00",
            "closes": "14:00"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://braunundeyer.de/#website",
        "url": "https://braunundeyer.de",
        "name": "Braun & Eyer Architekten",
        "description": "Architekturbüro Braun & Eyer - Innovative Architektur mit Tradition",
        "publisher": {
          "@id": "https://braunundeyer.de/#organization"
        },
        "inLanguage": ["de-DE", "en-US", "fr-FR", "it-IT", "es-ES"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://braunundeyer.de/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://braunundeyer.de/#localbusiness",
        "name": "Braun & Eyer Architekten",
        "image": "https://braunundeyer.de/office.jpg",
        "priceRange": "€€€",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Mainzerstraße 29",
          "addressLocality": "Saarbrücken",
          "addressRegion": "SL",
          "postalCode": "66111",
          "addressCountry": "DE"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 49.2341,
          "longitude": 6.9895
        },
        "url": "https://braunundeyer.de",
        "telephone": "+49 681 95417488",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "10:00",
            "closes": "14:00"
          }
        ]
      }
    ]
  };

  return (
    <html suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${sourceSans.variable} font-body`}>
        <CustomCursor />
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}