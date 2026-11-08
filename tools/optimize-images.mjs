// Generates optimized, metadata-free responsive images and icons for the site.
// Usage: npm run images
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'tools', 'source-images');
const out = path.join(root, 'site', 'assets', 'img');
const siteRoot = path.join(root, 'site');

const photos = [
  { name: 'operatory', widths: [640, 1024, 1600] },
  { name: 'operatory-view', widths: [640, 1024, 1600] },
  { name: 'treatment', widths: [640, 1024, 1600] },
  { name: 'dr-nikola', widths: [640, 1024, 1600] },
  { name: 'kids-corner', widths: [480, 800, 1200] },
];

async function photo({ name, widths }) {
  const input = path.join(src, `${name}.jpg`);
  for (const w of widths) {
    const base = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    const info = await base.clone().webp({ quality: 72 }).toFile(path.join(out, `${name}-${w}.webp`));
    await base.clone().jpeg({ quality: 74, mozjpeg: true, progressive: true }).toFile(path.join(out, `${name}-${w}.jpg`));
    console.log(`${name}-${w}: ${info.width}x${info.height}`);
  }
}

// Square head-and-shoulders crops for the team section (crop box in source pixels).
const portraits = [
  { src: 'dr-nikola', out: 'dr-nikola-portrait', crop: { left: 560, top: 240, width: 860, height: 860 } },
  { src: 'bateli', out: 'bateli-portrait', crop: { left: 50, top: 80, width: 600, height: 600 } },
  { src: 'karagkiolidou', out: 'karagkiolidou-portrait', crop: { left: 35, top: 100, width: 430, height: 430 } },
  { src: 'markou', out: 'markou-portrait', crop: { left: 0, top: 250, width: 1280, height: 1280 } },
];

async function portrait({ src: name, out: outName, crop }) {
  for (const w of [320, 640]) {
    const base = sharp(path.join(src, `${name}.jpg`))
      .rotate()
      .extract(crop)
      .resize(w, w);
    await base.clone().webp({ quality: 74 }).toFile(path.join(out, `${outName}-${w}.webp`));
    await base.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(out, `${outName}-${w}.jpg`));
  }
}

async function socialCard() {
  await sharp(path.join(src, 'operatory.jpg'))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(out, 'og-image.jpg'));
}

async function icons() {
  const svg = path.join(out, 'logo-mark.svg');
  await copyFile(svg, path.join(siteRoot, 'favicon.svg'));
  await sharp(svg, { density: 600 }).resize(180, 180).png().toFile(path.join(siteRoot, 'apple-touch-icon.png'));
  await sharp(svg, { density: 600 }).resize(32, 32).png().toFile(path.join(siteRoot, 'favicon-32.png'));
  for (const s of [192, 512]) {
    await sharp(svg, { density: 600 }).resize(s, s).png().toFile(path.join(siteRoot, `icon-${s}.png`));
  }
  // Maskable icon: logo inside the safe zone on a solid background.
  const inner = await sharp(svg, { density: 600 }).resize(360, 360).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: '#4a5bd4' } })
    .composite([{ input: inner, gravity: 'centre' }])
    .png()
    .toFile(path.join(siteRoot, 'icon-maskable-512.png'));
}

await mkdir(out, { recursive: true });
for (const p of photos) await photo(p);
for (const p of portraits) await portrait(p);
await socialCard();
await icons();
console.log('Done.');
