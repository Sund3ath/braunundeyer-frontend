import ContactClient from './ContactClient';
import { getNavigationSettings } from '@/lib/navigation';
import { getDictionary, getModuleDictionary } from '@/lib/getDictionary';

// Force dynamic rendering with ISR (revalidate every 60 seconds)
export const revalidate = 60;

async function getContactSettings() {
  // Skip fetching during build time to avoid errors
  if (!process.env.BACKEND_URL) {
    return null;
  }
  
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:3001';
    const response = await fetch(`${backendUrl}/api/content/contact-settings`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch contact settings:', response.status);
      return null;
    }

    const data = await response.json();
    if (data && data.value) {
      return JSON.parse(data.value);
    }
    return null;
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return null;
  }
}

export default async function ContactPage({ params }) {
  const { lang = 'de' } = await params;
  
  // Fetch contact settings and navigation from CMS
  const [contactSettings, navigationSettings] = await Promise.all([
    getContactSettings(),
    getNavigationSettings(lang)
  ]);
  
  // Load translations with footer
  const [baseDict, contactDict] = await Promise.all([
    getDictionary(lang),
    getModuleDictionary(lang, 'contact')
  ]);
  
  const dict = {
    ...baseDict,
    contact: contactDict
  };

  return (
    <ContactClient 
      contactSettings={contactSettings}
      dict={dict}
      lang={lang}
      navigationSettings={navigationSettings}
    />
  );
}