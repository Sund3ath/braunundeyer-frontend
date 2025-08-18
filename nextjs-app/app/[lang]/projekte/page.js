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
    // Handle both response.projects and response.data.projects formats
    projects = response.projects || response.data?.projects || response.data || response || [];
  } catch (err) {
    console.error('Error fetching projects from CMS:', err);
    error = err.message;
    
    // Fallback to demo data if API fails
    projects = [
      {
        id: 1,
        name: "Moderne Stadtvilla Saarbrücken",
        title: "Moderne Stadtvilla Saarbrücken",
        location: "Saarbrücken-St. Johann",
        year: 2023,
        category: "Neubau",
        image: "/uploads/placeholder.png",
        description: "Zeitgenössische Villa mit klaren Linien, nachhaltigen Materialien und panoramischem Stadtblick.",
        area: "420 m²",
        status: "Fertiggestellt"
      },
      {
        id: 2,
        name: "Altbausanierung Mettlach",
        title: "Altbausanierung Mettlach",
        location: "Mettlach",
        year: 2022,
        category: "Altbausanierung",
        image: "/uploads/sarnierung_alt_neu.png",
        description: "Behutsame Sanierung eines denkmalgeschützten Fachwerkhauses unter Erhaltung historischer Details.",
        area: "280 m²",
        status: "Fertiggestellt"
      },
      {
        id: 3,
        name: "Bürogebäude Luxemburg",
        title: "Bürogebäude Luxemburg",
        location: "Luxemburg-Stadt",
        year: 2023,
        category: "Neubau",
        image: "/uploads/alt_neu_ungestaltung.png",
        description: "Modernes Bürogebäude mit flexiblen Arbeitsbereichen und nachhaltiger Energieversorgung.",
        area: "1.200 m²",
        status: "In Bearbeitung"
      },
      {
        id: 4,
        name: "Innenarchitektur Restaurant",
        title: "Innenarchitektur Restaurant",
        location: "Saarlouis",
        year: 2023,
        category: "Innenarchitektur",
        image: "/uploads/innenarchitektur.png",
        description: "Komplette Neugestaltung eines gehobenen Restaurants mit zeitgenössischem Design.",
        area: "350 m²",
        status: "Fertiggestellt"
      }
    ];
  }

  // Ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : [];
  
  return (
    <ProjectGalleryClient 
      initialProjects={projectsArray}
      lang={lang}
      apiError={error}
    />
  );
}