# Deploy to Vercel

## Why Vercel?

**Your app uses Firebase + SSR = Vercel is the perfect choice**

- ✅ Node.js runtime with full Firebase support
- ✅ Works perfectly with Firebase Client SDK
- ✅ Full support for Firebase in services
- ✅ Simple one-command deployment
- ✅ Automatic SSL and custom domains

## Quick Deploy to Vercel

### Option 1: Deploy via CLI (Fastest)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Change adapter in astro.config.mjs:**
   ```bash
   npm install @astrojs/vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

### Option 2: Deploy via GitHub (Recommended for production)

1. **Push your code to GitHub**

2. **Go to [vercel.com](https://vercel.com)**

3. **Click "Import Project"**

4. **Select your GitHub repo**

5. **Vercel auto-detects Astro - just click Deploy!**

6. **Add environment variables in Vercel dashboard:**
   - `PUBLIC_FIREBASE_API_KEY`
   - `PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `PUBLIC_FIREBASE_PROJECT_ID`
   - `PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `PUBLIC_FIREBASE_APP_ID`

## What Needs to Change

**Update astro.config.mjs:**

```javascript
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://babhijri.com',
  output: 'server',
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel()
});
```

## After Deployment

Your app will work perfectly on Vercel because:
- ✅ Firebase works in both SSR and client-side
- ✅ All your services work without modification
- ✅ Excellent performance with global edge network
- ✅ Automatic preview deployments for branches

## Vercel Free Tier

- 100GB bandwidth per month
- Unlimited sites and deployments
- Automatic SSL certificates
- Global CDN
- Preview deployments for every branch

**Perfect for your Firebase + SSR app** 🚀
