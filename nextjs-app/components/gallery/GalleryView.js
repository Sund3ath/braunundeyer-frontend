'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import TileImage from '@/components/ui/TileImage';
import Lightbox from '@/components/ui/Lightbox';
import { fmt, plural } from '@/lib/fmt';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const Chevron = (
  <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
);

/** Approximate rendered tile width (CSS: --row 104/180/250 px, rows grow ~30%). */
function tileSizes(ar) {
  const px = (row, k) => Math.round(ar * row * k);
  return `(min-width: 1024px) ${px(250, 1.35)}px, (min-width: 600px) ${px(180, 1.35)}px, ${Math.min(px(104, 1.7), 430)}px`;
}

/**
 * Gallery (port of the design mockup's src/gallery.js):
 * - justified rows that keep every photo's true aspect ratio (pure CSS, see
 *   `.jg` in app/globals.css; server-rendered, no layout JS);
 * - quiet typographic facets (category, year) with counts; empty options are
 *   dimmed and inert, so a filter never leads to a dead end;
 * - two views: "Raster" and "Nach Projekt" (contact sheets per project);
 * - state in the URL (?kategorie=&jahr=&ansicht=&projekt=), read on the
 *   server for the first render, kept in sync with history.replaceState;
 * - the shared keyboard-accessible lightbox;
 * - empty / filter-empty / error states.
 * Motion: tiles fade in on load; the grid crossfades (200 ms) on filter change.
 */
