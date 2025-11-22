# Google Analytics & AdSense Integration Guide

This guide provides comprehensive documentation for the Google Analytics 4 (GA4) and Google AdSense integration in BabHijra.

## Table of Contents

- [Overview](#overview)
- [Google Analytics 4 Setup](#google-analytics-4-setup)
- [Google AdSense Setup](#google-adsense-setup)
- [Adding Ad Placements](#adding-ad-placements)
- [Tracking Custom Events](#tracking-custom-events)
- [Configuration](#configuration)
- [Privacy & Consent](#privacy--consent)
- [Troubleshooting](#troubleshooting)

---

## Overview

The platform includes integrated support for:

- **Google Analytics 4 (GA4)**: Track user behavior, page views, and custom events
- **Google AdSense**: Display responsive ads for revenue generation
- **Privacy Compliance**: Consent banner and route-based filtering
- **Professional Design**: Clean ad styling that enhances user experience

### Key Features

✅ **Route-Based Filtering**: Automatically excludes sensitive pages (admin, login, profile)  
✅ **Consent Management**: User-friendly banner for privacy compliance  
✅ **Responsive Ads**: Adapts to all screen sizes  
✅ **Custom Event Tracking**: Track button clicks, form submissions, and more  
✅ **Professional Styling**: In-content ads with proper spacing and labels  
✅ **Graceful Degradation**: Ads collapse when blocked or fail to load  

---

## Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom left)
3. Click **Create Property**
4. Enter property details:
   - Property name: `BabHijra`
   - Time zone: Your timezone
   - Currency: Your currency
5. Click **Next** and complete the setup wizard

### Step 2: Get Measurement ID

1. In your GA4 property, go to **Admin** > **Data Streams**
2. Click on your web data stream (or create one)
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Add to Environment Variables

Add to your `.env` file:

```env
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_GA4_ENABLED=true
```

### Step 4: Verify Installation

1. Start your development server: `npm run dev`
2. Open your site in a browser
3. Open browser DevTools > Network tab
4. Filter by "gtag"
5. You should see requests to `googletagmanager.com`

Alternatively, use the [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

### What Gets Tracked

**Automatically Tracked:**
- Page views on all enabled pages
- User sessions
- Device and browser information
- Geographic location (country/city)

**Custom Events (via utility functions):**
- Button clicks
- Form submissions
- Profile views
- Message sends
- Any custom events you define

**Pages Excluded from Tracking:**
- `/app/admin` - Admin panel
- `/app/profile` - User profiles
- `/app/dashboard` - User dashboard
- `/app/login` - Login page
- `/app/signup` - Signup page

---

## Google AdSense Setup

### Step 1: Create AdSense Account

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click **Get Started**
3. Enter your website URL and email
4. Complete the application process
5. Wait for approval (can take 1-2 weeks)

### Step 2: Get Publisher ID

1. Once approved, log in to AdSense
2. Go to **Account** > **Settings**
3. Copy your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 3: Create Ad Units

1. In AdSense, go to **Ads** > **By ad unit**
2. Click **Display ads**
3. Create ad units for different placements:
   - **Homepage Hero**: Responsive display ad
   - **Blog In-Content**: In-article ad
   - **Sidebar**: Vertical ad
   - **Footer**: Horizontal ad
4. Copy each **Ad slot ID** (10-digit number)

### Step 4: Add to Environment Variables

Add to your `.env` file:

```env
PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
PUBLIC_ADSENSE_ENABLED=true
```

### Step 5: Verify Installation

1. Start your development server: `npm run dev`
2. Open your site in a browser
3. Open browser DevTools > Network tab
4. Filter by "adsbygoogle"
5. You should see requests to `googlesyndication.com`

**Note**: Ads may not display in development mode. Test on a deployed site for accurate results.

---

## Adding Ad Placements

### Using AdUnit Component

The `AdUnit` component is a flexible, reusable component for displaying ads anywhere on your site.

**Basic Usage:**

```astro
---
import AdUnit from '@/components/ads/AdUnit.astro';
---

<AdUnit 
  slot="1234567890"
  format="auto"
  responsive={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slot` | `string` | *required* | Your AdSense ad slot ID (10-digit number) |
| `format` | `'auto' \| 'fluid' \| 'rectangle' \| 'vertical' \| 'horizontal'` | `'auto'` | Ad format/shape |
| `responsive` | `boolean` | `true` | Enable responsive sizing |
| `style` | `'display' \| 'in-article' \| 'in-feed'` | `'display'` | Ad style type |
| `className` | `string` | `''` | Additional CSS classes |

**Examples:**

```astro
<!-- Auto-sized responsive ad -->
<AdUnit slot="1234567890" />

<!-- Rectangle ad for sidebar -->
<AdUnit 
  slot="1234567890"
  format="rectangle"
/>

<!-- Horizontal ad for footer -->
<AdUnit 
  slot="1234567890"
  format="horizontal"
  className="my-custom-class"
/>

<!-- In-article ad -->
<AdUnit 
  slot="1234567890"
  format="fluid"
  style="in-article"
/>
```

### Using InContentAd Component

The `InContentAd` component is specifically designed for blog posts and articles. It includes professional styling with ad labels and proper spacing.

**Basic Usage:**

```astro
---
import InContentAd from '@/components/ads/InContentAd.astro';
---

<InContentAd 
  slot="1234567890"
  position="middle"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slot` | `string` | *required* | Your AdSense ad slot ID |
| `position` | `'top' \| 'middle' \| 'bottom'` | `'middle'` | Position in content |

**Examples:**

```astro
<!-- Ad at top of article -->
<InContentAd slot="1234567890" position="top" />

<!-- Ad in middle of article -->
<InContentAd slot="1234567890" position="middle" />

<!-- Ad at bottom of article -->
<InContentAd slot="1234567890" position="bottom" />
```

**Styling Features:**
- ✅ "إعلان" (Advertisement) label in Arabic
- ✅ Subtle gradient background
- ✅ Rounded corners with border
- ✅ Proper spacing from content
- ✅ Responsive on mobile (full-width, no border radius)

### Ad Placement Best Practices

**Homepage:**
```astro
---
import AdUnit from '@/components/ads/AdUnit.astro';
---

<!-- After hero section -->
<section class="hero">
  <!-- Hero content -->
</section>

<AdUnit slot="1234567890" format="auto" />

<!-- Main content -->
<section class="content">
  <!-- Content -->
</section>

<!-- Footer ad -->
<AdUnit slot="0987654321" format="horizontal" />
```

**Blog Post:**
```astro
---
import InContentAd from '@/components/ads/InContentAd.astro';
---

<article>
  <h1>{title}</h1>
  
  <!-- First few paragraphs -->
  <p>...</p>
  <p>...</p>
  
  <!-- Ad after introduction -->
  <InContentAd slot="1234567890" position="top" />
  
  <!-- More content -->
  <p>...</p>
  <p>...</p>
  <p>...</p>
  
  <!-- Ad in middle -->
  <InContentAd slot="0987654321" position="middle" />
  
  <!-- Rest of content -->
  <p>...</p>
  <p>...</p>
  
  <!-- Ad at end -->
  <InContentAd slot="5555555555" position="bottom" />
</article>
```

**Sidebar (Desktop Only):**
```astro
<div class="container">
  <main class="content">
    <!-- Main content -->
  </main>
  
  <aside class="sidebar hidden md:block">
    <AdUnit 
      slot="1234567890"
      format="vertical"
    />
  </aside>
</div>
```

### Pages with Ads

Ads are automatically enabled on:
- ✅ Homepage (`/`)
- ✅ Blog listing (`/blog`)
- ✅ Blog posts (`/blog/*`)
- ✅ App landing (`/app`)
- ✅ Messages page (`/app/messages`)

Ads are automatically disabled on:
- ❌ Admin panel (`/app/admin`)
- ❌ User profiles (`/app/profile`)
- ❌ Dashboard (`/app/dashboard`)
- ❌ Login/Signup (`/app/login`, `/app/signup`)
- ❌ Settings (`/app/settings`)
- ❌ Legal pages (`/privacy`, `/terms`)
- ❌ Help pages (`/contact`, `/help`)

---

## Tracking Custom Events

### Using Analytics Utility Functions

The platform provides helper functions for common tracking scenarios.

**Import:**

```typescript
import { analytics, trackEvent } from '@/lib/utils/analytics';
```

### Common Event Helpers

**Track Button Clicks:**

```typescript
import { analytics } from '@/lib/utils/analytics';

function handleClick() {
  analytics.clickButton('cta-hero', 'Get Started');
  // Your button logic
}
```

**Track Form Submissions:**

```typescript
import { analytics } from '@/lib/utils/analytics';

function handleSubmit(e: Event) {
  e.preventDefault();
  analytics.submitForm('contact');
  // Your form logic
}
```

**Track Profile Views:**

```typescript
import { analytics } from '@/lib/utils/analytics';

function viewProfile(userId: string) {
  analytics.viewProfile(userId);
  // Your profile logic
}
```

**Track Message Sends:**

```typescript
import { analytics } from '@/lib/utils/analytics';

function sendMessage() {
  analytics.sendMessage();
  // Your messaging logic
}
```

### Custom Events

For custom tracking needs, use the `trackEvent` function:

```typescript
import { trackEvent } from '@/lib/utils/analytics';

// Basic event
trackEvent('video_play');

// Event with parameters
trackEvent('purchase', {
  transaction_id: 'T12345',
  value: 29.99,
  currency: 'USD',
  items: ['premium_membership']
});

// Event with custom parameters
trackEvent('feature_used', {
  feature_name: 'advanced_search',
  user_type: 'premium',
  search_filters: 5
});
```

### Event Parameters

Common GA4 event parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `number` | Numeric value (e.g., price) |
| `currency` | `string` | Currency code (e.g., 'USD') |
| `transaction_id` | `string` | Unique transaction ID |
| `category` | `string` | Event category |
| `label` | `string` | Event label |
| `user_id` | `string` | User identifier |

### Example: Track Search

```typescript
import { trackEvent } from '@/lib/utils/analytics';

function handleSearch(query: string, filters: any) {
  trackEvent('search', {
    search_term: query,
    filter_count: Object.keys(filters).length,
    has_location: !!filters.location,
    has_age_range: !!filters.ageRange
  });
}
```

### Example: Track Engagement

```typescript
import { trackEvent } from '@/lib/utils/analytics';

function trackEngagement(action: string) {
  trackEvent('engagement', {
    engagement_type: action,
    page_path: window.location.pathname,
    timestamp: Date.now()
  });
}

// Usage
trackEngagement('scroll_to_bottom');
trackEngagement('video_watched');
trackEngagement('image_gallery_opened');
```

### In Astro Components

```astro
---
// No imports needed in frontmatter
---

<button 
  onclick="window.gtag && window.gtag('event', 'button_click', { button_id: 'cta-hero' })"
>
  Get Started
</button>
```

### In Svelte Components

```svelte
<script lang="ts">
  import { analytics } from '@/lib/utils/analytics';
  
  function handleClick() {
    analytics.clickButton('profile-edit', 'Edit Profile');
    // Your logic
  }
</script>

<button onclick={handleClick}>
  Edit Profile
</button>
```

---

## Configuration

### Centralized Configuration

All analytics and ad settings are in `src/config.ts`:

```typescript
export const ANALYTICS_CONFIG = {
    ga4: {
        measurementId: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || '',
        enabled: import.meta.env.PUBLIC_GA4_ENABLED !== 'false',
    },
    
    adsense: {
        publisherId: import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || '',
        enabled: import.meta.env.PUBLIC_ADSENSE_ENABLED !== 'false',
    },
    
    routes: {
        adEnabledPages: [ /* ... */ ],
        adExcludedPages: [ /* ... */ ],
        analyticsExcludedPages: [ /* ... */ ],
    },
};
```

### Adding New Pages to Tracking

**Enable ads on a new page:**

```typescript
// src/config.ts
routes: {
    adEnabledPages: [
        '/',
        '/blog',
        '/your-new-page',  // Add here
    ],
}
```

**Exclude a page from analytics:**

```typescript
// src/config.ts
routes: {
    analyticsExcludedPages: [
        '/app/admin',
        '/your-private-page',  // Add here
    ],
}
```

### Disabling Analytics or Ads

**Disable globally in .env:**

```env
# Disable analytics
PUBLIC_GA4_ENABLED=false

# Disable ads
PUBLIC_ADSENSE_ENABLED=false
```

**Disable programmatically:**

```typescript
// src/config.ts
export const ANALYTICS_CONFIG = {
    ga4: {
        measurementId: '...',
        enabled: false,  // Disable here
    },
};
```

---

## Privacy & Consent

### Consent Banner

The platform includes a consent banner (`ConsentBanner.svelte`) that:

- ✅ Appears on first visit
- ✅ Stores user preference in local storage
- ✅ Allows accept, decline, or learn more
- ✅ Reloads page after consent to initialize analytics
- ✅ Supports RTL layout for Arabic

**User Actions:**
- **Accept**: Enables analytics and ads, stores `analytics-consent=true`
- **Decline**: Disables tracking, stores `analytics-consent=false`
- **Learn More**: Links to privacy policy

### Privacy Compliance

**GDPR Compliance:**
- User consent required before tracking
- Clear privacy policy link
- Easy opt-out mechanism
- Data minimization (only essential events tracked)

**Route-Based Privacy:**
- Admin pages excluded from tracking
- Login/signup pages excluded
- Profile pages excluded
- Dashboard excluded

### Managing Consent

**Check consent status:**

```typescript
const consent = localStorage.getItem('analytics-consent');
if (consent === 'true') {
  // User has consented
}
```

**Clear consent (for testing):**

```javascript
localStorage.removeItem('analytics-consent');
location.reload();
```

---

## Troubleshooting

### Analytics Not Working

**Check 1: Verify Measurement ID**
```bash
# Check .env file
cat .env | grep GA4_MEASUREMENT_ID
```

**Check 2: Verify Script Loading**
- Open DevTools > Network tab
- Filter by "gtag"
- Should see requests to `googletagmanager.com`

**Check 3: Check Console for Errors**
- Open DevTools > Console
- Look for errors related to gtag or analytics

**Check 4: Verify Page is Not Excluded**
```typescript
// Check if current page is excluded
import { isAnalyticsEnabledPage } from '@/lib/utils/analytics';
console.log(isAnalyticsEnabledPage(window.location.pathname));
```

**Check 5: Verify Consent**
```javascript
// Check consent status
console.log(localStorage.getItem('analytics-consent'));
```

### Ads Not Displaying

**Check 1: Verify Publisher ID**
```bash
# Check .env file
cat .env | grep ADSENSE_PUBLISHER_ID
```

**Check 2: Verify Script Loading**
- Open DevTools > Network tab
- Filter by "adsbygoogle"
- Should see requests to `googlesyndication.com`

**Check 3: Check for Ad Blockers**
- Disable browser ad blockers
- Test in incognito mode
- Ads may be blocked by browser extensions

**Check 4: Verify Page is Ad-Enabled**
```typescript
// Check if current page allows ads
import { isAdEnabledPage } from '@/lib/utils/ads';
console.log(isAdEnabledPage(window.location.pathname));
```

**Check 5: Wait for AdSense Approval**
- New sites may take 1-2 weeks for approval
- Ads won't display until approved
- Check AdSense dashboard for approval status

**Check 6: Verify Ad Slot IDs**
- Ensure ad slot IDs are correct (10-digit numbers)
- Check AdSense dashboard for correct slot IDs
- Each ad unit needs a unique slot ID

### Events Not Tracking

**Check 1: Verify gtag is Available**
```javascript
console.log(typeof window.gtag); // Should be 'function'
```

**Check 2: Test Event Manually**
```javascript
// In browser console
window.gtag('event', 'test_event', { test: true });
```

**Check 3: Check GA4 Real-Time Reports**
- Go to GA4 > Reports > Realtime
- Events should appear within seconds
- If not, check measurement ID

**Check 4: Verify Event Parameters**
```typescript
// Parameters must be strings, numbers, or booleans
trackEvent('test', {
  valid_string: 'hello',
  valid_number: 123,
  valid_boolean: true,
  // invalid_object: { nested: 'object' }, // ❌ Won't work
});
```

### Performance Issues

**Check 1: Verify Async Loading**
- All scripts should have `async` attribute
- Check `GoogleAnalytics.astro` and `AdSenseScript.astro`

**Check 2: Use Resource Hints**
```astro
<!-- In Layout.astro <head> -->
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://pagead2.googlesyndication.com">
```

**Check 3: Lazy Load Below-the-Fold Ads**
```astro
<!-- Only load ads when visible -->
<div class="ad-container" data-lazy-ad>
  <AdUnit slot="1234567890" />
</div>
```

### Common Errors

**Error: "gtag is not defined"**
- Analytics script hasn't loaded yet
- Check if page is excluded from analytics
- Verify measurement ID is set

**Error: "adsbygoogle.push is not a function"**
- AdSense script hasn't loaded yet
- Check if page is excluded from ads
- Verify publisher ID is set

**Error: "Ad slot not found"**
- Invalid ad slot ID
- Check AdSense dashboard for correct slot IDs
- Ensure slot ID is a 10-digit number

---

## Additional Resources

### Official Documentation

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Tracking Guide](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Google AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Ad Formats](https://support.google.com/adsense/answer/9183460)

### Tools

- [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
- [Google Tag Assistant](https://tagassistant.google.com/)
- [AdSense Publisher Toolbar](https://chrome.google.com/webstore/detail/google-publisher-toolbar/omioeahgfecgfpfldejlnideemfidekc)

### Support

For issues or questions:
- Check this guide first
- Review official documentation
- Contact support@babhijra.com

---

**Last Updated**: November 22, 2025  
**Version**: 1.0.0
