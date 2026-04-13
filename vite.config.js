import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` is set to match the GitHub Pages URL. For project pages
// (user.github.io/<repo>/) the CI workflow passes VITE_BASE=/<repo>/.
// Locally it defaults to '/'.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
});
