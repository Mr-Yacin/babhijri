# BabHijra - Application Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Current Features](#current-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Authentication System](#authentication-system)
7. [Database Schema](#database-schema)
8. [Components](#components)
9. [Pages & Routes](#pages--routes)
10. [Styling & Design](#styling--design)

---

## 🎯 Project Overview

**BabHijra** is a dual-purpose web application targeting the Arabic-speaking community, combining:
- **Immigration Resources**: Comprehensive guides and articles about immigration to various countries
- **Dating Platform**: A respectful, marriage-focused dating platform for Arabs in diaspora and the Arab world

### Key Characteristics
- **Language**: Arabic (RTL support)
- **Target Audience**: Arabic-speaking community interested in immigration and serious relationships
- **Domain**: babhijra.com (configurable)
- **Framework**: Astro + Svelte
- **Backend**: Firebase (Authentication, Firestore, Storage)

---

## ✅ Current Features

### 1. **Authentication System**
- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Authentication state management (Svelte stores)
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ User profile creation in Firestore
- ✅ User menu component (shows user info when logged in)
- ⚠️ **Missing**: Password reset, email verification, social login

### 2. **Blog/Immigration Content**
- ✅ Content collection setup (Astro Content Collections)
- ✅ Blog post schema (title, description, pubDate, heroImage, author, tags)
- ✅ Sample blog post (Canada immigration guide)
- ✅ Blog listing page
- ✅ Individual blog post pages
- ⚠️ **Missing**: More blog content, search, filtering by tags, pagination

### 3. **Dating Platform**
- ✅ Profile card component (with image, name, age, location, bio)
- ✅ Profile grid component (displays multiple profiles)
- ✅ Like/unlike functionality (client-side only)
- ✅ Basic UI for messaging button
- ⚠️ **Missing**: Real profile data from Firestore, profile creation, matching algorithm, messaging system

### 4. **User Interface**
- ✅ RTL (Right-to-Left) support
- ✅ Arabic font (Noto Sans Arabic)
- ✅ Responsive design with Tailwind CSS
- ✅ Header component with navigation
- ✅ Landing page with hero section and features
- ✅ Modern, clean design with teal/amber/pink color scheme

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Astro 5.15.9
- **UI Library**: Svelte 5.43.12
- **Styling**: Tailwind CSS 4.1.17
- **Typography**: @tailwindcss/typography
- **Language**: TypeScript 5.9.3

### Backend
- **BaaS**: Firebase 12.6.0
  - Authentication (Email/Password)
  - Firestore (NoSQL Database)
  - Storage (File uploads)

### Development
- **Package Manager**: npm
- **Build Tool**: Vite (via Astro)
- **Dev Server**: Astro Dev Server (localhost:4321)

---

## 📁 Project Structure

```
babhijri/
├── .astro/                 # Astro build cache
├── .vscode/                # VS Code settings
├── dist/                   # Production build output
├── node_modules/           # Dependencies
├── public/                 # Static assets
│   └── favicon.svg
├── src/
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable components
│   │   ├── auth/           # Authentication components
│   │   │   ├── LoginForm.svelte
│   │   │   ├── SignupForm.svelte
│   │   │   └── UserMenu.svelte
│   │   ├── blog/           # Blog components
│   │   ├── common/         # Shared components
│   │   │   └── Header.astro
│   │   ├── dating/         # Dating platform components
│   │   │   ├── ProfileCard.svelte
│   │   │   └── ProfileGrid.svelte
│   │   └── Welcome.astro
│   ├── content/            # Content collections
│   │   ├── blog/           # Blog posts (Markdown)
│   │   │   └── canada-guide.md
│   │   └── config.ts       # Content schema definitions
│   ├── layouts/            # Page layouts
│   │   └── Layout.astro
│   ├── lib/                # Utilities and services
│   │   ├── services/       # Business logic
│   │   │   └── user.ts
│   │   ├── stores/         # State management
│   │   │   └── auth.ts
│   │   ├── types/          # TypeScript types
│   │   │   └── user.ts
│   │   └── firebase.ts     # Firebase initialization
│   ├── pages/              # Routes (file-based routing)
│   │   ├── app/            # Dating app pages
│   │   │   ├── index.astro
│   │   │   ├── login.astro
│   │   │   └── signup.astro
│   │   ├── blog/           # Blog pages
│   │   │   ├── [...slug].astro
│   │   │   └── index.astro
│   │   └── index.astro     # Landing page
│   ├── styles/             # Global styles
│   │   └── global.css
│   ├── config.ts           # App configuration
│   └── env.d.ts            # TypeScript environment types
├── .env                    # Environment variables (not in git)

### Site Configuration (`src/config.ts`)
```typescript
export const SITE_CONFIG = {
    name: 'BabHijra',
    domain: 'babhijra.com',
    description: 'Immigration and Dating for the Arabic Community',
    email: 'contact@babhijra.com',
    defaultLang: 'ar',
    dir: 'rtl',
};

export const NAV_LINKS = [
    { name: 'Home', href: '/', translation: 'الرئيسية' },
    { name: 'Blog', href: '/blog', translation: 'المدونة' },
    { name: 'Dating', href: '/app', translation: 'تعارف' },
];
```

### Environment Variables (`.env`)
```bash
PUBLIC_FIREBASE_API_KEY=your_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🔐 Authentication System

### Firebase Setup (`src/lib/firebase.ts`)
- Initializes Firebase app with environment variables
- Exports: `app`, `auth`, `db`, `storage`

### Auth Store (`src/lib/stores/auth.ts`)
- Svelte writable store for authentication state
- Tracks: `user`, `loading`, `isLoggedIn`
- Listens to Firebase `onAuthStateChanged`
- Initialized in `Layout.astro`

### User Service (`src/lib/services/user.ts`)
Functions:
- `createUserProfile(user, additionalData)` - Creates user document in Firestore
- `getUserProfile(uid)` - Fetches user profile from Firestore
- `updateUserProfile(uid, data)` - Updates user profile

### User Type (`src/lib/types/user.ts`)
```typescript
interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    bio?: string;
    location?: string;
    role: 'user' | 'admin';
    createdAt: number;
    updatedAt: number;
}
```

---

## 🗄️ Database Schema

### Current Firestore Collections

#### `users` Collection
```
users/{uid}
├── uid: string
├── email: string
├── displayName: string
├── photoURL?: string
├── bio?: string
├── location?: string
├── role: 'user' | 'admin'
├── createdAt: number (timestamp)
└── updatedAt: number (timestamp)
```

### Missing Collections (To Be Implemented)
- `profiles` - Extended dating profiles
- `matches` - User matches/likes
- `messages` - Chat messages
- `conversations` - Chat threads
- `reports` - User reports/moderation

---

## 🧩 Components

### Authentication Components

#### `LoginForm.svelte`
- Email/password login form
- Error handling with Arabic messages
- Loading states
- Redirect to `/app` on success
- Link to signup page

#### `SignupForm.svelte`
- Email/password registration form
- Creates user in Firebase Auth
- Creates user profile in Firestore
- Error handling with Arabic messages
- Link to login page

#### `UserMenu.svelte`
- Displays user info when logged in
- Dropdown menu with profile/logout options
- Uses auth store for state

### Dating Components

#### `ProfileCard.svelte`
Props:
- `name`, `age`, `location`, `bio`, `image`, `verified`
Features:
- Like/unlike button with animation
- Message button
- Verified badge
- Hover effects

#### `ProfileGrid.svelte`
- Displays grid of profile cards
- Currently uses mock data
- Responsive grid layout

### Common Components

#### `Header.astro`
- Site navigation
- Logo/brand
- User menu (when logged in)
- RTL support

---

## 📄 Pages & Routes

### Public Pages
- `/` - Landing page (hero + features)
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog post

### App Pages (Protected)
- `/app` - Dating platform main page
- `/app/login` - Login page
- `/app/signup` - Signup page

### Route Protection
Currently implemented in `/app/index.astro`:
```javascript
authStore.subscribe(state => {
    if (!state.loading && !state.isLoggedIn) {
        window.location.href = '/app/login';
    }
});
```

---

## 🎨 Styling & Design

### Design System
- **Primary Color**: Teal (immigration/trust)
- **Secondary Color**: Amber (warmth/opportunity)
- **Accent Color**: Pink (love/dating)
- **Font**: Noto Sans Arabic (Google Fonts)
- **Direction**: RTL (Right-to-Left)

### Tailwind Configuration
- Using Tailwind CSS 4.1.17
- Typography plugin enabled
- Custom color scheme
- Responsive breakpoints

### Key Design Patterns
- Rounded corners (`rounded-lg`, `rounded-2xl`)
- Subtle shadows (`shadow-sm`)
- Hover effects and transitions
- Gradient overlays
- Card-based layouts

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Astro CLI
npm run astro
```

---

## 📝 Notes

### Current Limitations
1. **No real profile data** - ProfileGrid uses mock data
2. **No messaging system** - Message button is non-functional
3. **No matching algorithm** - Likes are client-side only
4. **Limited blog content** - Only one sample post
5. **No admin panel** - No content management
6. **No email verification** - Users can register without verifying email
7. **No password reset** - Users cannot reset forgotten passwords
8. **No profile editing** - Users cannot update their profiles after creation
9. **No image upload** - No way to upload profile pictures
10. **No search/filters** - Cannot search or filter profiles

### Security Considerations
- Firebase Security Rules need to be configured
- Input validation needed on all forms
- Rate limiting for API calls
- Content moderation system needed
- Report/block functionality needed

---

## 📞 Support & Contact

- **Email**: contact@babhijra.com
- **Domain**: babhijra.com

---

*Last Updated: November 20, 2025*
