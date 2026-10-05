'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import BackdropType from '@/components/ui/BackdropType';
import { INTRO_FLAG, INTRO_DONE_EVENT } from '@/lib/intro';

/**
 * Intro overlay ("ENTER") on top of the homepage at /{lang}.
 *
 * The homepage itself is fully server-rendered underneath (h1, JSON-LD,
 * content); this overlay never exists in the server HTML. Flow:
 * 1. INTRO_BOOT (an inline script in app/[lang]/layout.js) adds
 *    `html.intro-pending` on a hard load of /{lang} when this session has not
 *    seen the intro, the URL has no #fragment and the visitor did not come
 *    from another page of this site. CSS paints a plain black cover from that
 *    class (html::after), so there is no flash of the page before hydration.
 *    The cover fades out on its own after 5 s if JS fails (no stuck screen);
 *    without JS the class is never set.
 * 2. This component mounts only if that class is present (client-side
 *    navigation to home never shows it), marks the session, renders the
 *    overlay into <body>, makes everything else inert + aria-hidden, locks
 *    scrolling and focuses ENTER.
 * 3. ENTER, Enter/Space/Escape, a click/tap anywhere, a wheel or swipe, or a
 *    scroll key dismisses it at once: 560 ms slide-away (instant under
 *    prefers-reduced-motion), then it is removed from the DOM.
 */

const DISMISS_KEYS = new Set(['Escape', 'Enter', ' ', 'ArrowDown', 'PageDown', 'End', 'Home', 'ArrowUp', 'PageUp']);

export default function EntryOverlay({ copy, typo, brand }) {
  const [state, setState] = useState('off'); // off | on | leaving
  const overlayRef = useRef(null);
  const btnRef = useRef(null);
  const restore = useRef([]);
  const doneRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('intro-pending')) return;
    try { sessionStorage.setItem(INTRO_FLAG, '1'); } catch { /* storage blocked */ }
    setState('on');
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    restore.current.forEach(({ el, hidden }) => {
      el.inert = false;
      if (hidden === null) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', hidden);
    });
    restore.current = [];
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('intro-pending');
    // Put the sequential focus starting point at the top of the page, so the
    // next Tab reaches the skip link, without showing a focus ring anywhere.
    const body = document.body;
    body.setAttribute('tabindex', '-1');
    body.focus({ preventScroll: true });
    body.removeAttribute('tabindex');
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    setState('off');
  }, []);

  const dismiss = useCallback(() => {
    if (doneRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { finish(); return; }
    setState('leaving');
    // Fallback in case transitionend never fires (background tab etc.).
    setTimeout(finish, 800);
  }, [finish]);

  // While shown: page behind inert + hidden from AT, scroll locked, focus on
  // ENTER and trapped there, keys dismiss.
  useEffect(() => {
    if (state !== 'on') return undefined;
    const overlay = overlayRef.current;
    const root = document.documentElement;
    const hide = (el) => {
      if (el === overlay || el.contains(overlay) || el.tagName === 'SCRIPT' || el.inert) return;
      restore.current.push({ el, hidden: el.getAttribute('aria-hidden') });
      el.inert = true;
      el.setAttribute('aria-hidden', 'true');
    };
    [...document.body.children].forEach(hide);
    // Elements that mount later (cookie banner after 1 s) are hidden too.
    const mo = new MutationObserver((list) => {
      list.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) hide(n); }));
    });
    mo.observe(document.body, { childList: true });
    root.style.overflow = 'hidden';
    btnRef.current?.focus({ preventScroll: true });
    // The overlay now covers the page: drop the pre-hydration cover.
    const raf = requestAnimationFrame(() => root.classList.remove('intro-pending'));

    const onKey = (e) => {
      if (e.key === 'Tab') { e.preventDefault(); btnRef.current?.focus(); return; }
      if (DISMISS_KEYS.has(e.key)) {
        // Enter/Space on the focused button are handled by its click.
        if ((e.key === 'Enter' || e.key === ' ') && e.target === btnRef.current) return;
        e.preventDefault();
        dismiss();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
    };
  }, [state, dismiss]);

  // Safety net: unmounting while shown restores the page.
  useEffect(() => () => { if (restore.current.length) finish(); }, [finish]);

  if (state === 'off') return null;

  const [tagA, tagB] = copy.tagline || ['architektur', 'design'];

  return createPortal(
    <div
      ref={overlayRef}
      className={`entry${state === 'leaving' ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${brand}, ${copy.label}`}
      onClick={dismiss}
      onWheel={dismiss}
      onTouchMove={dismiss}
      onTransitionEnd={(e) => { if (e.target === overlayRef.current && state === 'leaving') finish(); }}
    >
      <BackdropType variant="splash" words={typo} tone="dark" />
      <div className="entry-inner">
        <p className="entry-mark" aria-hidden="true">
          <span className="e1">braun &amp; eyer</span>
          <span className="e2">architekten</span>
        </p>
        <p className="entry-tag" aria-hidden="true">
          <span>{tagA}</span>
          <i />
          <span>{tagB}</span>
        </p>
        <button ref={btnRef} type="button" className="entry-btn" onClick={(e) => { e.stopPropagation(); dismiss(); }}>
          <span>{copy.enter}</span>
          <span className="sr-only"> – {copy.enterHint}</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
