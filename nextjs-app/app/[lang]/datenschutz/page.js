import DatenschutzClient from './DatenschutzClient';
import { getNavigationSettings } from '@/lib/navigation';
import { getDictionary } from '@/lib/getDictionary';

// Force dynamic rendering with ISR (revalidate every 60 seconds)
export const revalidate = 60;

export default async function DatenschutzPage({ params }) {
  const { lang = 'de' } = await params;
  
  // Load translations with footer and navigation
  const [dict, navigationSettings] = await Promise.all([
    getDictionary(lang),
    getNavigationSettings(lang)
  ]);

  return <DatenschutzClient dict={dict} lang={lang} navigationSettings={navigationSettings} />;
}