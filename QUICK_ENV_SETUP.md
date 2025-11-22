# ⚡ Quick Environment Variables Setup

Your site is **LIVE** but needs environment variables to work fully!

## 🎯 3-Step Setup

### 1. Copy Your Firebase Config

From your `.env` file or Firebase Console, copy these values:

```
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=
PUBLIC_EMAILJS_PUBLIC_KEY=
PUBLIC_EMAILJS_SERVICE_ID=
PUBLIC_EMAILJS_TEMPLATE_ID=
```

### 2. Edit wrangler.toml

Open `wrangler.toml` and replace the placeholder values in the `[vars]` section with your actual values.

### 3. Deploy

```bash
git add wrangler.toml
git commit -m "Add environment variables"
git push
```

Done! Cloudflare will automatically redeploy with your variables. ✅

## 📍 Where to Find Your Values

### Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ → Project settings
4. Scroll to "Your apps" → Web app
5. Copy the config values

### EmailJS Config
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com)
2. Find your Public Key, Service ID, Template ID

## ⚠️ Security Note

Firebase config values are safe to commit (they're public in your client code anyway). Security comes from Firebase Security Rules, not hiding these values.

## ✅ After Deployment

Test these features:
- Sign up / Login
- Create profile
- Upload images
- Admin panel

Everything should work! 🎉

---

**See `ENVIRONMENT_VARIABLES_SETUP.md` for detailed instructions**