export default function GalleryView({ lang, images, projects, categories, years, initial, copy, common, lightboxCopy, error }) {
  const [state, setState] = useState(initial);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [learned, setLearned] = useState({}); // id -> aspect ratio learned on load
  const [broken, setBroken] = useState({}); // id -> true when the file failed
  const [stuck, setStuck] = useState(false);
  const lb = useRef(null);
  const resultsRef = useRef(null);
  const sentinelRef = useRef(null);
  const changed = useRef(false);
  const pendingLearn = useRef({});
  const learnFrame = useRef(0);

  const projectById = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p])), [projects]);
  const catLabel = useMemo(() => Object.fromEntries(categories.map((c) => [c.key, c.label])), [categories]);
  const usable = useMemo(() => images.filter((m) => !broken[m.id]), [images, broken]);

  const match = useCallback((m, cat, year) => {
    const p = projectById[m.projectId];
    return (cat === 'alle' || p.categoryKey === cat)
      && (year === 'alle' || String(p.year) === year)
      && (!state.project || m.projectId === state.project);
  }, [projectById, state.project]);

  const current = useMemo(() => usable.filter((m) => match(m, state.cat, state.year)), [usable, match, state.cat, state.year]);
  const projectCount = useMemo(() => new Set(current.map((m) => m.projectId)).size, [current]);

  // ----- state <-> URL -----
  const update = (patch) => {
    changed.current = true;
    setState((s) => ({ ...s, ...patch }));
  };
  useEffect(() => {
    if (!changed.current) return;
    const u = new URLSearchParams();
    if (state.cat !== 'alle') u.set('kategorie', state.cat);
    if (state.year !== 'alle') u.set('jahr', state.year);
    if (state.view !== 'raster') u.set('ansicht', state.view);
    if (state.project) u.set('projekt', state.project);
    const qs = u.toString();
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }, [state]);

  // Filter / view change: crossfade the results (reduced motion: instant).
  useIsoLayoutEffect(() => {
    if (!changed.current || !resultsRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    resultsRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
  }, [state]);

  // Sticky toolbar gets its hairline only once it is actually stuck.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Images without known dimensions: learn the natural size on load (one
  // reflow, batched per frame).
  const learn = useCallback((m, e) => {
    if (m.known) return;
    const img = e?.currentTarget || e?.target;
    if (!img?.naturalWidth) return;
    const ar = img.naturalWidth / img.naturalHeight;
    if (Math.abs(ar - m.w / m.h) < 0.02) return;
    pendingLearn.current[m.id] = ar;
    cancelAnimationFrame(learnFrame.current);
    learnFrame.current = requestAnimationFrame(() => {
      const batch = pendingLearn.current;
      pendingLearn.current = {};
      setLearned((l) => ({ ...l, ...batch }));
    });
  }, []);
  const fail = useCallback((m) => setBroken((b) => ({ ...b, [m.id]: true })), []);
  const ratio = (m) => learned[m.id] || m.w / m.h;

  // ----- lightbox -----
  const lbItem = (m) => {
    const p = projectById[m.projectId];
    const ar = ratio(m);
    return {
      src: m.src, w: m.known ? m.w : Math.round(ar * 1000), h: m.known ? m.h : 1000, known: m.known || Boolean(learned[m.id]),
      alt: m.alt, title: p.title, caption: m.caption, meta: p.meta, href: p.href, gi: m.id,
    };
  };
  const getOrigin = useCallback((item) => (
    resultsRef.current?.querySelector(`[data-gi="${item.gi}"] img`) || null
  ), []);
  const openAt = (m, el, subset) => {
    const list = subset || current;
    lb.current?.open(list.map(lbItem), list.indexOf(m), el?.querySelector('img') || null);
  };

  // ----- facets -----
  const catOptions = [{ key: 'alle', label: copy.allCategories }, ...categories].map((c) => ({
    ...c, n: usable.filter((m) => match(m, c.key, state.year)).length, pressed: state.cat === c.key,
  }));
  const yearOptions = [{ key: 'alle', label: copy.allYears }, ...years.map((y) => ({ key: y, label: y }))].map((y) => ({
    ...y, n: usable.filter((m) => match(m, state.cat, y.key)).length, pressed: state.year === y.key,
  }));
  const summary = [
    state.cat !== 'alle' ? catLabel[state.cat] : null,
    state.year !== 'alle' ? state.year : null,
    state.project ? projectById[state.project]?.title : null,
  ].filter(Boolean).join(', ') || copy.allCategories;
  const filtered = state.cat !== 'alle' || state.year !== 'alle' || Boolean(state.project);
  const reset = () => update({ cat: 'alle', year: 'alle', project: null });

  const option = (group, o) => {
    const disabled = o.n === 0 && !o.pressed;
    return (
      <button
        key={o.key}
        type="button"
        className="opt"
        aria-pressed={o.pressed}
        aria-disabled={disabled || undefined}
        onClick={() => { if (!disabled) update(group === 'cat' ? { cat: o.key } : { year: o.key }); }}
      >
        {o.label}
        <span className="n" aria-hidden="true">{o.n}</span>
        <span className="sr-only">, {o.n} {plural(o.n, common.images)}</span>
      </button>
    );
  };

  // ----- states -----
  const total = usable.length;
  const status = total
    ? fmt(copy.status, { n: current.length, images: plural(current.length, common.images), p: projectCount, projects: plural(projectCount, copy.projectsPlural) })
    : '';

  let body;
  if (error && !images.length) {
    body = (
      <div className="g-empty" role="alert">
        <h2 className="t-h3">{copy.errorTitle}</h2>
        <p>{copy.errorText}</p>
        <button type="button" className="btn btn--ghost" onClick={() => window.location.reload()}>{copy.reload}</button>
      </div>
    );
  } else if (!total) {
    body = (
      <div className="g-empty">
        <h2 className="t-h3">{copy.emptyTitle}</h2>
        <p>{copy.emptyText}</p>
        <p><Link className="link" href={`/${lang}/projekte`}>{copy.toProjects}</Link></p>
      </div>
    );
  } else if (!current.length) {
    const what = [
      state.cat !== 'alle' ? catLabel[state.cat] : null,
      state.year !== 'alle' ? fmt(copy.filterEmptyYear, { year: state.year }) : null,
    ].filter(Boolean).join(' ') || copy.filterEmptyFallback;
    body = (
      <div className="g-empty">
        <h2 className="t-h3">{fmt(copy.filterEmptyTitle, { what })}</h2>
        <p>{copy.filterEmptyText}</p>
        <button type="button" className="btn btn--ghost" onClick={reset}>{copy.reset}</button>
      </div>
    );
  } else if (state.view === 'raster') {
    body = (
      <ul className="jg" aria-label={copy.grid}>
        {current.map((m, i) => {
          const p = projectById[m.projectId];
          const ar = ratio(m);
          return (
            <li key={m.id} className="tile" style={{ '--ar': ar.toFixed(4) }}>
              <button
                type="button"
                className="tile-btn"
                data-gi={m.id}
                aria-label={fmt(common.enlarge, { label: m.alt })}
                onClick={(e) => openAt(m, e.currentTarget)}
              >
                <TileImage
                  src={m.src}
                  alt={m.alt}
                  sizes={tileSizes(ar)}
                  eager={i < 8}
                  onLoad={(e) => learn(m, e)}
                  onError={() => fail(m)}
                />
                <span className="tile-cap" aria-hidden="true">
                  <b>{p.title}</b>
                  {m.caption && <i>{m.caption}</i>}
                  {p.metaShort && <i>{p.metaShort}</i>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  } else {
    const groups = projects
      .map((p) => ({ p, imgs: current.filter((m) => m.projectId === p.id) }))
      .filter((g) => g.imgs.length);
    body = (
      <div className="sheets">
        {groups.map(({ p, imgs }) => (
          <section key={p.id} className="sheet cols" aria-labelledby={`s-${p.id}`}>
            <div className="sheet-info">
              <h2 className="t-h3" id={`s-${p.id}`}>{p.title}</h2>
              {p.subtitle && <p className="t-small">{p.subtitle}</p>}
              <dl className="t-meta">
                {p.location && (<><dt>{copy.location}</dt><dd>{p.location}</dd></>)}
                {p.year && (<><dt>{copy.year}</dt><dd>{p.year}</dd></>)}
                {p.categoryLabel && (<><dt>{copy.category}</dt><dd>{p.categoryLabel}</dd></>)}
                <dt>{copy.count}</dt><dd>{imgs.length}</dd>
              </dl>
              <Link className="link" href={p.href}>{common.viewProject}</Link>
            </div>
            <div className="cells">
              {imgs.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="cell"
                  data-gi={m.id}
                  aria-label={fmt(common.enlarge, { label: m.alt })}
                  onClick={(e) => openAt(m, e.currentTarget, imgs)}
                >
                  <span className="cell-in">
                    <TileImage
                      src={m.src}
                      alt={m.alt}
                      sizes="(min-width: 1024px) 14vw, (min-width: 600px) 23vw, 31vw"
                      onError={() => fail(m)}
                    />
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="g-sentinel" ref={sentinelRef} aria-hidden="true" />
      {total > 0 && (
        <div className={`toolbar${stuck ? ' is-stuck' : ''}`}>
          <div className="wrap tb-row">
            <button
              type="button"
              className="tb-toggle"
              aria-expanded={filtersOpen}
              aria-controls="g-filters"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              {copy.filter} <span className="sum">{summary}</span> {Chevron}
            </button>
            <div className={`filters${filtersOpen ? ' is-open' : ''}`} id="g-filters">
              <div className="facet" role="group" aria-label={copy.category}>
                {catOptions.map((o) => option('cat', o))}
              </div>
              {years.length > 0 && (
                <>
                  <span className="facet-sep" aria-hidden="true" />
                  <div className="facet" role="group" aria-label={copy.year}>
                    {yearOptions.map((o) => option('year', o))}
                  </div>
                </>
              )}
            </div>
            <div className="views" role="group" aria-label={copy.view}>
              <button type="button" className="opt" aria-pressed={state.view === 'raster'} onClick={() => update({ view: 'raster' })}>{copy.raster}</button>
              <button type="button" className="opt" aria-pressed={state.view === 'projekt'} onClick={() => update({ view: 'projekt' })}>{copy.byProject}</button>
            </div>
          </div>
        </div>
      )}
      <div className="wrap">
        {total > 0 && (
          <p className="g-status t-meta">
            <span role="status">{status}</span>
            {filtered && current.length > 0 && <button type="button" className="link" onClick={reset}>{copy.reset}</button>}
          </p>
        )}
        <div ref={resultsRef}>{body}</div>
      </div>
      <Lightbox ref={lb} copy={lightboxCopy} getOrigin={getOrigin} />
    </>
  );
}
