import ProjectsClient from './ProjectsClient';
import { getAllProjects } from '@/lib/api/projects';

export default async function ProjectsPage({ params }) {
  const { lang = 'de' } = await params;
  
  // Fetch projects from API
  let projects = [];
  try {
    projects = await getAllProjects();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    // Will use fallback data in client component
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
    <ProjectsClient 
      initialProjects={projects}
      dict={dict}
    />
  );
}