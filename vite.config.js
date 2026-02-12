import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages/custom domains:
// - With a custom domain (CNAME present), base should be '/'
// - If you deploy under a subpath, change base accordingly.
export default defineConfig({
  base: '/',
  plugins: [react()],
  publicDir: 'static',
});
