'use client';

import { useParams } from 'next/navigation';
import { getUiCopy } from '@/lib/ui-copy';

/** Gallery error state: what happened and what to do next. */
export default function GalleryError({ reset }) {
  const { lang } = useParams();
  const copy = getUiCopy(lang).gallery;
  return (
    <main id="main" className="wrap">
      <div className="g-empty" role="alert">
        <h1 className="t-h3">{copy.errorTitle}</h1>
        <p>{copy.errorText}</p>
        <button type="button" className="btn btn--ghost" onClick={() => reset()}>{copy.reload}</button>
      </div>
    </main>
  );
}
