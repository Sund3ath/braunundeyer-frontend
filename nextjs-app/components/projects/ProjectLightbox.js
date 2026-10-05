'use client';

import { useCallback, useRef } from 'react';
import Lightbox from '@/components/ui/Lightbox';

/**
 * Wraps the (server-rendered) project images and opens the shared lightbox
 * for any descendant button with `data-lb="<index>"`. Buttons that contain
 * the photo (`.shot`) are the FLIP origin; "view all" buttons open at the
 * given index without an origin.
 */
export default function ProjectLightbox({ items, copy, children }) {
  const lb = useRef(null);
  const root = useRef(null);

  const getOrigin = useCallback((item, idx) => (
    root.current?.querySelector(`.shot[data-lb="${idx}"] img`) || null
  ), []);

  const onClick = (e) => {
    const btn = e.target.closest('[data-lb]');
    if (!btn || !root.current?.contains(btn)) return;
    const idx = Number(btn.dataset.lb) || 0;
    const origin = btn.classList.contains('shot') ? btn.querySelector('img') : null;
    lb.current?.open(items, idx, origin);
  };

  return (
    // Click delegation for real <button>s inside; keyboard works natively.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div ref={root} onClick={onClick}>
      {children}
      <Lightbox ref={lb} copy={copy} getOrigin={getOrigin} />
    </div>
  );
}
