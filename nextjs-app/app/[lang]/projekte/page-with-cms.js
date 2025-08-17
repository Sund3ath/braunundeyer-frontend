import { projectsAPI } from '@/lib/api';
import ProjectGalleryClient from './ProjectGalleryClient';

// This is a Server Component that fetches data
export default async function ProjectsPage({ params }) {
  const { lang } = await params;
  
  let projects = [];
  let error = null;
  
  try {
    // Fetch projects from CMS API
    const response = await projectsAPI.getAll();
    projects = response.data || response || [];
  } catch (err) {
    console.error('Error fetching projects from CMS:', err);
    error = err.message;
    
    // Fallback to demo data if API fails
    projects = [
      {
        id: 1,
        name: "Moderne Stadtvilla Saarbrücken",
        location: "Saarbrücken-St. Johann",
        year: 2023,
        category: "Neubau",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        description: "Zeitgenössische Villa mit klaren Linien, nachhaltigen Materialien und panoramischem Stadtblick.",
        area: "420 m²",
        status: "Fertiggestellt",
        featured: true
      },
      {
        id: 2,
        name: "Bürogebäude Maximilianstraße",
        location: "Saarbrücken-Mitte",
        year: 2023,
        category: "Neubau",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        description: "Modernes 8-stöckiges Bürogebäude mit innovativem Arbeitsplatzdesign und LEED-Zertifizierung.",
        area: "3.200 m²",
        status: "Fertiggestellt"
      },
      {
        id: 3,
        name: "Penthouse Innenarchitektur",
        location: "Saarbrücken-St. Arnual",
        year: 2022,
        category: "Innenarchitektur",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        description: "Hochwertige Innenarchitektur mit maßgefertigten Möbeln und exklusiven Oberflächen.",
        area: "280 m²",
        status: "Fertiggestellt"
      },
      {
        id: 4,
        name: "Denkmalgeschütztes Stadthaus",
        location: "Saarbrücken-Altstadt",
        year: 2022,
        category: "Altbausanierung",
        image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80",
        description: "Behutsame Sanierung unter Wahrung des historischen Charakters mit modernen Elementen.",
        area: "540 m²",
        status: "Fertiggestellt",
        featured: true
      },
      {
        id: 5,
        name: "Energieeffizientes Einfamilienhaus",
        location: "St. Ingbert",
        year: 2023,
        category: "Neubau",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        description: "Passivhaus-Standard mit innovativer Haustechnik und nachhaltigen Baustoffen.",
        area: "180 m²",
        status: "In Planung"
      },
      {
        id: 6,
        name: "Wohnanlage am Park",
        location: "Homburg",
        year: 2021,
        category: "Neubau",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        description: "Moderne Wohnanlage mit 24 Einheiten, Tiefgarage und großzügigen Grünflächen.",
        area: "2.800 m²",
        status: "Fertiggestellt"
      },
      {
        id: 7,
        name: "Restaurant Umbau",
        location: "Saarbrücken-Nauwieser Viertel",
        year: 2023,
        category: "Innenarchitektur",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
        description: "Kompletter Umbau eines historischen Restaurants mit modernem Gastro-Konzept.",
        area: "350 m²",
        status: "Fertiggestellt"
      },
      {
        id: 8,
        name: "Jugendstilvilla Sanierung",
        location: "Saarbrücken-Rotenbühl",
        year: 2022,
        category: "Altbausanierung",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        description: "Aufwendige Restaurierung einer Jugendstilvilla mit originalgetreuen Details.",
        area: "680 m²",
        status: "Fertiggestellt",
        featured: true
      },
      {
        id: 9,
        name: "Kindergarten Neubau",
        location: "Völklingen",
        year: 2023,
        category: "Neubau",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
        description: "Moderner Kindergarten mit innovativem pädagogischem Raumkonzept.",
        area: "1.200 m²",
        status: "In Bau"
      },
      {
        id: 10,
        name: "Loft-Büro Conversion",
        location: "Saarbrücken-Burbach",
        year: 2021,
        category: "Altbausanierung",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
        description: "Umbau einer ehemaligen Industriehalle zu modernen Bürolofts.",
        area: "1.500 m²",
        status: "Fertiggestellt"
      },
      {
        id: 11,
        name: "Stadthaus mit Praxis",
        location: "Saarlouis",
        year: 2022,
        category: "Neubau",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
        description: "Mehrfamilienhaus mit integrierter Arztpraxis im Erdgeschoss.",
        area: "850 m²",
        status: "Fertiggestellt"
      },
      {
        id: 12,
        name: "Boutique Hotel Interior",
        location: "Saarbrücken-City",
        year: 2023,
        category: "Innenarchitektur",
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
        description: "Exklusives Interior Design für Boutique Hotel mit 45 Zimmern.",
        area: "2.200 m²",
        status: "In Planung"
      }
    ];
  }
  
  // Pass data to Client Component
  return <ProjectGalleryClient 
    initialProjects={projects} 
    lang={lang}
    apiError={error}
  />;
}