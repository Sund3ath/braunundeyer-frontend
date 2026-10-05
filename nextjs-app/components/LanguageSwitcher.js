'use client';

import { usePathname } from 'next/navigation';
import { languages } from '@/lib/i18n';

/**
 * Real, crawlable links to the same page in the other languages
 * (/de/projekte/13 -> /en/projekte/13). Languages are named in their own
 * language, never with flags (flags stand for countries, not languages).
 */
export function useLanguageLinks(lang) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  return languages.map((l) => ({
    code: l.code,
    name: l.name,
    href: `/${l.code}${rest}`,
    current: l.code === lang,
  }));
}

/** Plain list of language links (footer, mobile menu). */
export default function LanguageLinks({ lang, className, label }) {
  const links = useLanguageLinks(lang);
  return (
    <ul className={className} aria-label={label}>
      {links.map((l) => (
        <li key={l.code}>
          <a href={l.href} lang={l.code} hrefLang={l.code} aria-current={l.current ? 'true' : undefined}>
            {l.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
