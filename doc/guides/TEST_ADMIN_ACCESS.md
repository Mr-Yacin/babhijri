# Test Admin Access

## Current Setup
- Admin emails configured in `.env`: `admin@babhijra.com`
- Middleware checks if logged-in user's email matches admin list

## Testing Steps

### 1. Restart Dev Server
The `.env` file changes require a server restart:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Check Your Login Email
1. Open browser console (F12)
2. Go to `/app/dashboard`
3. Run this in console:
```javascript
// Get current user email
const auth = await import('./src/lib/firebase.js');
const firebaseAuth = auth.getFirebaseAuth();
console.log('Current user email:', firebaseAuth.currentUser?.email);
```

### 3. Try Accessing Admin Page
1. Go to `/app/admin`
2. Check browser console for middleware logs:
   - Should see: `[Auth Middleware] Checking admin access...`
   - Should see: `[Auth Middleware] Admin emails configured: ['admin@babhijra.com']`
   - Should see: `[Auth Middleware] Decoded payload: { email: '...', uid: '...', hasEmail: true }`

### 4. Expected Behavior

#### If you're logged in as `admin@babhijra.com`:
- ✅ You should see admin pages
- Console: `[Auth Middleware] ✓ Admin access granted...`

#### If you're logged in as any other email:
- ❌ You should be redirected to `/app/dashboard`
- Console: `[Auth Middleware] Blocking admin access - User [email] is not in admin list`

## Quick Fix Options

### Option 1: Add Your Current Email to Admin List
Edit `.env` and add your email:
```
ADMIN_EMAILS=admin@babhijra.com,youremail@example.com
```

### Option 2: Create Admin Account
1. Sign up with email: `admin@babhijra.com`
2. Use that account to access admin pages

### Option 3: Temporarily Disable Admin Check (NOT RECOMMENDED)
Only for testing - comment out the admin check in `src/middleware.ts`:
```typescript
// if (isAdminRoute) {
//     // ... admin check code
// }
```

## Troubleshooting

### Issue: Still can access admin pages as regular user
**Possible causes:**
1. Dev server not restarted after `.env` change
2. Browser cache - try hard refresh (Ctrl+Shift+R)
3. Old session cookie - logout and login again

**Solution:**
```bash
# 1. Stop dev server
# 2. Clear browser cookies for localhost
# 3. Restart dev server
npm run dev
# 4. Login again
```

### Issue: Can't access admin pages even as admin
**Check:**
1. Email in `.env` matches exactly (case-insensitive)
2. No extra spaces in `ADMIN_EMAILS`
3. Server restarted after `.env` change
4. Check console logs for actual email vs admin list

### Issue: No console logs appearing
**Cause:** Middleware runs server-side, not in browser
**Solution:** Check terminal/server logs, not browser console
