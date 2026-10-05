#!/usr/bin/env node
/**
 * Generates the plain brand assets in /public from SVG sources:
 *
 *   icon.svg, favicon.ico (16/32/48), apple-touch-icon.png (180),
 *   icon-192x192.png, icon-512x512.png      – black tile with a white "b&e"
 *   logo.svg, logo.png (600x600)            – the text wordmark used in JSON-LD
 *   og-image.jpg (1200x630)                 – default Open Graph / Twitter card
 *
 * They reproduce the existing text wordmark (white serif on black, as in the
 * site header); they are not a new logo. Re-run after changing the SVGs:
 *
 *   node scripts/generate-brand-assets.mjs
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => path.join(root, 'public', f);

const SERIF = "'Times New Roman', Times, 'Liberation Serif', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// Square icon: black tile, white "b&e".
const iconSvg = (size = 512) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#000"/>
  <text x="256" y="318" text-anchor="middle" font-family="${SERIF}" font-size="216" fill="#fff">b&amp;e</text>
  <rect x="112" y="352" width="288" height="8" fill="#fff"/>
</svg>
`;

// Wordmark block (as in the header): "braun & eyer", hairline, "architekten".
// Drawn centred on (cx, cy) at a given scale.
function wordmark(cx, cy, s = 1, color = '#fff') {
  const fs = 44 * s;
  const ls1 = fs * 0.4;
  const ls2 = fs * 0.52;
  return `
  <text x="${cx}" y="${cy - 14 * s}" text-anchor="middle" font-family="${SERIF}" font-size="${fs}" letter-spacing="${ls1}" fill="${color}">braun &amp; eyer</text>
  <rect x="${cx - 215 * s}" y="${cy + 2 * s}" width="${430 * s}" height="${Math.max(1, 2 * s)}" fill="${color}"/>
  <text x="${cx}" y="${cy + 50 * s}" text-anchor="middle" font-family="${SERIF}" font-size="${fs}" letter-spacing="${ls2}" fill="${color}">architekten</text>`;
}

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="#000"/>${wordmark(300, 300, 1.1)}
</svg>
`;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fff"/>
  <rect x="330" y="150" width="540" height="230" fill="#000"/>${wordmark(600, 265, 1.05)}
  <text x="600" y="462" text-anchor="middle" font-family="${SANS}" font-size="30" fill="#383E42">Architekturbüro in Saarbrücken</text>
  <rect x="560" y="500" width="80" height="2" fill="#383E42"/>
</svg>
`;

/** Minimal ICO writer: PNG-compressed entries (supported by all current browsers). */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

async function main() {
  const icon = iconSvg(512);
  await writeFile(pub('icon.svg'), icon);

  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(icoSizes.map(async (size) => ({ size, data: await png(icon, size) })));
  await writeFile(pub('favicon.ico'), buildIco(icoPngs));

  await writeFile(pub('apple-touch-icon.png'), await png(icon, 180));
  await writeFile(pub('icon-192x192.png'), await png(icon, 192));
  await writeFile(pub('icon-512x512.png'), await png(icon, 512));

  await writeFile(pub('logo.svg'), logoSvg);
  await writeFile(pub('logo.png'), await sharp(Buffer.from(logoSvg)).png({ compressionLevel: 9 }).toBuffer());

  await writeFile(
    pub('og-image.jpg'),
    await sharp(Buffer.from(ogSvg)).flatten({ background: '#ffffff' }).jpeg({ quality: 88, mozjpeg: true }).toBuffer()
  );

  console.log('Brand assets written to public/.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
