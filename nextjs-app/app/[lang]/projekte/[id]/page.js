import ProjectDetailClient from './ProjectDetailClient';
import { getProjectById, getAllProjects } from '@/lib/api/projects';

export default async function ProjectDetailPage({ params }) {
  const { lang = 'de', id } = await params;
  
  // Fetch project data from API
  let project = null;
  let relatedProjects = [];
  
  try {
    // Fetch the specific project
    project = await getProjectById(id);
    
    // Fetch all projects to find related ones
    const allProjects = await getAllProjects();
    
    // Filter related projects (same category, excluding current project)
    if (project && allProjects.length > 0) {
      relatedProjects = allProjects
        .filter(p => p.id !== project.id && p.category === project.category)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Failed to fetch project details:', error);
  }
  
  // Load translations
  let dict = {};
  try {
    const [projectsDict, translationDict] = await Promise.all([
      import(`@/lib/locales/${lang}/projects.json`),
      import(`@/lib/locales/${lang}/translation.json`)
    ]);
    dict = {
      projects: projectsDict.default,
      translation: translationDict.default
    };
  } catch (error) {
    console.error('Failed to load translations:', error);
  }

  return (
    <ProjectDetailClient 
      project={project}
      relatedProjects={relatedProjects}
      dict={dict}
    />
  );
}

// Generate static params for all projects (optional for SSG)
export async function generateStaticParams() {
  try {
    const projects = await getAllProjects();
    const languages = ['de', 'en', 'fr', 'it', 'es'];
    
    return languages.flatMap(lang =>
      projects.map(project => ({
        lang,
        id: project.id.toString(),
      }))
    );
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}