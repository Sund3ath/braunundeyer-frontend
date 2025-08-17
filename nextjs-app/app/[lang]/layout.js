import { getDictionary } from '@/lib/dictionaries';
import { i18n } from '@/lib/i18n';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const metadata = {
    de: {
      title: {
        default: 'Braun & Eyer Architekten | Architekturbüro Saarbrücken',
        template: '%s | Braun & Eyer Architekten'
      },
      description: 'Braun & Eyer Architekten GbR - Ihr Architekturbüro in Saarbrücken. Spezialisiert auf Neubau, Altbausanierung, Denkmalschutz und innovative Architektur seit 1999.',
      keywords: ['Architekten Saarbrücken', 'Braun Eyer', 'Architekturbüro', 'Neubau', 'Altbausanierung', 'Denkmalschutz', 'Christian Braun', 'Patric Eyer', 'Architektur Saarland'],
    },
    en: {
      title: {
        default: 'Braun & Eyer Architects | Architecture Office Saarbrücken',
        template: '%s | Braun & Eyer Architects'
      },
      description: 'Braun & Eyer Architects - Your architecture office in Saarbrücken. Specialized in new construction, building renovation, monument protection and innovative architecture since 1999.',
      keywords: ['Architects Saarbrücken', 'Braun Eyer', 'Architecture Office', 'New Construction', 'Building Renovation', 'Monument Protection', 'Architecture Saarland'],
    },
    fr: {
      title: {
        default: 'Braun & Eyer Architectes | Bureau d\'Architecture Sarrebruck',
        template: '%s | Braun & Eyer Architectes'
      },
      description: 'Braun & Eyer Architectes - Votre bureau d\'architecture à Sarrebruck. Spécialisé dans la construction neuve, la rénovation et la protection des monuments depuis 1999.',
      keywords: ['Architectes Sarrebruck', 'Braun Eyer', 'Bureau Architecture', 'Construction Neuve', 'Rénovation', 'Protection Monuments'],
    },
    it: {
      title: {
        default: 'Braun & Eyer Architetti | Studio di Architettura Saarbrücken',
        template: '%s | Braun & Eyer Architetti'
      },
      description: 'Braun & Eyer Architetti - Il vostro studio di architettura a Saarbrücken. Specializzato in nuove costruzioni, ristrutturazioni e tutela dei monumenti dal 1999.',
      keywords: ['Architetti Saarbrücken', 'Braun Eyer', 'Studio Architettura', 'Nuove Costruzioni', 'Ristrutturazioni', 'Tutela Monumenti'],
    },
    es: {
      title: {
        default: 'Braun & Eyer Arquitectos | Estudio de Arquitectura Saarbrücken',
        template: '%s | Braun & Eyer Arquitectos'
      },
      description: 'Braun & Eyer Arquitectos - Su estudio de arquitectura en Saarbrücken. Especializado en construcción nueva, renovación y protección de monumentos desde 1999.',
      keywords: ['Arquitectos Saarbrücken', 'Braun Eyer', 'Estudio Arquitectura', 'Construcción Nueva', 'Renovación', 'Protección Monumentos'],
    }
  };

  const currentMetadata = metadata[lang] || metadata.de;
  
  return {
    ...currentMetadata,
    metadataBase: new URL('https://braunundeyer.de'),
    openGraph: {
      title: currentMetadata.title.default,
      description: currentMetadata.description,
      url: `https://braunundeyer.de/${lang}`,
      siteName: 'Braun & Eyer Architekten',
      images: [
        {
          url: 'https://braunundeyer.de/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Braun & Eyer Architekten - Architekturbüro Saarbrücken',
        },
      ],
      locale: lang === 'de' ? 'de_DE' : lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : lang === 'it' ? 'it_IT' : 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMetadata.title.default,
      description: currentMetadata.description,
      images: ['https://braunundeyer.de/og-image.jpg'],
      creator: '@braunundeyer',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    authors: [
      { name: 'Christian F. Braun', url: 'https://braunundeyer.de/team/christian-braun' },
      { name: 'Patric Eyer', url: 'https://braunundeyer.de/team/patric-eyer' }
    ],
    creator: 'Braun & Eyer Architekten GbR',
    publisher: 'Braun & Eyer Architekten GbR',
    category: 'Architecture',
    alternates: {
      canonical: `https://braunundeyer.de/${lang}`,
      languages: {
        'de': '/de',
        'en': '/en',
        'fr': '/fr',
        'it': '/it',
        'es': '/es',
      },
    },
    other: {
      'geo.region': 'DE-SL',
      'geo.placename': 'Saarbrücken',
      'geo.position': '49.2341;6.9895',
      'ICBM': '49.2341, 6.9895',
    },
  };
}

export default async function LanguageLayout({ children, params }) {
  const { lang } = await params;
  return (
    <div lang={lang}>
      {children}
    </div>
  );
}