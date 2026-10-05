import { Newsreader, Archivo } from 'next/font/google';

// Werkverzeichnis type pairing (design REVIEW §2.1), self-hosted by next/font.
// - Newsreader (variable, optical sizes): wordmark, headlines, project texts.
// - Archivo: navigation, captions, forms, functional text.
// tailwind.config.js maps font-serif / font-sans to these CSS variables, and
// app/globals.css uses them directly. The variable classes must sit on <html>
// (see app/[lang]/layout.js and app/not-found.js).
export const serif = Newsreader({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  style: ['normal'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const sans = Archivo({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-archivo',
  display: 'swap',
});

export const fontVariables = `${serif.variable} ${sans.variable}`;
