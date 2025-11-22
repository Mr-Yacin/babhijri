# BabHijra (باب الهجرة) 🌍💕

> **Your Gateway to Immigration and Love**  
> A dual-purpose platform for the Arabic-speaking community combining immigration resources with a respectful, marriage-focused dating platform.

[![Astro](https://img.shields.io/badge/Astro-5.15.9-FF5D01?logo=astro)](https://astro.build)
[![Svelte](https://img.shields.io/badge/Svelte-5.43.12-FF3E00?logo=svelte)](https://svelte.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 📖 About

**BabHijra** serves the Arabic-speaking community with:

1. **📚 Immigration Resources** - Comprehensive, up-to-date guides for immigration to Canada, USA, Europe, and more
2. **💑 Dating Platform** - Safe, respectful platform for serious relationships and marriage

### Key Features
- ✅ **RTL Support** - Full Right-to-Left layout for Arabic
- ✅ **Firebase Authentication** - Secure email/password login
- ✅ **User Profiles** - Create and manage dating profiles
- ✅ **Blog System** - Immigration guides and articles
- ✅ **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ✅ **Admin Panel** - Complete user management dashboard
- ✅ **Security Rules** - Role-based access control (RBAC)
- ✅ **Custom Modals** - Beautiful confirmation dialogs and toasts
- ✅ **Google Analytics 4** - Track user behavior and engagement
- ✅ **Google AdSense** - Professional ad placements for revenue
- 🔄 **Matching System** - Coming soon
- 🔄 **Messaging** - Coming soon

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project ([Create one here](https://console.firebase.google.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd babhijri
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   
   **Firebase Configuration** (Required):
   ```env
   PUBLIC_FIREBASE_API_KEY=your_api_key
   PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
   
   **Google Analytics 4** (Optional):
   ```env
   PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   PUBLIC_GA4_ENABLED=true
   ```
   
   **Google AdSense** (Optional):
   ```env
   PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
   PUBLIC_ADSENSE_ENABLED=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

---

## 📁 Project Structure

```
babhijri/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Login, Signup, UserMenu
│   │   ├── dating/          # ProfileCard, ProfileGrid
│   │   └── common/          # Header, Footer, etc.
│   ├── content/             # Blog posts (Markdown)
│   │   └── blog/
│   ├── layouts/             # Page layouts
│   ├── lib/                 # Utilities and services
│   │   ├── services/        # Business logic (user, profile, etc.)
│   │   ├── stores/          # State management (auth, etc.)
│   │   ├── types/           # TypeScript types
│   │   └── firebase.ts      # Firebase initialization
│   ├── pages/               # Routes (file-based routing)
│   │   ├── app/             # Dating app pages
│   │   ├── blog/            # Blog pages
│   │   └── index.astro      # Landing page
│   ├── styles/              # Global styles
│   └── config.ts            # App configuration
├── public/                  # Static assets
├── doc/                     # Project documentation
│   ├── status/              # Roadmap, tasks, summary
│   ├── guides/              # Setup guides (Firebase, Email, etc.)
│   └── archive/             # Old documentation
└── README.md                # This file
```

---

## 🛠 Tech Stack

### Frontend
- **[Astro](https://astro.build)** - Static site generator with islands architecture
- **[Svelte](https://svelte.dev)** - Reactive UI components
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org)** - Type safety

### Backend
- **[Firebase](https://firebase.google.com)** - Backend-as-a-Service
  - Authentication (Email/Password)
  - Firestore (NoSQL Database)
  - Storage (File uploads)

### Fonts
- **[Noto Sans Arabic](https://fonts.google.com/noto/specimen/Noto+Sans+Arabic)** - Beautiful Arabic typography

---

## 📚 Documentation

### Deployment Guides 🚀
- **[DEPLOY NOW](./DEPLOY_NOW.md)** - ⚡ Quick 3-step deployment
- **[Quick Deploy Guide](./doc/guides/QUICK_DEPLOY_GUIDE.md)** - 5-minute comprehensive guide
- **[Deployment Summary](./DEPLOYMENT_SUMMARY.md)** - What was fixed and next steps
- **[All Deployment Guides](./doc/guides/README.md)** - Complete guide index

### Project Documentation
- **[DOCUMENTATION.md](./doc/status/DOCUMENTATION.md)** - Complete application documentation
- **[ROADMAP.md](./doc/status/ROADMAP.md)** - Development roadmap and feature planning
- **[TASKS.md](./doc/status/TASKS.md)** - Current tasks and sprint planning
- **[Setup Guides](./doc/guides/)** - Firebase, Email, and other setup guides

---

## 🎯 Current Status

### ✅ Completed
- Basic authentication (login/signup)
- User profile creation and management
- Landing page with hero section
- Blog system with content collections
- Profile card UI components
- RTL support and Arabic typography
- **Admin Panel** with user management
- **Security Rules** with RBAC
- Custom Modal and Toast components
- User status and role management
- Profile editing from admin panel

### 🔄 In Progress
- Profile creation flow (multi-step form)
- Photo upload system
- Matching algorithm
- Messaging system

### 📋 Planned
- Advanced filters and search
- Email verification
- Password reset
- Content moderation
- Analytics dashboard
- Premium features
- Mobile app

See [ROADMAP.md](./doc/status/ROADMAP.md) for detailed feature planning.

---

## 🔐 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password
3. Create a **Firestore Database**
4. Enable **Storage**
5. Copy your config to `.env`

---

## 📊 Google Analytics & AdSense Setup

### Google Analytics 4 (GA4)

**Setup Instructions:**

1. **Create a GA4 Property**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property or use an existing one
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add to Environment Variables**
   ```env
   PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   PUBLIC_GA4_ENABLED=true
   ```

3. **Analytics Features**
   - ✅ Automatic page view tracking
   - ✅ Custom event tracking
   - ✅ Route-based filtering (excludes admin, login, signup pages)
   - ✅ Privacy-compliant with consent banner

**Tracking Custom Events:**

```typescript
import { analytics } from '@/lib/utils/analytics';

// Track button clicks
analytics.clickButton('cta-hero', 'Get Started');

// Track form submissions
analytics.submitForm('contact');

// Track profile views
analytics.viewProfile('user123');

// Track custom events
import { trackEvent } from '@/lib/utils/analytics';
trackEvent('custom_event', {
  category: 'engagement',
  label: 'feature_used',
  value: 1
});
```

**Pages with Analytics:**
- ✅ Homepage, Blog, App pages, Messages
- ❌ Admin, Profile, Dashboard, Login, Signup (excluded for privacy)

### Google AdSense

**Setup Instructions:**

1. **Create AdSense Account**
   - Go to [Google AdSense](https://www.google.com/adsense/)
   - Apply for an account and get approved
   - Get your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)

2. **Add to Environment Variables**
   ```env
   PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
   PUBLIC_ADSENSE_ENABLED=true
   ```

3. **Create Ad Units**
   - In AdSense dashboard, create ad units
   - Copy the ad slot IDs for each placement
   - Update ad placements in your pages (see below)

**Adding New Ad Placements:**

Use the pre-built ad components for consistent styling:

```astro
---
// For standard ad units
import AdUnit from '@/components/ads/AdUnit.astro';

// For in-content blog ads
import InContentAd from '@/components/ads/InContentAd.astro';
---

<!-- Standard Ad Unit -->
<AdUnit 
  slot="1234567890"
  format="auto"
  responsive={true}
/>

<!-- Rectangle Ad -->
<AdUnit 
  slot="1234567890"
  format="rectangle"
  responsive={true}
/>

<!-- In-Content Ad (for blog posts) -->
<InContentAd 
  slot="1234567890"
  position="middle"
/>
```

**Ad Component Props:**

`AdUnit.astro`:
- `slot` (required): Your AdSense ad slot ID
- `format`: `'auto'` | `'fluid'` | `'rectangle'` | `'vertical'` | `'horizontal'` (default: `'auto'`)
- `responsive`: `boolean` (default: `true`)
- `style`: `'display'` | `'in-article'` | `'in-feed'` (default: `'display'`)
- `className`: Additional CSS classes

`InContentAd.astro`:
- `slot` (required): Your AdSense ad slot ID
- `position`: `'top'` | `'middle'` | `'bottom'` (default: `'middle'`)

**Pages with Ads:**
- ✅ Homepage, Blog posts, App/Index, Messages
- ❌ Admin, Profile, Dashboard, Login, Signup, Settings, Contact, Help, Privacy, Terms

**Ad Placement Best Practices:**
- Maintain 3:1 content-to-ad ratio
- Place ads at natural content breaks
- Use `InContentAd` for blog posts (professional styling)
- Ads automatically collapse when blocked or fail to load
- Fully responsive on all devices

### Configuration

All analytics and ad settings are centralized in `src/config.ts`:

```typescript
export const ANALYTICS_CONFIG = {
    // Google Analytics 4
    ga4: {
        measurementId: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || '',
        enabled: import.meta.env.PUBLIC_GA4_ENABLED !== 'false',
    },
    
    // Google AdSense
    adsense: {
        publisherId: import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || '',
        enabled: import.meta.env.PUBLIC_ADSENSE_ENABLED !== 'false',
    },
    
    // Page routing rules
    routes: {
        // Pages where ads should be displayed
        adEnabledPages: [
            '/',
            '/blog',
            '/blog/',
            '/app',
            '/app/',
            '/app/messages',
        ],
        
        // Pages where ads should NOT be displayed
        adExcludedPages: [
            '/app/admin',
            '/app/profile',
            '/app/dashboard',
            '/app/login',
            '/app/signup',
            '/app/settings',
            '/contact',
            '/help',
            '/privacy',
            '/terms',
        ],
        
        // Pages where analytics should NOT track
        analyticsExcludedPages: [
            '/app/admin',
            '/app/profile',
            '/app/dashboard',
            '/app/login',
            '/app/signup',
        ],
    },
};
```

**Customizing Routes:**

To add or remove pages from tracking/ads, edit the arrays in `src/config.ts`:

```typescript
// Add a new page to ad-enabled pages
adEnabledPages: [
    '/',
    '/blog',
    '/your-new-page',  // Add here
],

// Exclude a page from analytics
analyticsExcludedPages: [
    '/app/admin',
    '/your-private-page',  // Add here
],
```

### Privacy & Consent

The platform includes a consent banner that:
- Appears on first visit
- Stores user preferences in local storage
- Allows users to accept or decline tracking
- Links to privacy policy
- Reloads page after consent to initialize analytics

Users can manage their consent at any time through browser settings or by clearing local storage.

## 🚀 Deployment

See [`DEPLOY_TO_VERCEL.md`](./DEPLOY_TO_VERCEL.md) for deployment instructions.

### Environment Variables

Add these environment variables in your deployment platform:

**Required:**
```
PUBLIC_FIREBASE_API_KEY=your_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Optional (Email notifications):**
```
PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

**Optional (Analytics & Ads):**
```
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_GA4_ENABLED=true
PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
PUBLIC_ADSENSE_ENABLED=true
```

### Build Configuration

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18 or higher

### Important Notes

- Environment variables are injected at runtime (browser)
- Firebase initialization is deferred to runtime to avoid build errors
- All Firebase-related code runs client-side only

### Firestore Collections
- `users` - User account information and roles
- `profiles` - Dating profiles with photos and preferences
- `userSettings` - User preferences and privacy settings
- `profileStats` - Profile views, likes, and matches
- `userActivity` - Activity logs for admin monitoring
- `adminStats` - Platform statistics
- `matches` - User matches (coming soon)
- `messages` - Chat messages (coming soon)

---

## 🌐 Configuration

Edit `src/config.ts` to customize:

```typescript
export const SITE_CONFIG = {
    name: 'BabHijra',
    domain: 'babhijra.com',
    description: 'Immigration and Dating for the Arabic Community',
    email: 'contact@babhijra.com',
    defaultLang: 'ar',
    dir: 'rtl',
};
```

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines (coming soon).

---

## 📄 License

This project is private and proprietary.

---

## 📞 Contact

- **Email**: contact@babhijra.com
- **Website**: babhijra.com (coming soon)

---

## 🙏 Acknowledgments

- [Astro](https://astro.build) for the amazing framework
- [Svelte](https://svelte.dev) for reactive components
- [Firebase](https://firebase.google.com) for backend services
- [Tailwind CSS](https://tailwindcss.com) for styling
- Arabic community for inspiration

---

**Made with ❤️ for the Arabic-speaking community**
