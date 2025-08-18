import AboutUsClient from './AboutUsClient';
import { getAllTeamMembers } from '@/lib/api/team';

export default async function AboutUsPage({ params }) {
  const { lang = 'de' } = await params;
  
  // Fetch team members from API
  let teamMembers = [];
  try {
    teamMembers = await getAllTeamMembers(lang);
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    // Will use empty array in client component
  }
  
  // Load translations
  let dict = {};
  try {
    const [aboutDict, translationDict] = await Promise.all([
      import(`@/lib/locales/${lang}/about.json`),
      import(`@/lib/locales/${lang}/translation.json`)
    ]);
    dict = {
      ...aboutDict.default,
      translation: translationDict.default
    };
  } catch (error) {
    console.error('Failed to load translations:', error);
  }

  return <AboutUsClient teamMembers={teamMembers} dict={dict} />;
}