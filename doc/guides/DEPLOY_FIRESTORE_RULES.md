# Deploy Firestore Rules - REQUIRED

## Problem
You're getting "Missing or insufficient permissions" error because the Firestore rules haven't been deployed to Firebase.

## Solution

### Step 1: Install Firebase CLI (if not installed)
```bash
npm install -g firebase-cli
```

### Step 2: Login to Firebase
```bash
firebase login
```
This will open a browser window to authenticate.

### Step 3: Initialize Firebase (if not done)
```bash
firebase init
```
- Select: Firestore
- Use existing project: babhijra-36e2b
- Use default files (firestore.rules, firestore.indexes.json)

### Step 4: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

You should see:
```
✔  Deploy complete!
```

### Step 5: Verify in Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select project: babhijra-36e2b
3. Go to: Firestore Database → Rules
4. You should see the updated rules with `isAdminEmail()` function

## What Changed in Rules

### Added Email-Based Admin Check
```javascript
function isAdminEmail() {
  return isAuthenticated() && 
         request.auth.token.email in ['admin@babhijra.com'];
}
```

This allows users with `admin@babhijra.com` email to:
- Read all users (for dashboard stats)
- Update/delete users
- Manage profiles
- Access admin stats

### Why This Fix Works
- **Before:** Rules only checked `role: 'admin'` in user document
- **Problem:** New users don't have this role set
- **After:** Rules also check email address from Firebase Auth token
- **Result:** Admin email can access everything immediately

## Important Notes

### Security
The admin email is hardcoded in Firestore rules. To add more admins:

1. Edit `firestore.rules`:
```javascript
function isAdminEmail() {
  return isAuthenticated() && 
         request.auth.token.email in [
           'admin@babhijra.com',
           'another-admin@example.com'
         ];
}
```

2. Deploy rules again:
```bash
firebase deploy --only firestore:rules
```

3. Also update `.env`:
```
ADMIN_EMAILS=admin@babhijra.com,another-admin@example.com
```

4. Restart dev server

### Testing After Deployment

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Logout and login** with admin email
3. **Go to** `/app/admin`
4. **Should work** without permission errors

### Troubleshooting

#### Error: "Firebase CLI not found"
```bash
npm install -g firebase-cli
```

#### Error: "No project active"
```bash
firebase use babhijra-36e2b
```

#### Error: "Permission denied"
Make sure you're logged in with the correct Google account that owns the Firebase project.

#### Still getting permission errors?
1. Check Firebase Console → Firestore → Rules
2. Verify the rules were deployed (check timestamp)
3. Try logging out and back in
4. Check that you're using the admin email

## Quick Command Reference

```bash
# Install Firebase CLI
npm install -g firebase-cli

# Login
firebase login

# Check current project
firebase projects:list

# Use specific project
firebase use babhijra-36e2b

# Deploy rules only
firebase deploy --only firestore:rules

# Deploy everything
firebase deploy
```
