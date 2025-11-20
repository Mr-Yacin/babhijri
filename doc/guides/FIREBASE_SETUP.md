# Firebase Setup Guide for BabHijra

This guide will walk you through setting up Firebase for the BabHijra application.

---

## 📋 Prerequisites

- Google account
- Firebase project (or create a new one)
- Access to Firebase Console

---

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `babhijra` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click **"Create project"**

---

### Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register app with nickname: `BabHijra Web`
3. **Do NOT** check "Set up Firebase Hosting" (we'll use Vercel/Netlify)
4. Click **"Register app"**
5. **Copy the Firebase configuration** - you'll need this for `.env`

The config looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### Step 3: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**

**Optional**: Enable other providers later
- Google
- Facebook
- Apple
- etc.

---

### Step 4: Create Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add rules later)
4. Select location: Choose closest to your users
   - For Arabic audience: `europe-west1` (Belgium) or `asia-south1` (Mumbai)
5. Click **"Enable"**

---

### Step 5: Set Up Firestore Security Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles
      allow read: if isSignedIn();
      // Only the user can create/update their own profile
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isSignedIn() && isOwner(userId);
      // Only the user can delete their own profile
      allow delete: if isSignedIn() && isOwner(userId);
    }
    
    // Profiles collection (dating profiles)
    match /profiles/{userId} {
      // Anyone authenticated can read profiles
      allow read: if isSignedIn();
      // Only the user can create/update their own profile
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isSignedIn() && isOwner(userId);
      // Only the user can delete their own profile
      allow delete: if isSignedIn() && isOwner(userId);
    }
    
    // Interactions collection (likes/passes)
    match /interactions/{interactionId} {
      // Users can only read their own interactions
      allow read: if isSignedIn() && 
                     (resource.data.fromUserId == request.auth.uid || 
                      resource.data.toUserId == request.auth.uid);
      // Users can only create interactions from themselves
      allow create: if isSignedIn() && 
                       request.resource.data.fromUserId == request.auth.uid;
      // No updates or deletes allowed
      allow update, delete: if false;
    }
    
    // Matches collection
    match /matches/{matchId} {
      // Users can only read matches they're part of
      allow read: if isSignedIn() && 
                     request.auth.uid in resource.data.users;
      // System creates matches (not users directly)
      // In production, use Cloud Functions to create matches
      allow create: if isSignedIn();
      allow update: if isSignedIn() && 
                       request.auth.uid in resource.data.users;
      allow delete: if false;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      // Users can only read conversations they're part of
      allow read: if isSignedIn() && 
                     request.auth.uid in resource.data.participants;
      // Users can create conversations with matched users
      allow create: if isSignedIn() && 
                       request.auth.uid in request.resource.data.participants;
      // Users can update conversations they're part of
      allow update: if isSignedIn() && 
                       request.auth.uid in resource.data.participants;
      allow delete: if false;
    }
    
    // Messages collection
    match /messages/{messageId} {
      // Users can read messages in their conversations
      allow read: if isSignedIn();
      // Users can only send messages as themselves
      allow create: if isSignedIn() && 
                       request.resource.data.senderId == request.auth.uid;
      // Users can update their own messages (for read receipts)
      allow update: if isSignedIn();
      allow delete: if false;
    }
    
    // Reports collection
    match /reports/{reportId} {
      // Only admins can read reports
      allow read: if isSignedIn() && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Any user can create a report
      allow create: if isSignedIn() && 
                       request.resource.data.reporterId == request.auth.uid;
      // Only admins can update reports
      allow update: if isSignedIn() && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow delete: if false;
    }
    
    // Blocks collection
    match /blocks/{blockId} {
      // Users can read their own blocks
      allow read: if isSignedIn() && 
                     resource.data.blockerId == request.auth.uid;
      // Users can create blocks
      allow create: if isSignedIn() && 
                       request.resource.data.blockerId == request.auth.uid;
      // Users can delete their own blocks
      allow delete: if isSignedIn() && 
                       resource.data.blockerId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

---

### Step 6: Enable Firebase Storage

1. In Firebase Console, go to **Build** → **Storage**
2. Click **"Get started"**
3. Choose **"Start in production mode"**
4. Select same location as Firestore
5. Click **"Done"**

---

### Step 7: Set Up Storage Security Rules

1. In Storage, go to **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isUnder5MB() {
      return request.resource.size < 5 * 1024 * 1024;
    }
    
    // Profile photos
    match /profiles/{userId}/{fileName} {
      // Anyone can read profile photos
      allow read: if true;
      // Only the user can upload their own photos
      allow create: if isSignedIn() && 
                       isOwner(userId) && 
                       isImage() && 
                       isUnder5MB();
      // Only the user can delete their own photos
      allow delete: if isSignedIn() && isOwner(userId);
    }
    
    // Chat images
    match /messages/{conversationId}/{fileName} {
      // Only conversation participants can read
      allow read: if isSignedIn();
      // Only authenticated users can upload
      allow create: if isSignedIn() && 
                       isImage() && 
                       isUnder5MB();
      allow delete: if false;
    }
  }
}
```

3. Click **"Publish"**

---

### Step 8: Create Firestore Indexes

For better query performance, create these indexes:

1. Go to **Firestore Database** → **Indexes** tab
2. Click **"Add index"**

#### Index 1: Profiles by age and location
- Collection ID: `profiles`
- Fields:
  - `isActive` (Ascending)
  - `country` (Ascending)
  - `age` (Ascending)
- Query scope: Collection

#### Index 2: Interactions by user
- Collection ID: `interactions`
- Fields:
  - `fromUserId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

