'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { fmt } from '@/lib/fmt';
import { optimizedImageUrl } from '@/lib/media';
import { INTRO_DONE_EVENT } from '@/lib/intro';

/**
 * Homepage hero carousel (CMS hero slides), directly under the header.
 *
 * - Server-rendered: every slide's title/client/year is in the HTML; the
 *   first slide's photo is a high-priority <img> in the HTML (LCP), the other
 *   photos are mounted shortly after (idle) or when their slide comes up.
 * - Crossfade only. Inactive slides are `visibility: hidden` (out of the
 *   accessibility tree and tab order) after the fade.
 * - Autoplay every 6 s, timed by the CSS progress line on the active dot
 *   (animationend = next slide, so pausing freezes it where it is). Paused on
 *   hover, on keyboard focus inside, when the tab is hidden, while the intro
 *   overlay is open, or by the pause button. Never on under prefers-reduced-motion or Save-Data.
 * - APG carousel pattern: aria-roledescription, labelled slide groups,
 *   prev/next + slide picker buttons (44 px targets), ←/→ on the controls,
 *   a polite live region that announces user-initiated changes only.
 * - Swipe on touch (pointer events, vertical scrolling stays native).
 * - Optional slide video: poster (the photo) first; plays muted only on the
 *   active slide and only when motion and data are allowed.
 */

const WIDTHS = [640, 828, 1080, 1200, 1920, 2048];
const SRC_W = 1920;
const Q = 70;

function srcSet(src) {
  return WIDTHS.map((w) => `${optimizedImageUrl(src, w, Q)} ${w}w`).join(', ');
}

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d={dir === 'prev' ? 'M12.5 4 6.5 10l6 6' : 'M7.5 4l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function motionAllowed() {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  return !reduced && !saveData;
}

export default function HeroSlider({ slides, copy, workHref, contactHref }) {
  const total = slides.length;
  const multi = total > 1;
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(() => new Set([0]));
  const [canAuto, setCanAuto] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [announce, setAnnounce] = useState('');
  const rootRef = useRef(null);
  const swipe = useRef(null);

  const mount = useCallback((...ids) => {
    setMounted((prev) => {
      if (ids.every((i) => prev.has(i))) return prev;
      const next = new Set(prev);
      ids.forEach((i) => next.add(i));
      return next;
    });
  }, []);

  // Client capabilities: motion preference, Save-Data, page visibility.
  useEffect(() => {
    if (!multi) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setCanAuto(motionAllowed());
    const vis = () => setTabHidden(document.hidden);
    // The intro overlay (EntryOverlay) covers the hero: wait for it.
    const introDone = () => setIntroOpen(false);
    update();
    vis();
    setIntroOpen(document.documentElement.classList.contains('intro-pending'));
    mq.addEventListener?.('change', update);
    document.addEventListener('visibilitychange', vis);
    window.addEventListener(INTRO_DONE_EVENT, introDone);
    return () => {
      mq.removeEventListener?.('change', update);
      document.removeEventListener('visibilitychange', vis);
      window.removeEventListener(INTRO_DONE_EVENT, introDone);
    };
  }, [multi]);

  // After the first photo, fetch the next one when the browser is idle.
  useEffect(() => {
    if (!multi) return undefined;
    const run = () => mount(1 % total);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(run, 1500);
    return () => clearTimeout(t);
  }, [multi, total, mount]);

  const go = useCallback((target, byUser) => {
    const i = (target + total) % total;
    mount(i, (i + 1) % total);
    setIndex(i);
    if (byUser) setAnnounce(`${fmt(copy.slideOf, { n: i + 1, total })}: ${slides[i].title}`);
  }, [total, mount, copy.slideOf, slides]);

  const running = multi && canAuto && !userPaused && !hover && !focusIn && !tabHidden && !introOpen;

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, true); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, true); }
  };

  // Keyboard focus inside pauses the rotation (APG); a mouse click on a
  // control does not count as "focus inside".
  const onFocus = (e) => {
    if (e.target.matches?.(':focus-visible')) setFocusIn(true);
  };
  const onBlur = (e) => {
    if (!rootRef.current?.contains(e.relatedTarget)) setFocusIn(false);
  };

  const onPointerDown = (e) => {
    if (!multi || e.pointerType === 'mouse') return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) go(index + (dx < 0 ? 1 : -1), true);
  };

  if (!total) return null;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section
      ref={rootRef}
      className="hs on-dark"
      aria-roledescription={copy.carousel}
      aria-label={copy.label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div
        className="hs-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { swipe.current = null; }}
      >
        {slides.map((s, i) => {
          const active = i === index;
          const showVideo = s.video && active && canAuto;
          return (
            <div
              key={s.id}
              className={`hs-slide${active ? ' is-active' : ''}`}
              role="group"
              aria-roledescription={copy.slide}
              aria-label={fmt(copy.slideOf, { n: i + 1, total })}
            >
              <div className="hs-media">
                {mounted.has(i) && (
                  // Plain <img> with a capped srcset (max 2048 w): a dimmed
                  // full-bleed photo never needs the 3840 w variant.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={optimizedImageUrl(s.src, SRC_W, Q)}
                    srcSet={srcSet(s.src)}
                    sizes="100vw"
                    alt={s.alt}
                    width={s.w || 1920}
                    height={s.h || 1280}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : 'low'}
                    decoding={i === 0 ? 'sync' : 'async'}
                    draggable="false"
                  />
                )}
                {showVideo && (
                  <video
                    className="hs-video"
                    src={s.video}
                    poster={optimizedImageUrl(s.src, SRC_W, Q)}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                )}
              </div>
              <div className="wrap hs-text">
                {multi && <p className="hs-count" aria-hidden="true">{pad(i + 1)} / {pad(total)}</p>}
                <h2 className="hs-title">{s.title}</h2>
                {s.client && <p className="hs-client">{s.client}</p>}
                {s.meta && <p className="hs-meta">{s.meta}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="wrap hs-bar">
        <div className="hs-actions">
          <Link className="btn hs-btn" href={workHref}>
            {copy.work}
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          </Link>
          <Link className="btn hs-btn hs-btn--ghost" href={contactHref}>
            {copy.contact}
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M2.5 4.5h15v11h-15zM2.5 5l7.5 6 7.5-6" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
          </Link>
        </div>

        {multi && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- arrow keys for the button group
          <div className="hs-controls" onKeyDown={onKeyDown}>
            <button type="button" className="hs-ctl" onClick={() => go(index - 1, true)} aria-label={copy.prev}>
              <Arrow dir="prev" />
            </button>
            <ul className="hs-dots">
              {slides.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="hs-dot"
                    onClick={() => go(i, true)}
                    aria-label={fmt(copy.goTo, { n: i + 1 })}
                    aria-current={i === index ? 'true' : undefined}
                  >
                    {i === index && canAuto && !userPaused && (
                      <span
                        key={index}
                        className="hs-prog"
                        style={{ animationPlayState: running ? 'running' : 'paused' }}
                        onAnimationEnd={() => go(index + 1, false)}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="hs-ctl" onClick={() => go(index + 1, true)} aria-label={copy.next}>
              <Arrow dir="next" />
            </button>
            {canAuto && (
              <button
                type="button"
                className="hs-ctl hs-pause"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? copy.play : copy.pause}
              >
                {userPaused ? (
                  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7 5v10l8-5z" fill="currentColor" /></svg>
                ) : (
                  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.5 5h2v10h-2zM11.5 5h2v10h-2z" fill="currentColor" /></svg>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announce}</p>
    </section>
  );
}
