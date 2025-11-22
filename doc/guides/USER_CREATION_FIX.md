# User Creation Fix

## Problem
When users signed up, their accounts were created in Firebase Authentication but not in the Firestore `users` collection. Only the `profiles` collection was being populated.

## Root Cause
The `userService.createUserProfile()` function in `src/lib/services/user.ts` was importing `db` directly from `firebase.ts`, which could be `null` during initialization, causing silent failures when trying to write to Firestore.

## Solution
Updated `src/lib/services/user.ts` to:
1. Use `getFirebaseDb()` instead of importing `db` directly
2. Added proper null checks for the Firestore instance
3. Added better error logging to catch initialization issues
4. Added success logging to confirm user profile creation

## Changes Made
- **src/lib/services/user.ts**: Updated all methods to use `getFirebaseDb()` and added proper error handling

## How to Test
1. Clear your browser cache and cookies
2. Go to `/app/signup`
3. Create a new account with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Check Firebase Console → Firestore Database → `users` collection
5. You should see a new document with the user's UID containing:
   - uid
   - email
   - displayName
   - role: "user"
   - createdAt
   - updatedAt

## Verification
Open browser console during signup to see:
- "User profile created successfully in Firestore: [uid]"

If you see errors, check:
1. Firebase config in `.env` is correct
2. Firestore is enabled in Firebase Console
3. Firestore rules allow user creation (already configured correctly)
