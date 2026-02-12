import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages:
// - Custom domain (CNAME): base should be '/'
// - Default Pages URL: https://<user>.github.io/<repo>/ => base should be '/<repo>/'
//
// This derives base automatically for CI builds if GITHUB_PAGES_REPO is provided.
const repo = process.env.GITHUB_PAGES_REPO;
const base = repo ? `/${repo.replace(/^\//, '').replace(/\/$/, '')}/` : '/';

export default defineConfig({
  base,
  plugins: [react()],
  publicDir: 'static',
});
