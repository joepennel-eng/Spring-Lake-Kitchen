#!/usr/bin/env node
/**
 * Pulls the site's images off the old Airo preview into public/images/.
 *
 * This runs automatically as a `prebuild` step, so a Cloudflare Pages build
 * picks the images up with no local setup. It is a BOOTSTRAP, not a permanent
 * dependency: once you have the originals, commit public/images/ and delete
 * both this script and the "prebuild" line in package.json, so the site stops
 * depending on Airo staying online.
 *
 * A file that already exists locally is left alone, so committed images always
 * win over whatever Airo still serves. Missing images never fail the build.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = process.env.AIRO_ORIGIN ?? 'https://m3veo1xd7m.preview.c37.airoapp.ai';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images');

const assets = [
  ['/airo-assets/images/logo/horizontal/light', 'logo-horizontal.png'],
  ['/airo-assets/images/pages/home/hero-baked-goods', 'hero-baked-goods.webp'],
  ['/airo-assets/images/pages/home/kitchen-recipe-bread', 'kitchen-recipe-bread.jpg'],
  ['/airo-assets/images/pages/home/menu-cinnamon-rolls', 'menu-cinnamon-rolls.png'],
  ['/airo-assets/images/products/crusty-bread', 'products/crusty-bread.jpg'],
  ['/airo-assets/images/products/rosemary-cheddar-bread', 'products/rosemary-cheddar-bread.png'],
  ['/airo-assets/images/products/cinnamon-rolls-4-count', 'products/cinnamon-rolls-4-count.jpg'],
  ['/airo-assets/images/products/cinnamon-rolls-6-count', 'products/cinnamon-rolls-6-count.jpg'],
  ['/airo-assets/images/products/cinnamon-rolls-10-count', 'products/cinnamon-rolls-10-count.jpg'],
  ['/airo-assets/images/products/savory-rolls-4-count', 'products/savory-rolls-4-count.jpg'],
  ['/airo-assets/images/products/savory-rolls-6-count', 'products/savory-rolls-6-count.jpg'],
  ['/airo-assets/images/products/savory-rolls-10-count', 'products/savory-rolls-10-count.jpg'],
  ['/favicon.ico', '../favicon.png'],
];

let ok = 0;
let failed = 0;

for (const [remote, local] of assets) {
  const target = join(outDir, local);
  await mkdir(dirname(target), { recursive: true });
  // A committed image always wins over the Airo copy.
  if (await access(target).then(() => true, () => false)) {
    console.log(`  keep ${local}  (already in repo)`);
    ok += 1;
    continue;
  }
  try {
    const response = await fetch(SOURCE + remote);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(target, buffer);
    console.log(`  ok   ${local}  (${Math.round(buffer.length / 1024)} KB)`);
    ok += 1;
  } catch (error) {
    console.warn(`  MISS ${local}  — ${error.message}`);
    failed += 1;
  }
}

console.log(`\n${ok} downloaded, ${failed} missing.`);
if (failed) {
  console.log('Add any missing files to public/images/ manually under the names above.');
}

// Products with no image on the old site — the menu falls back to a leaf icon.
console.log('\nStill needs a photo: cinnamon-brown-sugar-bread, cinnamon-raisin-bread, jalapeno-cheddar-bread');
// Never fail the build over images.
process.exit(0);
