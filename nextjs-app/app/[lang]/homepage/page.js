import HomepageClient from './HomepageClient';
import { homepageAPI, projectsAPI } from '@/lib/api';

export default async function HomePage({ params }) {
  const { lang = 'de' } = await params;
  
  // Fetch homepage configuration and projects from API
  let homepageData = { heroSlides: [], featuredProjects: [] };
  let allProjects = [];
  
  try {
    // Fetch homepage config and all projects in parallel
    const [config, projectsResponse] = await Promise.all([
      homepageAPI.getConfig(),
      projectsAPI.getAll({ featured: true, limit: 6 })
    ]);
    
    homepageData = config;
    // Get featured projects from the API response
    allProjects = projectsResponse.projects || [];
    
    // Use featured projects from API if available
    if (allProjects.length > 0) {
      homepageData.featuredProjects = allProjects;
    }
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    // Will use fallback data in client component
  }
  
  // Load translations
  let dict = {};
  try {
    const [homepageDict, translationDict] = await Promise.all([
      import(`@/lib/locales/${lang}/homepage.json`),
      import(`@/lib/locales/${lang}/translation.json`)
    ]);
    dict = {
      ...homepageDict.default,
      translation: translationDict.default
    };
  } catch (error) {
    console.error('Failed to load translations:', error);
  }

  return (
    <HomepageClient 
      heroSlides={homepageData.heroSlides}
      featuredProjects={homepageData.featuredProjects}
      allProjects={allProjects}
      dict={dict}
    />
  );
}
