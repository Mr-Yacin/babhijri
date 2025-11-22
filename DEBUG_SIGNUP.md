# Debug Signup Issue

## Steps to Debug

### 1. Check Browser Console
Open browser DevTools (F12) and go to Console tab before signing up.

Look for these messages:
- ✅ "Initializing Firebase..." - Firebase is starting
- ✅ "Firebase initialized successfully" - Firebase is ready
- ✅ "User created in Firebase Auth: [uid]" - Auth worked
- ✅ "Display name updated" - Profile update worked
- ✅ "Creating user profile in Firestore..." - Starting Firestore write
- ✅ "Firestore instance retrieved successfully" - Firestore is available
- ✅ "User profile created successfully in Firestore: [uid]" - SUCCESS!

### 2. Check for Errors
Look for these error messages:
- ❌ "Firestore not initialized" - Firebase config issue
- ❌ "Failed to initialize Firestore" - Firebase app issue
- ❌ "Error creating user profile" - Firestore write failed
- ❌ "Missing or insufficient permissions" - Firestore rules issue

### 3. Verify Firebase Console

#### Check Firestore Database:
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: babhijra-36e2b
3. Go to "Firestore Database" in left menu
4. Check if database is created (not in "Native mode")
5. Look for "users" collection

#### Check Authentication:
1. Go to "Authentication" in left menu
2. Check if user appears in "Users" tab
3. Note the UID

### 4. Common Issues

#### Issue: "Missing or insufficient permissions"
**Solution:** Deploy Firestore rules
```bash
firebase deploy --only firestore:rules
```

#### Issue: Firestore not initialized
**Solution:** Check .env file has all Firebase config values

#### Issue: User in Auth but not in Firestore
**Possible causes:**
1. Firestore rules blocking write
2. Firestore not enabled in Firebase Console
3. Network/CORS issue

### 5. Manual Test in Browser Console

After signup fails, try this in browser console:
```javascript
import { getFirebaseDb } from './src/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const db = getFirebaseDb();
console.log('DB:', db);

// Try to write a test document
const testRef = doc(db, 'users', 'test-user-123');
await setDoc(testRef, {
  uid: 'test-user-123',
  email: 'test@test.com',
  displayName: 'Test User',
  role: 'user',
  createdAt: Date.now(),
  updatedAt: Date.now()
});
console.log('Test write successful!');
```

### 6. Check Firestore Rules

Current rules should allow authenticated users to create their own user document:
```
match /users/{uid} {
  allow create: if isOwner(uid);
}
```

Verify this is deployed in Firebase Console → Firestore Database → Rules tab.
