# Quick Start Guide - BabHijra Development

This guide will get you up and running with BabHijra development in 5 minutes.

---

## ⚡ 5-Minute Setup

### 1. Prerequisites Check
```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Firebase
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Firebase credentials
# See FIREBASE_SETUP.md for detailed instructions
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) 🎉

---

## 📂 Project Navigation

### Where to Find Things

**Authentication**:
- `src/lib/firebase.ts` - Firebase config
- `src/lib/stores/auth.ts` - Auth state
- `src/components/auth/` - Login/Signup forms

**Dating Features**:
- `src/components/dating/` - Profile cards
- `src/pages/app/` - Dating app pages

**Blog**:
- `src/content/blog/` - Blog posts (Markdown)
- `src/pages/blog/` - Blog pages

**Configuration**:
- `src/config.ts` - Site settings
- `.env` - Firebase credentials

---

## 🎯 Common Tasks

### Add a New Page
```bash
# Create a new .astro file in src/pages/
# Example: src/pages/about.astro
```

### Add a New Component
```bash
# Create a new .svelte or .astro file in src/components/
# Example: src/components/common/Footer.svelte
```

### Add a Blog Post
```bash
# Create a new .md file in src/content/blog/
# Example: src/content/blog/germany-guide.md
```

Template:
```markdown
---
title: 'Your Title'
description: 'Your description'
pubDate: '2025-11-20'
heroImage: 'https://...'
tags: ['tag1', 'tag2']
author: 'Author Name'
---

Your content here...
```

### Create a New Service
```bash
# Create a new .ts file in src/lib/services/
# Example: src/lib/services/profile.ts
```

Template:
```typescript
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const profileService = {
    async getProfile(uid: string) {
        const docRef = doc(db, 'profiles', uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    },
    
    async createProfile(uid: string, data: any) {
        const docRef = doc(db, 'profiles', uid);
        await setDoc(docRef, data);
    }
};
```

---

## 🔥 Firebase Quick Reference

### Authentication
```typescript
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Sign up
await createUserWithEmailAndPassword(auth, email, password);

// Sign in
await signInWithEmailAndPassword(auth, email, password);

// Sign out
await signOut(auth);
```

### Firestore
```typescript
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Get document
const docRef = doc(db, 'users', uid);
const docSnap = await getDoc(docRef);
const data = docSnap.data();

// Create/Update document
await setDoc(docRef, { name: 'John' });

// Update document
await updateDoc(docRef, { name: 'Jane' });

// Delete document
await deleteDoc(docRef);

// Query collection
const q = query(collection(db, 'users'), where('age', '>', 18));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
});
```

### Storage
```typescript
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload file
const storageRef = ref(storage, `profiles/${uid}/${file.name}`);
await uploadBytes(storageRef, file);

// Get download URL
const url = await getDownloadURL(storageRef);
```

---

## 🎨 Styling Quick Reference

### Tailwind Classes
```html
<!-- Layout -->
<div class="container mx-auto px-4">
<div class="flex items-center justify-between">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- Colors (teal/amber/pink) -->
<div class="bg-teal-600 text-white">
<div class="bg-amber-500">
<div class="text-pink-600">

<!-- Spacing -->
<div class="p-4 m-2">      <!-- padding, margin -->
<div class="mt-8 mb-4">    <!-- margin top/bottom -->
<div class="space-y-4">    <!-- vertical spacing -->

<!-- Borders & Shadows -->
<div class="rounded-lg border border-gray-200 shadow-sm">

<!-- Typography -->
<h1 class="text-3xl font-bold">
<p class="text-gray-600 text-sm">
```

### RTL Support
```html
<!-- Use mr/ml for margin-right/left (auto-flips in RTL) -->
<div class="mr-4">  <!-- margin-right in LTR, margin-left in RTL -->
```

---

## 🧩 Component Patterns

### Svelte Component Template
```svelte
<script lang="ts">
    // Props
    export let title: string;
    export let count: number = 0;
    
    // State
    let isOpen = false;
    
    // Functions
    function handleClick() {
        count++;
    }
</script>

<div class="component">
    <h2>{title}</h2>
    <button on:click={handleClick}>
        Count: {count}
    </button>
