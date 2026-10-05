import { notFound } from 'next/navigation';
import { getSeoCopy } from '@/lib/seo-copy';

// Unknown paths below a valid locale (/de/xyz) render the localized 404 inside
// the [lang] layout instead of falling through to the global not-found page.
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: getSeoCopy(lang).notFound.title,
    robots: { index: false, follow: true },
  };
}

export default function CatchAll() {
  notFound();
}
