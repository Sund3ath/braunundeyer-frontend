import GalleryClient from './GalleryClient';
import { getDictionary } from '@/lib/dictionaries';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const metadata = {
    de: {
      title: 'Galerie | Braun & Eyer Architekten',
      description: 'Entdecken Sie unsere Projektgalerie - Eine inspirierende Sammlung unserer Architekturprojekte',
    },
    en: {
      title: 'Gallery | Braun & Eyer Architects',
      description: 'Discover our project gallery - An inspiring collection of our architecture projects',
    },
    fr: {
      title: 'Galerie | Braun & Eyer Architectes',
      description: 'Découvrez notre galerie de projets - Une collection inspirante de nos projets d\'architecture',
    },
    it: {
      title: 'Galleria | Braun & Eyer Architetti',
      description: 'Scopri la nostra galleria di progetti - Una collezione ispiratrice dei nostri progetti di architettura',
    },
    es: {
      title: 'Galería | Braun & Eyer Arquitectos',
      description: 'Descubre nuestra galería de proyectos - Una colección inspiradora de nuestros proyectos de arquitectura',
    }
  };

  return metadata[lang] || metadata.de;
}

export default async function GalleryPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <GalleryClient lang={lang} dict={dict} />;
}