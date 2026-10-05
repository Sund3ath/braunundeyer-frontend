'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * next/image with the one sanctioned "arrival" motion: the photo fades in over
 * 240 ms once decoded (CSS `.is-loaded`, see app/globals.css), on top of the
 * render-white placeholder of its `.ph` / `.tile` parent. Reduced motion makes
 * the fade instant (global rule). Without JS the <noscript> style in the
 * layout keeps images visible.
 *
 * Extension point: pass `blurDataURL` (from the API, once it exists) and the
 * blurred LQIP is shown underneath via next/image's placeholder.
 */
export default function Photo({ alt = '', className = '', blurDataURL, onLoad, onError, ...props }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      {...(blurDataURL ? { placeholder: 'blur', blurDataURL } : {})}
      className={`${className} ${loaded ? 'is-loaded' : ''}`.trim()}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setLoaded(true);
        onError?.(e);
      }}
    />
  );
}
