// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://babhijri.com',
  output: 'static', // Changed from 'server' to 'static' since we use client-side Firebase
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()]
  }
});