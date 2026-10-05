'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSeoCopy } from '@/lib/seo-copy';
import { isValidLocale } from '@/lib/seo';

/**
 * Plain, branded 404 body.
 * - app/[lang]/not-found.js: rendered inside the locale layout (header and
 *   footer come from there).
 * - app/not-found.js (`standalone`): outside any locale, so it brings its own
 *   wordmark tab.
 * The language comes from the URL when it is a valid locale, else German.
 */
export default function NotFoundContent({ standalone = false }) {
  const params = useParams();
  const lang = isValidLocale(params?.lang) ? params.lang : 'de';
  const t = getSeoCopy(lang).notFound;
  const en = getSeoCopy('en').notFound;

  return (
    <>
      {standalone && (
        <header className="site-header">
          <div className="wrap header-inner">
            <Link className="mark" href={`/${lang}`} aria-label="Braun & Eyer Architekten">
              <span className="m1" aria-hidden="true">braun &amp; eyer</span>
              <span className="m2" aria-hidden="true">architekten</span>
            </Link>
          </div>
        </header>
      )}
      <main id="main" className="wrap" style={{ paddingBlock: 'var(--s-10)' }}>
        <p className="t-meta">404</p>
        <h1 className="t-h1" style={{ marginTop: 'var(--s-3)', maxWidth: '16em' }}>{t.heading}</h1>
        <p className="t-body" style={{ marginTop: 'var(--s-5)' }}>{t.text}</p>
        {lang !== 'en' && (
          <p lang="en" className="t-meta" style={{ marginTop: 'var(--s-2)' }}>
            {en.heading} {en.text}
          </p>
        )}
        <ul className="flex flex-wrap gap-x-8 gap-y-3" style={{ marginTop: 'var(--s-7)' }}>
          <li><Link className="link" href={`/${lang}`}>{t.home}</Link></li>
          <li><Link className="link" href={`/${lang}/projekte`}>{t.projects}</Link></li>
          <li><Link className="link" href={`/${lang}/kontakt`}>{t.contact}</Link></li>
        </ul>
      </main>
    </>
  );
}
