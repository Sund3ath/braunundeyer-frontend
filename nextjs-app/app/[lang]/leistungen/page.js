import ServicesClient from './ServicesClient';
import { getNavigationSettings } from '@/lib/navigation';
import { getDictionary, getModuleDictionary } from '@/lib/getDictionary';

// Force dynamic rendering with ISR (revalidate every 60 seconds)
export const revalidate = 60;

async function getServicesConfiguration() {
  // Skip fetching during build time to avoid errors
  if (!process.env.BACKEND_URL) {
    return null;
  }
  
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:3001';
    const response = await fetch(`${backendUrl}/api/content/services`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch services configuration:', response.status);
      return null;
    }

    const data = await response.json();
    if (data && data.value) {
      return JSON.parse(data.value);
    }
    return null;
  } catch (error) {
    console.error('Error fetching services configuration:', error);
    return null;
  }
}

export default async function ServicesPage({ params }) {
  const { lang = 'de' } = await params;
  
  // Fetch navigation settings and services configuration
  const [navigationSettings, servicesConfig] = await Promise.all([
    getNavigationSettings(lang),
    getServicesConfiguration()
  ]);
  
  // Load translations with footer
  const [baseDict, servicesDict] = await Promise.all([
    getDictionary(lang),
    getModuleDictionary(lang, 'services')
  ]);
  
  const dict = {
    ...baseDict,
    services: servicesDict
  };

  return (
    <ServicesClient 
      dict={dict} 
      lang={lang} 
      navigationSettings={navigationSettings} 
      servicesConfig={servicesConfig}
    />
  );
}