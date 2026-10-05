'use client';

import { useCallback, useState } from 'react';
import { optimizedImageUrl } from '@/lib/media';

const WIDTHS = [384, 640, 1080];

/**
 * Compact gallery image: a plain <img> with a three-step srcset through the
 * Next.js image optimizer (next/image would emit 16 candidates per tile, which
 * adds up over 140+ tiles). Same fade-in contract as components/ui/Photo.js.
 * Images that finished loading before hydration are detected via the ref.
 */
export default function TileImage({ src, alt, sizes, eager = false, className = '', onLoad, onError }) {
  const [loaded, setLoaded] = useState(false);

  const ref = useCallback((img) => {
    if (img && img.complete && img.naturalWidth) {
      setLoaded(true);
      onLoad?.({ currentTarget: img, target: img });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- check once on mount
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- optimizer URLs with a hand-picked srcset
    <img
      ref={ref}
      src={optimizedImageUrl(src, 640)}
      srcSet={WIDTHS.map((w) => `${optimizedImageUrl(src, w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`${className} ${loaded ? 'is-loaded' : ''}`.trim()}
      onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
      onError={(e) => { setLoaded(true); onError?.(e); }}
    />
  );
}
