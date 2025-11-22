# Quick Fix Guide - Admin Access & Permissions

## Two Issues Fixed

### 1. ✅ Import Error in AdminCheck
**Error:** `Cannot use import statement outside a module`
**Fixed:** Changed script to use regular import instead of define:vars

### 2. ✅ Firestore Permission Denied
**Error:** `Missing or insufficient permissions`
**Fixed:** Updated Firestore rules to allow email-based admin access

## What You Need to Do NOW

### Step 1: Deploy Firestore Rules (CRITICAL)
```bash
firebase deploy --only firestore:rules
```

If you don't have Firebase CLI:
```bash
npm install -g firebase-cli
firebase login
firebase deploy --only firestore:rules
```

### Step 2: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 3: Clear Browser & Test
1. Clear browser cache (Ctrl+Shift+Delete)
2. Logout from your app
3. Login with: `admin@babhijra.com`
4. Go to: `/app/admin`
5. Should work without errors!

## What Was Changed

### Files Modified:
1. **src/components/admin/AdminCheck.astro** - Fixed import error
2. **firestore.rules** - Added email-based admin check
3. **src/middleware.ts** - Already had email-based check

### How Admin Access Works Now:

**Two-Layer Protection:**

1. **Middleware (Server-Side)**
   - Checks if user email is in `ADMIN_EMAILS` from `.env`
   - Redirects non-admins to dashboard
   - Logs in terminal

2. **Firestore Rules (Database-Side)**
   - Checks if user email is `admin@babhijra.com`
   - Allows reading all users for stats
   - Blocks unauthorized database access

3. **AdminCheck Component (Client-Side)**
   - Double-checks admin status
   - Shows alert if not admin
   - Redirects to dashboard

## Expected Result

### ✅ As Admin (admin@babhijra.com):
- Can access `/app/admin`
- Can see dashboard stats
- Can manage users and profiles
- No permission errors

### ❌ As Regular User:
- Redirected to `/app/dashboard` when trying `/app/admin`
- Alert: "Access Denied: You do not have admin privileges"
- Cannot query users collection

## Still Not Working?

### Check Terminal Logs (not browser console):
```
[Auth Middleware] Checking admin access...
[Auth Middleware] Admin emails configured: ['admin@babhijra.com']
[Auth Middleware] ✓ Admin access granted...
```

### Check Firestore Rules Deployed:
1. Go to Firebase Console
2. Firestore Database → Rules
3. Look for `isAdminEmail()` function
4. Check timestamp is recent

### Common Issues:
- ❌ Forgot to deploy rules → Run `firebase deploy --only firestore:rules`
- ❌ Forgot to restart server → Stop and restart dev server
- ❌ Old browser cache → Clear cache and logout/login
- ❌ Wrong email → Must use `admin@babhijra.com`

## Files to Check

See detailed guides:
- `DEPLOY_FIRESTORE_RULES.md` - How to deploy rules
- `ADMIN_ACCESS_FIX_SUMMARY.md` - Complete admin access guide
- `TEST_ADMIN_ACCESS.md` - Testing instructions
