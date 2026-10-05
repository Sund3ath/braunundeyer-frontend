import ProjectDetailClient from './ProjectDetailClient';
import { getProjectById, getAllProjects } from '@/lib/api/projects';
import { getNavigationSettings } from '@/lib/navigation';
import { getDictionary, getModuleDictionary } from '@/lib/getDictionary';

export default async function ProjectDetailPage({ params }) {
  const { lang = 'de', id } = await params;
  
  // Fetch project data from API
  let project = null;
  let relatedProjects = [];
  
  try {
    // Fetch the specific project with language support
    project = await getProjectById(id, lang);
    
    // Fetch all projects to find related ones with language support
    const allProjects = await getAllProjects(lang);
    
    // Filter related projects (same category, excluding current project)
    if (project && allProjects.length > 0) {
      relatedProjects = allProjects
        .filter(p => p.id !== project.id && p.category === project.category)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Failed to fetch project details:', error);
  }
  
  // Load translations with footer and navigation
  const [baseDict, projectsDict, navigationSettings] = await Promise.all([
    getDictionary(lang),
    getModuleDictionary(lang, 'projects'),
    getNavigationSettings(lang)
  ]);
  
  const dict = {
    ...baseDict,
    projects: projectsDict
  };

  return (
    <ProjectDetailClient 
      project={project}
      relatedProjects={relatedProjects}
      dict={dict}
      lang={lang}
      navigationSettings={navigationSettings}
    />
  );
}

// Generate static params for all projects (optional for SSG)
// Temporarily disabled for build - will be re-enabled when API is accessible
// export async function generateStaticParams() {
//   try {
//     const projects = await getAllProjects();
//     const languages = ['de', 'en', 'fr', 'it', 'es'];
    
//     return languages.flatMap(lang =>
//       projects.map(project => ({
//         lang,
//         id: project.id.toString(),
//       }))
//     );
//   } catch (error) {
//     console.error('Failed to generate static params:', error);
//     return [];
//   }
// }