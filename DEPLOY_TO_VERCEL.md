# Deploy to Vercel (RECOMMENDED)

## Why Vercel Instead of Cloudflare?

**Your app uses Firebase + SSR = Vercel is the right choice**

| Feature | Cloudflare Pages | Vercel |
|---------|-----------------|--------|
| Runtime | Edge (V8 isolates) | Node.js |
| Firebase Client SDK | ❌ Breaks SSR | ✅ Works perfectly |
| Firebase in Services | ❌ Not supported | ✅ Full support |
| Deployment | Complex setup | One command |
| **Verdict** | ❌ Not compatible | ✅ **RECOMMENDED** |

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

## Why This Fixes Your 500 Error

The 500 error happens because:
1. Your services import Firebase at the top level
2. Cloudflare's edge runtime can't handle Firebase initialization during SSR
3. Vercel uses Node.js which fully supports Firebase

## After Deployment

Your app will work perfectly on Vercel because:
- ✅ Firebase works in both SSR and client-side
- ✅ All your services work without modification
- ✅ No more 500 errors
- ✅ Better performance for your use case

## Cost Comparison

- **Vercel Free Tier:** 100GB bandwidth, unlimited sites
- **Cloudflare Pages Free:** Unlimited bandwidth, but doesn't work with your stack

**Verdict: Use Vercel** 🚀
