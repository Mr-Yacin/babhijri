# Cloudflare Pages Deployment Checklist

Use this checklist to ensure successful deployment of BabHijra to Cloudflare Pages.

## Pre-Deployment

- [ ] Firebase project is set up and configured
- [ ] All Firebase services are enabled (Auth, Firestore, Storage)
- [ ] Firebase security rules are configured
- [ ] Local build works: `npm run build`
- [ ] Local preview works: `npm run preview`
- [ ] `.env` file is NOT committed to repository
- [ ] `.env.example` is up to date

## Cloudflare Pages Setup

- [ ] Cloudflare account created
- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured:
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Node version: 18+

## Environment Variables

Add these in Cloudflare Pages → Settings → Environment variables:

### Production Environment
- [ ] `PUBLIC_FIREBASE_API_KEY`
- [ ] `PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `PUBLIC_FIREBASE_APP_ID`
- [ ] `PUBLIC_EMAILJS_PUBLIC_KEY`
- [ ] `PUBLIC_EMAILJS_SERVICE_ID`
- [ ] `PUBLIC_EMAILJS_TEMPLATE_ID`

### Preview Environment
- [ ] Same variables as Production (or use test credentials)

## First Deployment

- [ ] Push code to main branch
- [ ] Monitor build logs in Cloudflare dashboard
- [ ] Build completes successfully
- [ ] Site is accessible at `*.pages.dev` URL
- [ ] Test authentication (login/signup)
- [ ] Test profile creation
- [ ] Test image uploads
- [ ] Check browser console for errors

## Post-Deployment

- [ ] Custom domain configured (optional)
- [ ] DNS records updated (if using custom domain)
- [ ] SSL certificate is active
- [ ] Test all major features:
  - [ ] User registration
  - [ ] User login
  - [ ] Profile creation
  - [ ] Profile editing
  - [ ] Image upload
  - [ ] Admin panel access
  - [ ] Contact form
- [ ] Set up monitoring/analytics
- [ ] Configure Cloudflare caching rules (optional)
- [ ] Enable Cloudflare WAF (optional)

## Troubleshooting

If build fails:
- [ ] Check build logs for specific error
- [ ] Verify all environment variables are set
- [ ] Clear Cloudflare build cache
- [ ] Check `doc/guides/CLOUDFLARE_DEPLOYMENT.md` for solutions

If site loads but features don't work:
- [ ] Check browser console for errors
- [ ] Verify Firebase credentials are correct
- [ ] Check Firebase security rules
- [ ] Verify environment variables are set for correct environment

## Security Checklist

- [ ] Firebase security rules are restrictive
- [ ] Admin role is properly protected
- [ ] File upload size limits are configured
- [ ] Rate limiting is considered
- [ ] CORS is properly configured
- [ ] No sensitive data in client-side code

## Documentation

- [ ] README.md is up to date
- [ ] Deployment guide is reviewed
- [ ] Team members know how to deploy
- [ ] Environment variables are documented securely

## Continuous Deployment

- [ ] Automatic deployments are working
- [ ] Preview deployments work for PRs
- [ ] Production deploys on main branch push
- [ ] Rollback procedure is understood

---

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run astro check
```

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Firebase Console](https://console.firebase.google.com)
- Project Documentation: `doc/guides/`

---

**Last Updated**: 2025-11-22
