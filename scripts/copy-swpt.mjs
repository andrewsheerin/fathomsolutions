import { cpSync, existsSync, mkdirSync } from 'node:fs';

const srcDir = new URL('../SWPT/', import.meta.url);
const distDir = new URL('../dist/', import.meta.url);
const dstDir = new URL('../dist/SWPT/', import.meta.url);

mkdirSync(distDir, { recursive: true });

if (!existsSync(srcDir)) {
  console.log('No SWPT directory found; skipping');
  process.exit(0);
}

cpSync(srcDir, dstDir, { recursive: true });
console.log('Copied SWPT -> dist/SWPT');

