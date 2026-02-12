import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';

// GitHub Pages:
// - Custom domain (CNAME in repo root): base should be '/'
// - Default Pages URL: https://<user>.github.io/<repo>/ => base should be '/<repo>/'
//
// We auto-detect:
// - If CNAME exists, assume custom domain -> '/'
// - Else if building in GitHub Actions, assume repo subpath -> '/<repo>/'
const hasCname = existsSync(new URL('./CNAME', import.meta.url));
const repo = process.env.GITHUB_PAGES_REPO || process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = !hasCname && process.env.GITHUB_ACTIONS && repo
  ? `/${repo.replace(/^\//, '').replace(/\/$/, '')}/`
  : '/';

export default defineConfig({
  base,
  plugins: [react()],
  publicDir: 'static',
});
