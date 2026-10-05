/** @type {import('tailwindcss').Config} */
// Design tokens: "Werkverzeichnis" direction (design REVIEW §2.3 / §2.8).
// Black/white base, RAL-referenced neutrals, no chromatic accent, square
// corners. Component styles live in app/globals.css (plain CSS classes such as
// .wrap, .grid, .t-h2, .btn); Tailwind utilities are used for small layout
// adjustments only.
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        anthracite: '#383E42', // RAL 7016, body text (10.9:1 on white)
        muted: '#62676B', // metadata / captions (5.7:1 on white, 5.0:1 on putz)
        faint: '#A9ADAF', // disabled options only
        line: '#D9D9D4', // hairlines, input borders
        putz: '#F1F1EE', // surfaces, placeholders, lightbox ground
        paper: '#FFFFFF',

        // Legacy aliases, mapped onto the new palette so any remaining
        // utility class keeps a sensible, accessible colour. The old silver
        // accent (#C0C0C0, 1.8:1 on white) is retired from text.
        primary: '#000000',
        secondary: '#383E42',
        accent: '#383E42',
        background: '#FFFFFF',
        surface: '#F1F1EE',
        border: '#D9D9D4',
        'text-primary': '#000000',
        'text-secondary': '#62676B',
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Times New Roman', 'Times', 'serif'],
        sans: ['var(--font-archivo)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Legacy names (NotFoundContent etc.)
        heading: ['var(--font-newsreader)', 'Times New Roman', 'Times', 'serif'],
        body: ['var(--font-archivo)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2.625rem, 1.15rem + 5.4vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
        h1: ['clamp(2.375rem, 1.5rem + 3.4vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.875rem, 1.4rem + 1.9vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.3125rem, 1.15rem + .55vw, 1.625rem)', { lineHeight: '1.2' }],
        lead: ['clamp(1.25rem, 1.05rem + .75vw, 1.6875rem)', { lineHeight: '1.42' }],
        prose: ['clamp(1.125rem, 1.05rem + .3vw, 1.3125rem)', { lineHeight: '1.62' }],
        meta: ['0.8125rem', { lineHeight: '1.45' }],
      },
      // Spacing: Tailwind's default 4px scale already matches the design scale
      // (1=4, 2=8, 3=12, 4=16, 6=24, 8=32, 12=48, 16=64, 24=96, 32=128, 40=160).
      maxWidth: { site: '1440px' },
      borderRadius: { DEFAULT: '0' },
      transitionTimingFunction: {
        out: 'cubic-bezier(.22,1,.36,1)',
        lightbox: 'cubic-bezier(.2,0,0,1)',
      },
      transitionDuration: { fast: '160ms', base: '240ms', slow: '320ms' },
      zIndex: {
        header: '30',
        toolbar: '20',
        menu: '90',
        lightbox: '100',
        consent: '80',
      },
    },
  },
  plugins: [],
};
