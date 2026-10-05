import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ImpressumClient from './ImpressumClient';
import { getNavigationSettings } from '@/lib/navigation';
import { getDictionary } from '@/lib/getDictionary';

// Force dynamic rendering with ISR (revalidate every 60 seconds)
export const revalidate = 60;

export default async function ImpressumPage({ params }) {
  const { lang = 'de' } = await params;
  
  // Load translations with footer and navigation
  const [dict, navigationSettings] = await Promise.all([
    getDictionary(lang),
    getNavigationSettings(lang)
  ]);

  return <ImpressumClient dict={dict} lang={lang} navigationSettings={navigationSettings} />;
}