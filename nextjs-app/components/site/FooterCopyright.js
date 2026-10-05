'use client';

import { useRef } from 'react';
import { getCmsUrl } from '@/lib/site';

/**
 * Copyright line. A triple-click opens the CMS: an intentional editor
 * shortcut documented in TRIPLE-CLICK-CMS-ACCESS.md (kept from the previous
 * footer). It is deliberately not styled as clickable; getCmsUrl() never
 * returns a localhost URL in production builds.
 */
export default function FooterCopyright({ children }) {
  const clicks = useRef(0);
  const timer = useRef(null);

  const onClick = () => {
    clearTimeout(timer.current);
    clicks.current += 1;
    if (clicks.current >= 3) {
      clicks.current = 0;
      window.location.href = getCmsUrl(window.location.hostname);
      return;
    }
    timer.current = setTimeout(() => { clicks.current = 0; }, 1000);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- hidden editor shortcut, not a visitor feature
    <p className="f-copy" onClick={onClick}>{children}</p>
  );
}
