# Firebase SSR/Build Error Fix

## Problem

When deploying to Cloudflare Pages, the build fails with:

```
Firebase: Error (auth/invalid-api-key)
```

This occurs during the prerendering phase because:
1. Firebase is initialized at module load time (top-level)
2. Environment variables are not available during Cloudflare Pages build
3. Firebase tries to validate the API key during SSR/prerendering

## Solution

The fix involves deferring Firebase initialization until runtime (browser only).

### Changes Made

#### 1. Updated `src/lib/firebase.ts`

**Before:**
```typescript
// Firebase initialized immediately at module load
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
```

**After:**
```typescript
// Lazy initialization - only in browser
let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;

function initializeFirebase() {
    // Skip initialization during SSR/build
    if (typeof window === 'undefined') {
        return;
    }
    
    if (!_app) {
        _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        _auth = getAuth(_app);
        _db = getFirestore(_app);
        _storage = getStorage(_app);
    }
}

// Initialize on first import in browser
if (typeof window !== 'undefined') {
    initializeFirebase();
}

// Getter functions with error handling
export function getFirebaseAuth(): Auth {
    if (!_auth) initializeFirebase();
    if (!_auth) throw new Error('Firebase Auth not initialized - running in SSR context');
    return _auth;
}

// Legacy exports for backward compatibility
export const auth = _auth;
export const db = _db;
export const storage = _storage;
```

#### 2. Updated `astro.config.mjs`

Added Firebase to SSR externals and configured image service:

```javascript
export default defineConfig({
  // ...
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
    }
  },
  adapter: cloudflare({
    imageService: 'compile'
  })
});
```

## How It Works

1. **During Build/SSR**: 
   - `typeof window === 'undefined'` is true
   - Firebase initialization is skipped
   - No API key validation occurs
   - Build completes successfully

2. **In Browser**:
   - `typeof window !== 'undefined'` is true
   - Firebase initializes on first import
   - Environment variables are available
   - App works normally

## Backward Compatibility

The fix maintains backward compatibility:
- Existing code using `import { auth, db, storage }` continues to work
- New code can use getter functions: `getFirebaseAuth()`, `getFirebaseDb()`, etc.
- No changes needed in components or services

## Testing

To verify the fix works:

1. **Local Development**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Cloudflare Pages**:
   - Push to your repository
   - Cloudflare will build and deploy
   - Check build logs for success

## Important Notes

- Environment variables must be set in Cloudflare Pages dashboard
- Variables are only available at runtime, not during build
- All Firebase operations must run client-side (in browser)
- Server-side Firebase operations require Firebase Admin SDK

## Related Files

- `src/lib/firebase.ts` - Firebase initialization
- `astro.config.mjs` - Astro configuration
- `doc/guides/CLOUDFLARE_DEPLOYMENT.md` - Deployment guide
- `README.md` - Updated with deployment instructions

## References

- [Astro SSR Guide](https://docs.astro.build/en/guides/server-side-rendering/)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
