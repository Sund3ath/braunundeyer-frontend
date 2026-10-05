/**
 * Gallery loading state (shown while the server streams the page during
 * client-side navigation): skeleton rows in the justified pattern.
 */
const RATIOS = [1.5, 0.75, 1.33, 1.33, 0.67, 1.5, 1.33, 0.75, 1.33, 1.5, 1.33, 0.8, 1.33, 1.5, 0.75, 1.33];

export default function GalleryLoading() {
  return (
    <main id="main" aria-busy="true">
      <div className="wrap cols g-head">
        <div className="sk" style={{ height: 'clamp(2.4rem, 1.5rem + 3.4vw, 4.5rem)', width: '40%' }} />
      </div>
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <ul className="jg" aria-hidden="true" style={{ paddingTop: 'var(--s-8)' }}>
          {RATIOS.map((ar, i) => (
            <li key={i} className="tile" style={{ '--ar': ar }} />
          ))}
        </ul>
      </div>
    </main>
  );
}
