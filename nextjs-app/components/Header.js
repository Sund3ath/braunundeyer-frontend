'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/site';
import LanguageLinks, { useLanguageLinks } from './LanguageSwitcher';

/** The office's wordmark tab ("braun & eyer / architekten"), drawn in type. */
export function Wordmark({ lang, label, className = '' }) {
  return (
    <Link className={`mark ${className}`.trim()} href={`/${lang}`} aria-label={label}>
      <span className="m1" aria-hidden="true">braun &amp; eyer</span>
      <span className="m2" aria-hidden="true">architekten</span>
    </Link>
  );
}

const Chevron = (
  <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
);

/**
 * Site header: the black wordmark tab hanging from the top edge, the main
 * navigation (CMS-driven via lib/navigation.js, defaults otherwise), a
 * language disclosure with real links, and on small screens a "Menü" button
 * that opens a full-screen sheet (focus contained, Esc closes, page inert).
 *
 * @param items       [{ href, label }] desktop navigation (no "home": the wordmark is home)
 * @param mobileItems [{ href, label }] mobile sheet navigation (includes home)
 */
export default function Header({ lang, items = [], mobileItems = [], copy }) {
  const pathname = usePathname() || `/${lang}`;
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const langRef = useRef(null);
  const langBtnRef = useRef(null);
  const menuBtnRef = useRef(null);
  const sheetRef = useRef(null);
  const closeBtnRef = useRef(null);
  const inerted = useRef([]);
  const languageLinks = useLanguageLinks(lang);
  const currentLanguage = languageLinks.find((l) => l.current);

  useEffect(() => setMounted(true), []);

  const isCurrent = (href) => {
    if (!href || href === '#') return false;
    if (href === `/${lang}`) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // ----- language disclosure -----
  useEffect(() => {
    if (!langOpen) return undefined;
    const onDown = (e) => { if (!langRef.current?.contains(e.target)) setLangOpen(false); };
    const onKey = (e) => {
      if (e.key === 'Escape') { setLangOpen(false); langBtnRef.current?.focus(); }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  // ----- mobile sheet -----
  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    document.documentElement.style.overflow = '';
    inerted.current.forEach((el) => { el.inert = false; });
    inerted.current = [];
    if (restoreFocus) requestAnimationFrame(() => menuBtnRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const sheet = sheetRef.current;
    document.documentElement.style.overflow = 'hidden';
    inerted.current = [...document.body.children].filter((el) => el !== sheet && el.tagName !== 'SCRIPT' && !el.inert);
    inerted.current.forEach((el) => { el.inert = true; });
    closeBtnRef.current?.focus();
    return undefined;
  }, [menuOpen]);

  // Navigating (or switching to desktop width) closes the sheet.
  useEffect(() => {
    if (menuOpen) closeMenu(false);
    setLangOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on route change
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) closeMenu(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [closeMenu]);

  useEffect(() => () => {
    document.documentElement.style.overflow = '';
    inerted.current.forEach((el) => { el.inert = false; });
  }, []);

  const onSheetKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const f = [...sheetRef.current.querySelectorAll('a[href], button:not([disabled])')];
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const sheet = (
    <div
      ref={sheetRef}
      className="mmenu"
      id="mmenu"
      role="dialog"
      aria-modal="true"
      aria-label={copy.menu}
      onKeyDown={onSheetKeyDown}
    >
      <div className="wrap mmenu-top">
        <Wordmark lang={lang} label={copy.homeLabel} />
        <button ref={closeBtnRef} type="button" className="menu-btn" onClick={() => closeMenu()}>
          {copy.close}
        </button>
      </div>
      <div className="wrap mmenu-body">
        <nav aria-label={copy.mainNav}>
          {mobileItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined} onClick={() => closeMenu(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mmenu-foot">
          <p className="t-small">
            <a className="link" href={`tel:${SITE.phone.e164}`}>{SITE.phone.national}</a>
            <br />
            <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <LanguageLinks lang={lang} className="mmenu-langs" label={copy.language} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <Wordmark lang={lang} label={copy.homeLabel} />
          <div className="header-tools">
            <nav className="nav" aria-label={copy.mainNav}>
              <ul>
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="lang" ref={langRef}>
              <button
                ref={langBtnRef}
                type="button"
                className="lang-btn"
                aria-expanded={langOpen}
                aria-controls="lang-list"
                onClick={() => setLangOpen((o) => !o)}
              >
                <span className="sr-only">{copy.language}: </span>
                {currentLanguage?.name}
                {Chevron}
              </button>
              {/* Always in the HTML (crawlable), only shown when expanded. */}
              <ul className="lang-list" id="lang-list" hidden={!langOpen}>
                {languageLinks.map((l) => (
                  <li key={l.code}>
                    <a href={l.href} lang={l.code} hrefLang={l.code} aria-current={l.current ? 'true' : undefined}>
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <button
              ref={menuBtnRef}
              type="button"
              className="menu-btn"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              onClick={() => setMenuOpen(true)}
            >
              {copy.menu}
            </button>
          </div>
        </div>
      </header>
      {mounted && menuOpen && createPortal(sheet, document.body)}
    </>
  );
}
