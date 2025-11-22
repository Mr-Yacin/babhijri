# Cloudflare Pages Deployment Guide

This guide walks you through deploying BabHijra to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Your Firebase project credentials
- Git repository connected to Cloudflare Pages

## Step 1: Connect Your Repository

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create application** → **Pages**
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)
4. Select your BabHijra repository

## Step 2: Configure Build Settings

Set the following build configuration:

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty)
- **Deploy command**: Leave empty (Pages handles deployment automatically)
- **Node version**: 18 or higher

⚠️ **Important**: Do NOT set a deploy command. Cloudflare Pages automatically deploys after the build completes.

## Step 3: Add Environment Variables

⚠️ **Critical**: Environment variables must be added before the first build.

Navigate to **Settings** → **Environment variables** and add:

### Production Environment

```
PUBLIC_FIREBASE_API_KEY=your_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

### Preview Environment

Add the same variables for the **Preview** environment (or use test Firebase project credentials).

## Step 4: Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your site
3. Your site will be available at `https://your-project.pages.dev`

## Step 5: Custom Domain (Optional)

1. Go to **Custom domains** in your Pages project
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `babhijra.com`)
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Error: "Firebase: Error (auth/invalid-api-key)"

This error occurs when Firebase tries to initialize during the build process without environment variables.

**Solution**: The codebase has been updated to defer Firebase initialization to runtime (browser only). Make sure you're using the latest version of `src/lib/firebase.ts`.

### Environment Variables Not Working

- Ensure variables are added to **both** Production and Preview environments
- Variable names must start with `PUBLIC_` to be accessible in the browser
- Redeploy after adding/changing environment variables

### Deploy Error: "Missing entry-point to Worker script"

This error occurs when Cloudflare tries to run `wrangler versions upload` as a deploy command.

**Solution**: 
1. Go to **Settings** → **Builds & deployments** in Cloudflare Pages
2. Clear/remove the **Deploy command** field (leave it empty)
3. Cloudflare Pages will automatically deploy after the build completes
4. Redeploy your project

### Build Fails with "Module not found"

- Clear the build cache in Cloudflare Pages settings
- Ensure `package-lock.json` is committed to your repository
- Check that all dependencies are in `package.json`

## KV Namespace for Sessions (Optional)

If you see warnings about KV bindings:

1. Create a KV namespace in Cloudflare dashboard
2. Add binding in `wrangler.json`:

```json
{
  "name": "babhijri",
  "compatibility_date": "2024-11-21",
  "pages_build_output_dir": "./dist",
  "kv_namespaces": [
    {
      "binding": "SESSION",
      "id": "your_kv_namespace_id"
    }
  ]
}
```

## Performance Optimization

### Image Optimization

The project is configured to use `imageService: "compile"` which optimizes images during build time using Sharp.

### Chunk Size Warning

If you see warnings about large chunks (>500kB), consider:

1. Using dynamic imports for Firebase:
   ```typescript
   const { getFirebaseAuth } = await import('../lib/firebase');
   ```

2. Code splitting large components

3. Lazy loading non-critical features

## Monitoring

- **Analytics**: Enable Cloudflare Web Analytics in your Pages project
- **Logs**: View build and function logs in the Cloudflare dashboard
- **Errors**: Check the Functions tab for runtime errors

## Continuous Deployment

Cloudflare Pages automatically deploys:
- **Production**: When you push to your main/master branch
- **Preview**: For every pull request or branch push

## Security Considerations

1. **Never commit** `.env` file to your repository
2. Use **different Firebase projects** for production and preview
3. Configure **Firebase Security Rules** properly
4. Enable **Cloudflare WAF** for additional protection
5. Set up **rate limiting** in Cloudflare

## Next Steps

- Set up custom domain
- Configure Cloudflare Analytics
- Enable Cloudflare CDN caching
- Set up email forwarding for your domain
- Configure Firebase security rules

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Firebase Documentation](https://firebase.google.com/docs)
