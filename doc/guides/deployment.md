# Deployment Guide

## Recommended Platform: Vercel

Vercel is the recommended deployment platform for this application due to:
- Full Node.js runtime support for Firebase
- Seamless SSR (Server-Side Rendering) support
- Automatic SSL certificates
- Global CDN for optimal performance
- Simple deployment process

## Deployment Methods

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Install Vercel adapter:
```bash
npm install @astrojs/vercel
```

3. Update `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://yourdomain.com',
  output: 'server',
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel()
});
```

4. Deploy:
```bash
vercel
```

### Option 2: Deploy via GitHub (Recommended)

1. Push your code to GitHub repository
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Astro configuration
6. Click "Deploy"

## Environment Variables

Configure the following environment variables in Vercel dashboard:

### Firebase Configuration
- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`

## Post-Deployment

After deployment:
1. Verify all environment variables are set correctly
2. Test authentication flow
3. Check that protected routes are properly secured
4. Verify Firebase services are working
5. Test on multiple devices and browsers

## Vercel Free Tier Benefits

- 100GB bandwidth per month
- Unlimited sites and deployments
- Automatic SSL certificates
- Global CDN
- Preview deployments for every branch
- Automatic HTTPS

## Troubleshooting

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Ensure Firebase configuration is correct
4. Check that adapter is properly configured in `astro.config.mjs`
