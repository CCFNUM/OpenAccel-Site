/**
 * generate-og.mjs
 * Converts the SVG OG image template to PNG using sharp.
 * Run: node scripts/generate-og.mjs
 *
 * sharp uses libvips + librsvg for accurate SVG rasterization.
 * Requires: pnpm add -D sharp
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const svgPath = join(root, 'public', 'og-image.svg');
const pngPath = join(root, 'public', 'og-image.png');

const svgBuffer = readFileSync(svgPath);

await sharp(svgBuffer, { density: 150 })
  .resize(1200, 630)
  .png({ compressionLevel: 8 })
  .toFile(pngPath);

console.log(`✓ OG image generated: ${pngPath}`);