</div>

<style>
    .component {
        /* Scoped styles */
    }
</style>
```

### Astro Component Template
```astro
---
// Server-side code
import Layout from '../layouts/Layout.astro';
const title = 'Page Title';
---

<Layout title={title}>
    <main>
        <h1>{title}</h1>
        <!-- Client-side component -->
        <MyComponent client:load />
    </main>
</Layout>
```

---

## 🐛 Debugging Tips

### Check Authentication State
```typescript
import { authStore } from '../lib/stores/auth';

authStore.subscribe(state => {
    console.log('Auth state:', state);
    console.log('User:', state.user);
    console.log('Is logged in:', state.isLoggedIn);
});
```

### Check Firestore Data
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Browse collections and documents

### Check Browser Console
- Press F12 to open DevTools
- Check Console tab for errors
- Check Network tab for failed requests

### Check Firebase Logs
1. Go to Firebase Console
2. Navigate to Functions (if using Cloud Functions)
3. Check logs for errors

---

## 📝 Git Workflow

### Before You Start
```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes
git pull origin main
```

### Create a Feature Branch
```bash
# Create and switch to new branch
git checkout -b feature/profile-creation

# Or for bug fixes
git checkout -b fix/login-error
```

### Commit Your Changes
```bash
# Check what changed
git status

# Add files
git add .

# Commit with descriptive message
git commit -m "Add profile creation form"
```

### Push to Remote
```bash
# Push branch to remote
git push origin feature/profile-creation
```

---

## 🧪 Testing Checklist

Before pushing code, test:

- [ ] Authentication works (signup/login/logout)
- [ ] Protected routes redirect to login
- [ ] Forms validate input
- [ ] Data saves to Firestore
- [ ] Images upload to Storage
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] RTL layout works correctly
- [ ] Loading states show
- [ ] Error messages display

---

## 📚 Useful Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Astro
```bash
npm run astro add    # Add integration
npm run astro check  # Type check
```

### Git
```bash
git status           # Check status
git log              # View commit history
git diff             # See changes
git stash            # Temporarily save changes
git stash pop        # Restore stashed changes
```

---

## 🆘 Common Issues & Solutions

### Issue: Port 4321 already in use
**Solution**: 
```bash
# Kill the process using port 4321
# Windows:
netstat -ano | findstr :4321
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Issue: Firebase not initialized
**Solution**: Check `.env` file has correct Firebase credentials

### Issue: "Module not found"
**Solution**: 
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Firestore permission denied
**Solution**: Check Firebase Security Rules and make sure user is authenticated

### Issue: Images not loading
**Solution**: 
1. Check Storage Security Rules
2. Verify file path is correct
3. Check CORS settings in Firebase Storage

---

## 🎓 Learning Resources

### Astro
- [Astro Docs](https://docs.astro.build)
- [Astro Tutorial](https://docs.astro.build/en/tutorial/0-introduction/)

### Svelte
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Svelte Docs](https://svelte.dev/docs)

### Firebase
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

---

## 🚀 Next Steps

1. **Read the documentation**:
   - `../status/DOCUMENTATION.md` - Full app documentation
   - `../status/ROADMAP.md` - Feature roadmap
   - `../status/TASKS.md` - Current tasks

2. **Set up Firebase**:
   - Follow `FIREBASE_SETUP.md`
   - Configure Security Rules
   - Create test data

3. **Start coding**:
   - Pick a task from `TASKS.md`
   - Create a feature branch
   - Write code
   - Test thoroughly
   - Commit and push

---

## 💡 Pro Tips

1. **Use TypeScript**: It catches errors early
2. **Test in mobile view**: Most users will be on mobile
3. **Check RTL layout**: Arabic is right-to-left
4. **Use Firestore offline**: Enable offline persistence
5. **Optimize images**: Use WebP format, compress before upload
6. **Monitor Firebase usage**: Set up budget alerts
7. **Write descriptive commits**: Future you will thank you
8. **Ask for help**: Check docs, Stack Overflow, Discord

---

**Happy Coding!** 🎉

---

*Last Updated: November 20, 2025*
