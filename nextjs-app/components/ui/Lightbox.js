'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { optimizedImageUrl } from '@/lib/media';

/**
 * Shared lightbox (gallery + project detail). Port of the design mockup's
 * src/lightbox.js, no dependencies:
 * - role="dialog" + aria-modal, focus moves to "Schließen", Tab is trapped,
 *   the page behind is `inert`, focus returns to the tile of the image the
 *   visitor ended on (or to the opener);
 * - ←/→, Home/End, Esc; prev/next buttons; edges don't wrap (small nudge);
 * - swipe follows the finger, commits at 60 px or on a flick;
 * - live "3 / 15" counter, caption with title, caption, meta and project link;
 * - the image grows from its tile (FLIP, 320 ms) and shrinks back on close;
 *   moving between images is a 140 ms out / 200 ms in slide. All motion is
 *   skipped under prefers-reduced-motion.
 * - the 640 px version (already cached from the grid) shows at once and the
 *   1920 px version replaces it when loaded; neighbours are preloaded.
 *
 * Usage: const lb = useRef(); <Lightbox ref={lb} copy={...} getOrigin={fn} />
 *        lb.current.open(items, index, originElement)
 * items: [{ src, w, h, alt, title, caption, meta, href }]
 */
const EASE = 'cubic-bezier(.2,0,0,1)';
const SMALL_W = 640;
const LARGE_W = 1920;

const Icon = {
  l: <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M11.5 3.5 6 9l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>,
  r: <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6.5 3.5 12 9l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>,
  x: <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.4" /></svg>,
};

function reduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const Lightbox = forwardRef(function Lightbox({ copy, getOrigin }, ref) {
  const [state, setState] = useState({ open: false, list: [], idx: 0 });
  const [hiReady, setHiReady] = useState({});
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const originRef = useRef(null);
  const inertedRef = useRef([]);
  const natural = useRef({});
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => setMounted(true), []);

  const item = state.list[state.idx];

  // ----- sizing -----
  const fit = useCallback(() => {
    const { list, idx } = stateRef.current;
    const it = list[idx];
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!it || !stage || !frame) return;
    const r = stage.getBoundingClientRect();
    const cs = getComputedStyle(stage);
    const aw = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const ah = r.height;
    const nat = natural.current[it.src];
    const w = nat ? nat.w : it.w;
    const h = nat ? nat.h : it.h;
    const s = Math.min(aw / w, ah / h);
    frame.style.width = `${Math.floor(w * s)}px`;
    frame.style.height = `${Math.floor(h * s)}px`;
  }, []);

  const flip = useCallback((fromEl, reverse) => {
    const frame = frameRef.current;
    if (!fromEl || !frame || reduced()) return null;
    const a = fromEl.getBoundingClientRect();
    const b = frame.getBoundingClientRect();
    if (!a.width || !b.width || a.bottom < 0 || a.top > window.innerHeight) return null;
    const t = `translate(${a.left - b.left}px,${a.top - b.top}px) scale(${a.width / b.width},${a.height / b.height})`;
    const kf = [{ transform: t, transformOrigin: '0 0' }, { transform: 'none', transformOrigin: '0 0' }];
    return frame.animate(reverse ? kf.reverse() : kf, { duration: 320, easing: EASE });
  }, []);

  // ----- open / close -----
  const open = useCallback((list, idx, originEl) => {
    if (!list?.length) return;
    openerRef.current = document.activeElement;
    originRef.current = originEl || null;
    setState({ open: true, list, idx: Math.max(0, Math.min(idx, list.length - 1)) });
  }, []);

  const finishClose = useCallback(() => {
    const { list, idx } = stateRef.current;
    document.documentElement.style.overflow = '';
    inertedRef.current.forEach((el) => { el.inert = false; });
    inertedRef.current = [];
    const target = getOrigin?.(list[idx], idx, list);
    setState((s) => ({ ...s, open: false }));
    const back = (target && (target.closest?.('button,a') || target.querySelector?.('button,a'))) || openerRef.current;
    requestAnimationFrame(() => back?.focus?.({ preventScroll: true }));
  }, [getOrigin]);

  const close = useCallback(() => {
    const { list, idx } = stateRef.current;
    const root = rootRef.current;
    if (!root || reduced()) return finishClose();
    const target = getOrigin?.(list[idx], idx, list);
    // The target must be focusable again before we scroll it into view.
    inertedRef.current.forEach((el) => { el.inert = false; });
    if (target) target.scrollIntoView({ block: 'nearest' });
    root.classList.add('is-entering');
    const anim = flip(target, true);
    const bg = root.animate(
      [{ backgroundColor: 'rgba(241,241,238,1)' }, { backgroundColor: 'rgba(241,241,238,0)' }],
      { duration: 260, easing: 'ease-in', fill: 'forwards' },
    );
    (anim || bg).onfinish = () => { bg.cancel(); finishClose(); };
    return undefined;
  }, [finishClose, flip, getOrigin]);

  useImperativeHandle(ref, () => ({ open, close }), [open, close]);

  // After the dialog is in the DOM: inert the page, size, animate, focus.
  useLayoutEffect(() => {
    if (!state.open) return undefined;
    const root = rootRef.current;
    document.documentElement.style.overflow = 'hidden';
    inertedRef.current = [...document.body.children].filter((el) => el !== root && el.tagName !== 'SCRIPT' && !el.inert);
    inertedRef.current.forEach((el) => { el.inert = true; });
    fit();
    if (!reduced() && root) {
      root.classList.add('is-entering');
      root.animate([{ backgroundColor: 'rgba(241,241,238,0)' }, { backgroundColor: 'rgba(241,241,238,1)' }], { duration: 220, easing: 'ease-out' });
      flip(originRef.current, false);
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-entering')));
    }
    closeRef.current?.focus();
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per opening
  }, [state.open]);

  // Clean up if the component unmounts while open (route change).
  useEffect(() => () => {
    document.documentElement.style.overflow = '';
    inertedRef.current.forEach((el) => { el.inert = false; });
  }, []);

  // Refit on index change and resize.
  useLayoutEffect(() => { if (state.open) fit(); }, [state.open, state.idx, fit]);
  useEffect(() => {
    if (!state.open) return undefined;
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [state.open, fit]);

  // Load the large version of the current image and preload neighbours.
  useEffect(() => {
    if (!state.open || !item) return;
    const { list, idx } = state;
    const hi = new window.Image();
    hi.decoding = 'async';
    hi.onload = () => {
      if (!item.known && hi.naturalWidth) {
        natural.current[item.src] = { w: hi.naturalWidth, h: hi.naturalHeight };
        fit();
      }
      setHiReady((r) => ({ ...r, [item.src]: true }));
    };
    hi.src = optimizedImageUrl(item.src, LARGE_W);
    [idx - 1, idx + 1].forEach((n) => {
      if (list[n]) { const p = new window.Image(); p.src = optimizedImageUrl(list[n].src, LARGE_W); }
    });
  }, [state, item, fit]);

  // ----- navigation -----
  const go = useCallback((dir) => {
    const { list, idx } = stateRef.current;
    const frame = frameRef.current;
    const n = idx + dir;
    if (n < 0 || n >= list.length) {
      if (!reduced() && frame) {
        frame.animate([{ transform: 'none' }, { transform: `translateX(${-dir * 14}px)` }, { transform: 'none' }], { duration: 220, easing: EASE });
      }
      return;
    }
    if (reduced() || !frame) { setState((s) => ({ ...s, idx: n })); return; }
    const out = frame.animate(
      [{ opacity: 1, transform: frame.style.transform || 'none' }, { opacity: 0, transform: `translateX(${-dir * 40}px)` }],
      { duration: 140, easing: 'ease-in', fill: 'forwards' },
    );
    out.onfinish = () => {
      frame.style.transform = '';
      setState((s) => ({ ...s, idx: n }));
      requestAnimationFrame(() => {
        out.cancel();
        frame.animate([{ opacity: 0, transform: `translateX(${dir * 40}px)` }, { opacity: 1, transform: 'none' }], { duration: 200, easing: EASE });
      });
    };
  }, []);

  const jump = useCallback((n) => setState((s) => ({ ...s, idx: n })), []);

  const onKeyDown = (e) => {
    const { list } = stateRef.current;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Home') { e.preventDefault(); jump(0); }
    else if (e.key === 'End') { e.preventDefault(); jump(list.length - 1); }
    else if (e.key === 'Tab') {
      const f = [...rootRef.current.querySelectorAll('button:not([disabled]), a[href]')].filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  // ----- swipe (touch, pen, mouse drag) -----
  const drag = useRef({ on: false, axis: null, sx: 0, sy: 0, t0: 0 });
  const onPointerDown = (e) => {
    if (e.target.closest('button,a')) return;
    drag.current = { on: true, axis: null, sx: e.clientX, sy: e.clientY, t0: performance.now() };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.on) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis === 'x') stageRef.current.setPointerCapture?.(e.pointerId);
    }
    if (d.axis === 'x' && !reduced() && frameRef.current) {
      const { list, idx } = stateRef.current;
      const atEdge = (dx > 0 && idx === 0) || (dx < 0 && idx === list.length - 1);
      frameRef.current.style.transform = `translateX(${atEdge ? dx * 0.25 : dx}px)`;
    }
  };
  const endDrag = (e) => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    const { list, idx } = stateRef.current;
    const dx = e.clientX - d.sx;
    const v = dx / Math.max(1, performance.now() - d.t0);
    const frame = frameRef.current;
    if (d.axis === 'x' && (dx < -60 || v < -0.45) && idx < list.length - 1) go(1);
    else if (d.axis === 'x' && (dx > 60 || v > 0.45) && idx > 0) go(-1);
    else if (frame?.style.transform) {
      const from = frame.style.transform;
      frame.style.transform = '';
      if (!reduced()) frame.animate([{ transform: from }, { transform: 'none' }], { duration: 200, easing: EASE });
    }
    d.axis = null;
  };

  if (!mounted || !state.open || !item) return null;

  const first = state.idx === 0;
  const last = state.idx === state.list.length - 1;
  const src = hiReady[item.src] ? optimizedImageUrl(item.src, LARGE_W) : optimizedImageUrl(item.src, SMALL_W);

  return createPortal(
    <div
      ref={rootRef}
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={copy.dialog}
      aria-describedby="lb-cap"
      onKeyDown={onKeyDown}
    >
      <div className="lb-top lb-chrome">
        <p className="lb-count" aria-live="polite">
          {state.idx + 1} <span>/ {state.list.length}</span>
        </p>
        <button ref={closeRef} type="button" className="lb-close" onClick={close}>
          {copy.close} {Icon.x}
        </button>
      </div>
      <div
        ref={stageRef}
        className="lb-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={frameRef} className="lb-frame">
          {/* eslint-disable-next-line @next/next/no-img-element -- optimizer URL built by hand: small first, large swapped in */}
          <img src={src} alt={item.alt || ''} draggable={false} />
        </div>
        <button type="button" className="lb-arrow lb-prev lb-chrome" aria-label={copy.prev} disabled={first} onClick={() => go(-1)}>{Icon.l}</button>
        <button type="button" className="lb-arrow lb-next lb-chrome" aria-label={copy.next} disabled={last} onClick={() => go(1)}>{Icon.r}</button>
      </div>
      <div className="lb-bottom lb-chrome">
        <div id="lb-cap">
          {item.title && <h2 className="lb-title">{item.title}</h2>}
          {item.caption && <p className="lb-cap">{item.caption}</p>}
          {item.meta && <p className="lb-meta">{item.meta}</p>}
        </div>
        <div className="lb-actions">
          {item.href ? <a className="link lb-link" href={item.href}>{copy.toProject}</a> : <span />}
          <span className="lb-steps">
            <button type="button" className="lb-step" aria-label={copy.prev} disabled={first} onClick={() => go(-1)}>{Icon.l}</button>
            <button type="button" className="lb-step" aria-label={copy.next} disabled={last} onClick={() => go(1)}>{Icon.r}</button>
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
});

export default Lightbox;
