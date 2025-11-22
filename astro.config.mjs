// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://babhijri.com',
  output: 'server',
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
    }
  },
  adapter: cloudflare({
    imageService: 'compile'
  })
});