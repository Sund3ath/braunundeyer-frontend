import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Wordmark } from './Header';
import LanguageLinks from './LanguageSwitcher';
import FooterCopyright from './site/FooterCopyright';
import CookieSettingsButton from './site/CookieSettingsButton';

/**
 * Site footer (server component): the wordmark inverted, address and contact
 * from lib/site.js (single NAP source), the page links, legal links (CMS
 * footer menu when present), cookie settings and the six languages by name.
 * Social links appear only for verified profiles in SITE.socialProfiles.
 */
export default function Footer({ lang, copy, pages = [], legal = [] }) {
  const year = new Date().getFullYear();
  const social = (SITE.socialProfiles || []).filter((p) => p.url);

  return (
    <footer className="site-footer on-dark">
      <div className="wrap">
        <div className="cols footer-grid">
          <div className="f-brand">
            <Wordmark lang={lang} label={copy.common.homeLabel} className="footer-mark" />
          </div>
          <div className="f-col f-wide">
            <h2>{copy.footer.office}</h2>
            <address>
              {SITE.legalName}
              <br />
              {SITE.address.street}
              <br />
              {SITE.address.postalCode} {SITE.address.city}
            </address>
          </div>
          <div className="f-col f-wide">
            <h2>{copy.footer.contact}</h2>
            <ul>
              <li><a href={`tel:${SITE.phone.e164}`}>{SITE.phone.national}</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              {social.map((p) => (
                <li key={p.url}><a href={p.url} rel="me noopener" target="_blank">{p.platform}</a></li>
              ))}
            </ul>
          </div>
          <nav className="f-col" aria-label={copy.footer.nav}>
            <h2>{copy.footer.pages}</h2>
            <ul>
              {pages.map((item) => (
                <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <FooterCopyright>© {year} {SITE.legalName}</FooterCopyright>
          <ul className="footer-links">
            {legal.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
            <li><CookieSettingsButton>{copy.footer.cookies}</CookieSettingsButton></li>
          </ul>
          <LanguageLinks lang={lang} className="footer-langs" label={copy.common.language} />
        </div>
      </div>
    </footer>
  );
}
