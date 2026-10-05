/**
 * Backdrop typography: giant display words behind a section, set like the
 * annotations on a drawing sheet (outlined and ultra-faint filled Newsreader,
 * bleeding off the edges, with a dimension line and an index label).
 *
 * Pure markup, no client JS, safe in server and client components.
 * - The words are CSS generated content (`content: attr(data-w)`), so they are
 *   not part of the document text: not indexed, not copied, not read aloud.
 *   The container is also aria-hidden, inert to the pointer and unselectable.
 * - Absolutely positioned inside a `.has-bt` parent: no layout shift. The
 *   container clips itself and `main` clips horizontally, so the bleed never
 *   causes horizontal scrolling.
 * - Motion is CSS only: a slow horizontal drift tied to the section's scroll
 *   position (scroll-driven animations, `@supports (animation-timeline: view())`),
 *   off under prefers-reduced-motion. Without support the layout is static.
 * Styles: app/globals.css, section "Backdrop typography".
 */

// Compositions per placement. Positions are relative to the full-bleed
// container (vw so the bleed is the same at every width), `y` is the top in %
// of the container height, `d` the drift distance across the section's scroll
// range (sign = direction, size = depth). `size`: xl | l | m.
const LAYOUTS = {
  intro: {
    words: [
      { key: 'architecture', style: 'fill', size: 'xl', l: '-3vw', y: '9%', d: '5vw', n: '01', end: true },
      { key: 'design', style: 'stroke', size: 'l', r: '-7vw', y: '50%', d: '-8vw' },
    ],
    cross: { x: '62%', y: '18%' },
  },
  projects: {
    words: [
      { key: 'vision', style: 'stroke', size: 'xl', r: '-9vw', y: '2%', d: '-7vw' },
      { key: 'innovation', style: 'fill', size: 'l', l: '-12vw', y: '56%', d: '9vw', n: '02', end: true },
    ],
    cross: { x: '8%', y: '38%' },
  },
  services: {
    words: [
      { key: 'build', style: 'fill', size: 'xl', l: '-4vw', y: '6%', d: '7vw', n: '03', end: true },
      { key: 'renovate', style: 'stroke', size: 'l', r: '-14vw', y: '48%', d: '-10vw' },
      { key: 'heritage', style: 'stroke', size: 'm', l: '6vw', y: '80%', d: '5vw' },
    ],
    cross: { x: '88%', y: '30%' },
  },
  office: {
    words: [
      { key: 'space', style: 'fill', size: 'xl', r: '-5vw', y: '10%', d: '-6vw', n: '04' },
    ],
    cross: { x: '6%', y: '78%' },
  },
  pageServices: {
    words: [
      { key: 'build', style: 'fill', size: 'xl', l: '-4vw', y: '3rem', d: '7vw', n: '03', end: true },
      { key: 'renovate', style: 'stroke', size: 'l', r: '-12vw', y: '38%', d: '-10vw' },
      { key: 'heritage', style: 'stroke', size: 'm', l: '5vw', y: '72%', d: '6vw' },
    ],
    cross: { x: '90%', y: '14rem' },
  },
  pageProjects: {
    words: [
      { key: 'vision', style: 'stroke', size: 'xl', r: '-9vw', y: '2.5rem', d: '-7vw' },
      { key: 'innovation', style: 'fill', size: 'l', l: '-10vw', y: '46%', d: '9vw', n: '02', end: true },
      { key: 'architecture', style: 'stroke', size: 'm', r: '-5vw', y: '80%', d: '-6vw' },
    ],
    cross: { x: '8%', y: '16rem' },
  },
  pageOffice: {
    words: [
      { key: 'space', style: 'fill', size: 'xl', r: '-5vw', y: '2.5rem', d: '-6vw', n: '04', end: true },
      { key: 'architecture', style: 'stroke', size: 'l', r: '-8vw', y: '60%', d: '-8vw' },
    ],
    cross: { x: '6%', y: '20rem' },
  },
  projectHead: {
    words: [
      { key: 'design', style: 'stroke', size: 'xl', r: '-8vw', y: '1.5rem', d: '-7vw' },
    ],
    cross: { x: '7%', y: '12rem' },
  },
  // Long image sequences: a word every ~95vh, alternating sides/styles. Words
  // below the end of the section are simply clipped, so one layout fits any
  // number of photos. They show in the gaps and margins around the photos.
  sequence: {
    words: ['architecture', 'design', 'innovation', 'vision', 'space', 'build', 'renovate', 'heritage', 'architecture', 'design'].map((key, i) => ({
      key,
      id: `${key}-${i}`,
      style: i % 2 ? 'stroke' : 'fill',
      size: i % 3 === 0 ? 'xl' : 'l',
      ...(i % 2 ? { r: `${-6 - (i % 4) * 2}vw` } : { l: `${-5 - (i % 3) * 3}vw` }),
      y: `${6 + i * 95}svh`,
      d: `${i % 2 ? -8 : 8}vw`,
      ...(i % 3 === 0 ? { n: String(i + 1).padStart(2, '0'), end: i % 2 === 1 } : {}),
    })),
  },
  cta: {
    words: [
      { key: 'dialogue', style: 'stroke', size: 'l', l: '-8vw', y: '14%', d: '8vw' },
    ],
  },
  contact: {
    words: [
      { key: 'contact', style: 'fill', size: 'xl', l: '-4vw', y: '10%', d: '6vw', n: '01', end: true },
      { key: 'dialogue', style: 'stroke', size: 'l', r: '-10vw', y: '34%', d: '-8vw' },
    ],
    cross: { x: '70%', y: '10%' },
  },
  splash: {
    words: [
      { key: 'architecture', style: 'stroke', size: 'xl', l: '-6vw', y: '77%', d: '4vw' },
    ],
  },
};

/**
 * @param variant  key of LAYOUTS
 * @param words    lib/ui-copy.js `typo` block for the current language
 * @param tone     'light' (white ground) | 'putz' (#F1F1EE ground) | 'dark'
 */
export default function BackdropType({ variant, words, tone = 'light', className = '' }) {
  const layout = LAYOUTS[variant];
  if (!layout || !words) return null;
  const style = layout.cross ? { '--cx': layout.cross.x, '--cy': layout.cross.y } : undefined;
  return (
    <div
      className={`bt bt--${tone} bt--${variant}${layout.cross ? ' bt--cross' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      {layout.words.map((w) => {
        const text = words[w.key];
        if (!text) return null;
        return (
          <span
            key={w.id || w.key}
            className={`bt-w bt-${w.style} bt-${w.size}${w.end ? ' bt-end' : ''}`}
            data-w={text}
            data-n={w.n}
            style={{
              '--y': w.y,
              '--d': w.d,
              ...(w.l ? { left: w.l } : { right: w.r }),
            }}
          />
        );
      })}
    </div>
  );
}
