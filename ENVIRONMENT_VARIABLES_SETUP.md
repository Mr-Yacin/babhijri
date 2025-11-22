# Environment Variables Setup via wrangler.toml

Since your project uses `wrangler.toml` for configuration, environment variables must be added there instead of the Cloudflare dashboard.

## 🔧 Quick Setup

### Step 1: Edit wrangler.toml

Open `wrangler.toml` and replace the placeholder values with your actual credentials:

```toml
[vars]
PUBLIC_FIREBASE_API_KEY = "AIzaSyC..."  # Your actual API key
PUBLIC_FIREBASE_AUTH_DOMAIN = "your-project.firebaseapp.com"
PUBLIC_FIREBASE_PROJECT_ID = "your-project-id"
PUBLIC_FIREBASE_STORAGE_BUCKET = "your-project.appspot.com"
PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456789"
PUBLIC_FIREBASE_APP_ID = "1:123456789:web:abc123"
PUBLIC_EMAILJS_PUBLIC_KEY = "your_emailjs_key"
PUBLIC_EMAILJS_SERVICE_ID = "service_xyz"
PUBLIC_EMAILJS_TEMPLATE_ID = "template_abc"
```

### Step 2: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon → Project settings
4. Scroll down to "Your apps" section
5. Copy the config values

### Step 3: Get Your EmailJS Credentials (Optional)

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com)
2. Copy your Public Key, Service ID, and Template ID

### Step 4: Commit and Push

```bash
git add wrangler.toml
git commit -m "Add environment variables"
git push
```

Cloudflare will automatically redeploy with the new environment variables!

## ⚠️ Important Security Notes

### DO NOT commit sensitive credentials to public repositories!

If your repository is public, use one of these approaches:

### Option 1: Use Cloudflare Secrets (Recommended for sensitive data)

For truly sensitive values, use Cloudflare secrets via the dashboard or CLI:

```bash
# Using wrangler CLI
wrangler pages secret put PUBLIC_FIREBASE_API_KEY
# Enter your value when prompted
```

### Option 2: Use .env file locally + Dashboard for production

1. Keep `wrangler.toml` with placeholder values
2. Use `.env` file for local development (already in `.gitignore`)
3. Add real values via Cloudflare dashboard for production

### Option 3: Use wrangler.toml for non-sensitive values only

Since Firebase config values are public (they're sent to the browser anyway), it's generally safe to include them in `wrangler.toml`. However, for extra security:

- Keep API keys as secrets
- Use Firebase security rules to protect your data
- Enable App Check for additional security

## 🔒 Firebase Security

Remember: Firebase credentials are public by design (they're in your client-side code). Security comes from:

1. **Firebase Security Rules** - Control who can read/write data
2. **Firebase App Check** - Verify requests come from your app
3. **Authentication** - Verify user identity

Your Firebase security rules should already be configured to protect your data.

## 📝 Current wrangler.toml Structure

```toml
name = "babhijri"
compatibility_date = "2024-11-21"
pages_build_output_dir = "./dist"

[vars]
PUBLIC_FIREBASE_API_KEY = "your_value"
PUBLIC_FIREBASE_AUTH_DOMAIN = "your_value"
# ... etc
```

## 🚀 After Adding Variables

1. Commit and push changes
2. Cloudflare automatically redeploys
3. Your site will have working Firebase authentication
4. All features will be functional

## 🧪 Testing

After deployment with environment variables:

1. Visit your site
2. Try to sign up for an account
3. Try to log in
4. Create a profile
5. Upload an image

Everything should work!

## 📚 Alternative: Environment-Specific Variables

For different environments (preview vs production):

```toml
# Production variables
[env.production.vars]
PUBLIC_FIREBASE_PROJECT_ID = "prod-project"

# Preview variables
[env.preview.vars]
PUBLIC_FIREBASE_PROJECT_ID = "dev-project"
```

## 🆘 Troubleshooting

### Variables not working after push?

1. Check Cloudflare Pages deployment logs
2. Verify the build succeeded
3. Check browser console for Firebase errors
4. Ensure variable names start with `PUBLIC_`

### Still seeing placeholder values?

1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the deployed site (not localhost)

## ✅ Verification

To verify variables are loaded:

1. Open browser console on your deployed site
2. Type: `import.meta.env.PUBLIC_FIREBASE_PROJECT_ID`
3. Should show your actual project ID (not placeholder)

---

**Next Step**: Edit `wrangler.toml` with your actual credentials and push to deploy! 🚀
