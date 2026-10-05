import AboutUsClient from './AboutUsClient';
import { getAllTeamMembers } from '@/lib/api/team';
import { getNavigationSettings } from '@/lib/navigation';
import { getDictionary, getModuleDictionary } from '@/lib/getDictionary';

// Force dynamic rendering with ISR (revalidate every 60 seconds)
export const revalidate = 60;

export default async function AboutUsPage({ params }) {
  const { lang = 'de' } = await params;
  
  // Fetch team members and navigation from API
  let teamMembers = [];
  const navigationSettings = await getNavigationSettings(lang);
  
  try {
    teamMembers = await getAllTeamMembers(lang);
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    // Will use empty array in client component
  }
  
  // Load translations with footer
  const [baseDict, aboutDict] = await Promise.all([
    getDictionary(lang),
    getModuleDictionary(lang, 'about')
  ]);
  
  const dict = {
    ...baseDict,
    about: aboutDict
  };

  return <AboutUsClient teamMembers={teamMembers} dict={dict} lang={lang} navigationSettings={navigationSettings} />;
}