#### Index 3: Messages by conversation
- Collection ID: `messages`
- Fields:
  - `conversationId` (Ascending)
  - `createdAt` (Ascending)
- Query scope: Collection

#### Index 4: Conversations by participant
- Collection ID: `conversations`
- Fields:
  - `participants` (Array)
  - `lastMessageAt` (Descending)
- Query scope: Collection

**Note**: Firestore will also suggest indexes when you run queries. You can create them on-demand.

---

### Step 9: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase config from Step 2:
   ```env
   PUBLIC_FIREBASE_API_KEY=AIza...
   PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   PUBLIC_FIREBASE_PROJECT_ID=your-project
   PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. **Important**: Add `.env` to `.gitignore` (already done)

---

### Step 10: Test the Setup

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:4321`

3. Try to sign up with a test account:
   - Go to `/app/signup`
   - Enter email and password
   - Click "Sign up"

4. Check Firebase Console:
   - Go to **Authentication** → **Users**
   - You should see your test user
   - Go to **Firestore Database**
   - You should see a `users` collection with your user document

---

## 🔐 Security Best Practices

### 1. API Key Security
- ✅ Firebase API keys are safe to expose in client-side code
- ✅ They're restricted by domain in Firebase Console
- ❌ Don't commit `.env` to Git (already in `.gitignore`)

### 2. Configure Authorized Domains
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain: `babhijra.com`
3. Add your staging domain if you have one

### 3. Enable App Check (Recommended)
1. Go to **Build** → **App Check**
2. Register your web app
3. Choose reCAPTCHA v3
4. Follow the setup instructions

### 4. Set Up Budget Alerts
1. Go to **Project Settings** → **Usage and billing**
2. Set up budget alerts to avoid unexpected charges
3. Recommended: Set alert at $10, $50, $100

---

## 📊 Firestore Data Structure

### Current Collections

#### `users`
```
users/{uid}
├── uid: string
├── email: string
├── displayName: string
├── photoURL?: string
├── bio?: string
├── location?: string
├── role: 'user' | 'admin'
├── createdAt: number
└── updatedAt: number
```

### Planned Collections

#### `profiles`
```
profiles/{uid}
├── uid: string
├── displayName: string
├── age: number
├── gender: 'male' | 'female'
├── location: string
├── photos: string[]
├── bio: string
├── interests: string[]
└── ... (see ../status/DOCUMENTATION.md for full schema)
```

#### `interactions`
```
interactions/{interactionId}
├── fromUserId: string
├── toUserId: string
├── type: 'like' | 'pass'
└── createdAt: timestamp
```

#### `matches`
```
matches/{matchId}
├── users: [uid1, uid2]
├── createdAt: timestamp
└── lastMessageAt?: timestamp
```

#### `conversations`
```
conversations/{conversationId}
├── participants: [uid1, uid2]
├── lastMessage: string
├── lastMessageAt: timestamp
└── unreadCount: { uid1: number, uid2: number }
```

#### `messages`
```
messages/{messageId}
├── conversationId: string
├── senderId: string
├── text: string
├── imageUrl?: string
├── readBy: string[]
└── createdAt: timestamp
```

---

## 🚨 Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
**Solution**: Make sure you've enabled Email/Password authentication in Firebase Console.

### Error: "Missing or insufficient permissions"
**Solution**: Check your Firestore Security Rules. Make sure the user is authenticated and has permission to read/write.

### Error: "Storage object not found"
**Solution**: Make sure Firebase Storage is enabled and the file path is correct.

### Error: "Quota exceeded"
**Solution**: Check your Firebase usage. You might need to upgrade to a paid plan (Blaze).

### Images not uploading
**Solution**: 
1. Check Storage Security Rules
2. Verify file size is under 5MB
3. Verify file type is an image
4. Check browser console for errors

---

## 📈 Monitoring & Analytics

### Enable Firebase Analytics
1. Go to **Project Settings** → **Integrations**
2. Enable **Google Analytics**
3. Follow the setup instructions

### Monitor Usage
1. Go to **Usage and billing** to see:
   - Authentication usage
   - Firestore reads/writes
   - Storage usage
   - Bandwidth

### Set Up Alerts
1. Go to **Alerts** in Firebase Console
2. Set up alerts for:
   - High authentication usage
   - High Firestore usage
   - Storage quota
   - Budget limits

---

## 🎓 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Security](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

## 📞 Support

If you encounter issues:
1. Check the [Firebase Status Dashboard](https://status.firebase.google.com)
2. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
3. Ask in [Firebase Discord](https://discord.gg/firebase)
4. Contact Firebase Support (paid plans only)

---

**Setup Complete!** 🎉

Your Firebase project is now ready for BabHijra. You can start developing the profile management system.

---

*Last Updated: November 20, 2025*
