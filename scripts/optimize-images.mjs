#!/usr/bin/env node
/**
 * optimize-images.mjs
 * Compresses all JPG/PNG images in assets/ and uploads/ for Vercel deployment.
 * 
 * - Resizes to max 1920px width (preserving aspect ratio)
 * - JPEG quality: 75 (great quality, ~80% size reduction on large photos)
 * - PNG: compressed with effort 4
 * - Skips files already under 500KB
 * - Reports before/after sizes
 * 
 * Usage: node scripts/optimize-images.mjs
 */

import { readdir, stat, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const DIRS = ['assets', 'uploads'];
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 75;
const SKIP_UNDER_KB = 500; // skip files already under this size
const ROOT = new URL('..', import.meta.url).pathname;

let totalBefore = 0;
let totalAfter = 0;
let processed = 0;
let skipped = 0;

async function getImages(dir) {
  const fullDir = join(ROOT, dir);
  try {
    const entries = await readdir(fullDir);
    return entries
      .filter(f => /\.(jpe?g|png)$/i.test(f))
      .map(f => ({ dir, file: f, path: join(fullDir, f) }));
  } catch {
    return [];
  }
}

async function optimizeImage({ dir, file, path: filePath }) {
  const info = await stat(filePath);
  const sizeKB = info.size / 1024;

  if (sizeKB < SKIP_UNDER_KB) {
    skipped++;
    console.log(`  ⏭  ${dir}/${file} — ${sizeKB.toFixed(0)}KB (already small, skipping)`);
    totalBefore += info.size;
    totalAfter += info.size;
    return;
  }

  const ext = extname(file).toLowerCase();
  const isJpeg = ext === '.jpg' || ext === '.jpeg';

  try {
    let pipeline = sharp(filePath).resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });

    if (isJpeg) {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else {
      pipeline = pipeline.png({ effort: 4, compressionLevel: 9 });
    }

    const buffer = await pipeline.toBuffer();
    const newSizeKB = buffer.length / 1024;

    // Only overwrite if we actually saved space
    if (buffer.length < info.size) {
      const { default: fs } = await import('node:fs/promises');
      await fs.writeFile(filePath, buffer);
      totalBefore += info.size;
      totalAfter += buffer.length;
      processed++;
      const pct = ((1 - buffer.length / info.size) * 100).toFixed(0);
      console.log(`  ✅ ${dir}/${file} — ${sizeKB.toFixed(0)}KB → ${newSizeKB.toFixed(0)}KB (−${pct}%)`);
    } else {
      skipped++;
      totalBefore += info.size;
      totalAfter += info.size;
      console.log(`  ⏭  ${dir}/${file} — already optimal`);
    }
  } catch (err) {
    console.error(`  ❌ ${dir}/${file} — ${err.message}`);
    totalBefore += info.size;
    totalAfter += info.size;
  }
}

async function main() {
  console.log('\n🖼  Hertz Image Optimizer');
  console.log('━'.repeat(50));

  const allImages = (await Promise.all(DIRS.map(getImages))).flat();
  console.log(`\nFound ${allImages.length} images in ${DIRS.join(', ')}\n`);

  for (const img of allImages) {
    await optimizeImage(img);
  }

  const beforeMB = (totalBefore / 1024 / 1024).toFixed(1);
  const afterMB = (totalAfter / 1024 / 1024).toFixed(1);
  const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
  const savedPct = totalBefore > 0 ? ((1 - totalAfter / totalBefore) * 100).toFixed(0) : 0;

  console.log('\n' + '━'.repeat(50));
  console.log(`📊 Results:`);
  console.log(`   Processed: ${processed} files`);
  console.log(`   Skipped:   ${skipped} files`);
  console.log(`   Before:    ${beforeMB} MB`);
  console.log(`   After:     ${afterMB} MB`);
  console.log(`   Saved:     ${savedMB} MB (−${savedPct}%)`);
  console.log('━'.repeat(50) + '\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
