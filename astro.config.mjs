import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Static-first output: the whole app prerenders to plain HTML/CSS/JS.
  output: 'static',
  site: 'https://cloudleapasxm.github.io/password-generator/',
  integrations: [
    react(),
    tailwind({
      // Disable Tailwind's base styles reset here; we import our own
      // global.css (which includes @tailwind directives) instead.
      applyBaseStyles: false,
    }),
  ],
  vite: {
    build: {
      // Keep the client bundle lean; the word list is the only large asset.
      chunkSizeWarningLimit: 600,
    },
  },
});
