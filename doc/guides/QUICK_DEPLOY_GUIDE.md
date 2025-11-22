# Quick Deploy Guide - BabHijra to Cloudflare Pages

This is a streamlined guide to get your site deployed quickly.

## 🎯 Prerequisites Checklist

- [ ] Firebase project created and configured
- [ ] Git repository pushed to GitHub/GitLab
- [ ] Cloudflare account created
- [ ] All environment variables ready (from `.env.example`)

## 🚀 5-Minute Deployment

### Step 1: Connect Repository (2 min)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages** → **Create application** → **Pages**
3. Connect your Git provider and select your repository
4. Click **Begin setup**

### Step 2: Configure Build (1 min)

Set these values:

| Setting | Value |
|---------|-------|
| **Framework preset** | Astro |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Deploy command** | **LEAVE EMPTY** ⚠️ |
| **Node version** | 18 |

⚠️ **Critical**: The deploy command MUST be empty!

### Step 3: Add Environment Variables (2 min)

Click **Environment variables** and add these for **Production**:

```env
PUBLIC_FIREBASE_API_KEY=your_api_key_here
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_key
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
```

💡 **Tip**: Copy values from your local `.env` file

### Step 4: Deploy

1. Click **Save and Deploy**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at `https://your-project.pages.dev`

## ✅ Verify Deployment

Test these features:

- [ ] Site loads correctly
- [ ] Login/Signup works
- [ ] Profile creation works
- [ ] Images upload successfully
- [ ] Admin panel accessible (if you're admin)

## 🐛 Common Issues & Quick Fixes

### Issue 1: "Missing entry-point to Worker script"

**Symptom**: Build succeeds but deploy fails with wrangler error

**Fix**:
1. Go to **Settings** → **Builds & deployments**
2. Clear the "Deploy command" field
3. Save and retry deployment

**Details**: See `doc/guides/FIX_DEPLOY_COMMAND.md`

### Issue 2: "Firebase: Error (auth/invalid-api-key)"

**Symptom**: Build fails during prerendering

**Fix**: This should already be fixed in the codebase. If you still see it:
1. Verify you're using the latest `src/lib/firebase.ts`
2. Check that environment variables are set in Cloudflare
3. Ensure variables start with `PUBLIC_`

**Details**: See `doc/guides/FIREBASE_SSR_FIX.md`

### Issue 3: Site loads but features don't work

**Symptom**: Site is live but login/signup fails

**Fix**:
1. Open browser console (F12)
2. Check for Firebase errors
3. Verify environment variables are set correctly
4. Ensure Firebase project allows your domain

**Add your domain to Firebase**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Authentication → Settings → Authorized domains
3. Add your `*.pages.dev` domain

### Issue 4: Images won't upload

**Symptom**: Image upload fails or shows errors

**Fix**:
1. Check Firebase Storage is enabled
2. Verify Storage security rules allow uploads
3. Check browser console for specific errors
4. Ensure file size is under limits

## 🔄 Continuous Deployment

Once set up, deployments are automatic:

- **Push to main branch** → Deploys to production
- **Push to other branches** → Creates preview deployment
- **Pull requests** → Automatic preview deployments

## 📊 Monitoring

After deployment, monitor:

1. **Build logs**: Check for warnings or errors
2. **Analytics**: Enable Cloudflare Web Analytics
3. **Functions logs**: Monitor for runtime errors
4. **Firebase Console**: Check for auth/database errors

## 🎨 Custom Domain (Optional)

To use your own domain:

1. Go to **Custom domains** in your Pages project
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `babhijra.com`)
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

## 🔐 Security Checklist

Before going live:

- [ ] Firebase security rules are configured
- [ ] Admin role is properly protected
- [ ] File upload limits are set
- [ ] CORS is configured correctly
- [ ] No sensitive data in client code
- [ ] Environment variables are secure

## 📚 Additional Resources

- **Full Deployment Guide**: `doc/guides/CLOUDFLARE_DEPLOYMENT.md`
- **Deployment Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Firebase SSR Fix**: `doc/guides/FIREBASE_SSR_FIX.md`
- **Deploy Command Fix**: `doc/guides/FIX_DEPLOY_COMMAND.md`

## 🆘 Need Help?

1. Check the detailed guides in `doc/guides/`
2. Review Cloudflare build logs for specific errors
3. Check Firebase Console for backend issues
4. Review browser console for client-side errors

## 🎉 Success!

Once deployed, your site is:
- ✅ Live on Cloudflare's global CDN
- ✅ Automatically SSL secured
- ✅ Auto-deploying on every push
- ✅ Backed by Firebase for auth/database
- ✅ Optimized for performance

**Your site**: `https://your-project.pages.dev`

---

**Deployment Time**: ~5 minutes  
**Build Time**: ~2-3 minutes  
**First Deploy**: ~10 minutes total  

**Last Updated**: 2025-11-22
