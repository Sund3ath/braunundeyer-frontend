'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Photo from '@/components/ui/Photo';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Project list with a quiet category filter. All projects are in the server
 * HTML (crawlable); the filter only hides entries. The choice is kept in the
 * URL (?kategorie=neubau) so a filtered list can be shared.
 */
export default function ProjectIndex({ projects, categories, copy }) {
  const [cat, setCat] = useState('alle');
  const listRef = useRef(null);
  const changed = useRef(false);

  // Read the filter from the URL after hydration (the page itself is static).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('kategorie');
    if (q && categories.some((c) => c.key === q)) setCat(q);
  }, [categories]);

  const choose = (key) => {
    changed.current = true;
    setCat(key);
    const url = new URL(window.location.href);
    if (key === 'alle') url.searchParams.delete('kategorie'); else url.searchParams.set('kategorie', key);
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  };

  // Filter change: the list crossfades in 200 ms (skipped for reduced motion).
  useIsoLayoutEffect(() => {
    if (!changed.current || !listRef.current) return;
    changed.current = false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    listRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
  }, [cat]);

  const visible = projects.filter((p) => cat === 'alle' || p.categoryKey === cat);

  return (
    <>
      {categories.length > 1 && (
        <div className="pfilter" role="group" aria-label={copy.filterLabel}>
          {[{ key: 'alle', label: copy.all, count: projects.length }, ...categories].map((c) => (
            <button
              key={c.key}
              type="button"
              className="opt"
              aria-pressed={cat === c.key}
              onClick={() => choose(c.key)}
            >
              {c.label}
              <span className="n" aria-hidden="true">{c.count}</span>
            </button>
          ))}
        </div>
      )}
      <ul className="p-list" ref={listRef}>
        {projects.map((p, i) => (
          <li key={p.id} className="p-item" hidden={!visible.includes(p)}>
            <article>
              <Link href={p.href}>
                {p.cover ? (
                  <span className="ph">
                    <Photo
                      src={p.cover.src}
                      alt={p.cover.alt}
                      width={p.cover.w}
                      height={p.cover.h}
                      sizes="(min-width: 1024px) 30vw, (min-width: 600px) 50vw, 100vw"
                      className="w-full h-auto"
                      priority={i < 3}
                    />
                  </span>
                ) : (
                  <span className="p-noimg t-meta" aria-hidden="true">{p.categoryLabel}</span>
                )}
                <h2 className="t-h3">{p.title}</h2>
                {p.meta && <p className="t-meta">{p.meta}</p>}
              </Link>
            </article>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="g-empty">{copy.emptyCategory}</p>}
    </>
  );
}
