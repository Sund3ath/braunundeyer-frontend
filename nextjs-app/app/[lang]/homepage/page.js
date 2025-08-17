import HomepageClient from './HomepageClient';
import { homepageAPI } from '@/lib/api';

export default async function HomePage({ params }) {
  const { lang = 'de' } = await params;
  
  // Fetch homepage configuration from API
  let homepageData = { heroSlides: [], featuredProjects: [] };
  try {
    homepageData = await homepageAPI.getConfig();
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
      dict={dict}
    />
  );
}
