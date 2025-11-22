# Firestore Setup Checklist

## Issue
Users are created in Firebase Authentication but NOT in Firestore `users` collection.

## Quick Fix Steps

### Step 1: Deploy Firestore Rules
The Firestore rules might not be deployed to your Firebase project.

```bash
# Install Firebase CLI if not installed
npm install -g firebase-cli

# Login to Firebase
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### Step 2: Verify Firestore is Enabled
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **babhijra-36e2b**
3. Click "Firestore Database" in left menu
4. If you see "Create database", click it and:
   - Choose "Start in production mode"
   - Select location: **europe-west3 (Frankfurt)** (matches your firebase.json)
   - Click "Enable"

### Step 3: Test Signup with Console Open
1. Open your app in browser
2. Open DevTools (F12) → Console tab
3. Go to `/app/signup`
4. Create a test account
5. Watch console for messages:
   - "Initializing Firebase..."
   - "User created in Firebase Auth: [uid]"
   - "Creating user profile in Firestore..."
   - "User profile created successfully in Firestore: [uid]"

### Step 4: Verify in Firebase Console
1. Go to Firebase Console → Firestore Database
2. Look for `users` collection
3. Find document with your user's UID
4. Should contain:
   ```
   {
     uid: "...",
     email: "...",
     displayName: "...",
     role: "user",
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

## Common Errors and Solutions

### Error: "Missing or insufficient permissions"
**Cause:** Firestore rules not deployed or incorrect
**Solution:** 
```bash
firebase deploy --only firestore:rules
```

### Error: "Firestore not initialized"
**Cause:** Firebase config missing in .env
**Solution:** Check `.env` file has all these values:
```
PUBLIC_FIREBASE_API_KEY=...
PUBLIC_FIREBASE_AUTH_DOMAIN=...
PUBLIC_FIREBASE_PROJECT_ID=...
PUBLIC_FIREBASE_STORAGE_BUCKET=...
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
PUBLIC_FIREBASE_APP_ID=...
```

### Error: No error but user not created
**Cause:** Firestore database not created in Firebase Console
**Solution:** Follow Step 2 above to create the database

## Code Changes Made

### 1. src/lib/firebase.ts
- Added detailed logging to track initialization
- Added error handling for Firestore initialization
- Ensured `getFirebaseDb()` properly initializes Firestore

### 2. src/lib/services/user.ts
- Changed from importing `db` directly to using `getFirebaseDb()`
- Added null checks for Firestore instance
- Added success/error logging

### 3. src/components/auth/SignupForm.svelte
- Added console logging at each step of signup process
- Helps identify exactly where the process fails

## Next Steps

1. **Deploy Firestore rules** (most likely issue)
2. **Enable Firestore database** in Firebase Console if not already done
3. **Test signup** with browser console open
4. **Check Firebase Console** to verify user document created

If still not working, share the console logs from the browser DevTools.
