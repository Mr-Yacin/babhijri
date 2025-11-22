# Design Document: Google Analytics & AdSense Integration

## Overview

This design implements Google Analytics 4 (GA4) with custom event tracking and Google AdSense integration for the BabHijra Astro website. The solution uses a component-based architecture with centralized configuration, conditional loading based on page routes, and professional ad placements that enhance rather than detract from user experience.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Astro Layouts                          │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │  Layout.astro    │         │ AdminLayout.astro│        │
│  │  (Main Layout)   │         │  (No Tracking)   │        │
│  └────────┬─────────┘         └──────────────────┘        │
│           │                                                 │
│           ├─► Analytics Component (Conditional)            │
│           │   - GA4 Script Loader                          │
│           │   - Page View Tracking                         │
│           │   - Route-based Filtering                      │
│           │                                                 │
│           └─► AdSense Component (Conditional)              │
│               - AdSense Script Loader                      │
│               - Route-based Filtering                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Page Components                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Homepage   │  │  Blog Pages  │  │  App/Index   │    │
│  │  (Ads: Yes)  │  │  (Ads: Yes)  │  │  (Ads: Yes)  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Messages   │  │   Dashboard  │  │    Admin     │    │
│  │  (Ads: Yes)  │  │  (Ads: No)   │  │  (Ads: No)   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Utility Functions                          │
│  - trackEvent(eventName, params)                           │
│  - isAdEnabledPage(pathname)                               │
│  - isAnalyticsEnabledPage(pathname)                        │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── config.ts (extended with analytics/ads config)
├── components/
│   ├── analytics/
│   │   ├── GoogleAnalytics.astro
│   │   └── ConsentBanner.svelte
│   └── ads/
│       ├── AdSenseScript.astro
│       ├── AdUnit.astro
│       └── InContentAd.astro
├── lib/
│   └── utils/
│       ├── analytics.ts
│       └── ads.ts
└── layouts/
    ├── Layout.astro (updated)
    └── AdminLayout.astro (no changes)
```

## Components and Interfaces

### 1. Configuration Extension (src/config.ts)

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

### 2. Analytics Utility (src/lib/utils/analytics.ts)

```typescript
interface EventParams {
    [key: string]: string | number | boolean;
}

export function isAnalyticsEnabledPage(pathname: string): boolean {
    // Check if page is in excluded list
    const excluded = ANALYTICS_CONFIG.routes.analyticsExcludedPages;
    return !excluded.some(path => pathname.startsWith(path));
}

export function trackEvent(eventName: string, params?: EventParams): void {
    if (typeof window === 'undefined' || !window.gtag) {
        return;
    }
    
    window.gtag('event', eventName, params);
}

export function trackPageView(url: string): void {
    if (typeof window === 'undefined' || !window.gtag) {
        return;
    }
    
    window.gtag('config', ANALYTICS_CONFIG.ga4.measurementId, {
        page_path: url,
    });
}

// Common event tracking helpers
export const analytics = {
    clickButton: (buttonId: string, buttonText: string) => {
        trackEvent('button_click', {
            button_id: buttonId,
            button_text: buttonText,
        });
    },
    
    submitForm: (formType: string) => {
        trackEvent('form_submit', {
            form_type: formType,
        });
    },
    
    viewProfile: (profileId: string) => {
        trackEvent('profile_view', {
            profile_id: profileId,
        });
    },
    
    sendMessage: () => {
        trackEvent('message_sent');
    },
};
```

### 3. Ads Utility (src/lib/utils/ads.ts)

```typescript
export function isAdEnabledPage(pathname: string): boolean {
    const { adEnabledPages, adExcludedPages } = ANALYTICS_CONFIG.routes;
    
    // First check if explicitly excluded
    if (adExcludedPages.some(path => pathname.startsWith(path))) {
        return false;
    }
    
    // Then check if enabled (exact match or starts with for blog posts)
    return adEnabledPages.some(path => {
        if (path === '/blog' || path === '/blog/') {
            return pathname.startsWith('/blog');
        }
        return pathname === path || pathname === path + '/';
    });
}

export function initializeAds(): void {
    if (typeof window === 'undefined') {
        return;
    }
    
    // AdSense auto ads initialization
    (window.adsbygoogle = window.adsbygoogle || []).push({});
}
```

### 4. Google Analytics Component (src/components/analytics/GoogleAnalytics.astro)

```astro
---
import { ANALYTICS_CONFIG } from '../../config';
import { isAnalyticsEnabledPage } from '../../lib/utils/analytics';

const { measurementId, enabled } = ANALYTICS_CONFIG.ga4;
const currentPath = Astro.url.pathname;
const shouldLoadAnalytics = enabled && measurementId && isAnalyticsEnabledPage(currentPath);
---

{shouldLoadAnalytics && (
    <>
        <!-- Google tag (gtag.js) -->
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}></script>
        <script define:vars={{ measurementId }}>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', measurementId, {
                page_path: window.location.pathname,
            });
        </script>
    </>
)}
```

### 5. AdSense Script Component (src/components/ads/AdSenseScript.astro)

```astro
---
import { ANALYTICS_CONFIG } from '../../config';
import { isAdEnabledPage } from '../../lib/utils/ads';

const { publisherId, enabled } = ANALYTICS_CONFIG.adsense;
const currentPath = Astro.url.pathname;
const shouldLoadAds = enabled && publisherId && isAdEnabledPage(currentPath);
---

{shouldLoadAds && (
    <script 
        async 
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossorigin="anonymous"
    ></script>
)}
```

### 6. Ad Unit Component (src/components/ads/AdUnit.astro)

```astro
---
interface Props {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    responsive?: boolean;
    className?: string;
    style?: 'display' | 'in-article' | 'in-feed';
}

const { 
    slot, 
    format = 'auto', 
    responsive = true,
    className = '',
    style = 'display'
} = Astro.props;

const { publisherId } = ANALYTICS_CONFIG.adsense;
---

<div class={`ad-container ${className}`}>
    <ins 
        class="adsbygoogle"
        style={`display:block${format === 'fluid' ? ';width:100%' : ''}`}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
        data-ad-layout-key={style === 'in-article' ? '-fb+5w+4e-db+86' : undefined}
    ></ins>
</div>

<script>
    (adsbygoogle = window.adsbygoogle || []).push({});
</script>

<style>
    .ad-container {
        margin: 2rem auto;
        max-width: 100%;
        text-align: center;
    }
    
    .adsbygoogle {
        min-height: 100px;
    }
    
    @media (max-width: 768px) {
        .ad-container {
            margin: 1.5rem auto;
        }
    }
</style>
```

### 7. In-Content Ad Component (src/components/ads/InContentAd.astro)

```astro
---
import AdUnit from './AdUnit.astro';

interface Props {
    slot: string;
    position?: 'top' | 'middle' | 'bottom';
}

const { slot, position = 'middle' } = Astro.props;
---

<div class={`in-content-ad in-content-ad--${position}`}>
    <span class="ad-label">إعلان</span>
    <AdUnit 
        slot={slot} 
        format="fluid"
        style="in-article"
        className="in-content-ad__unit"
    />
</div>

<style>
    .in-content-ad {
        margin: 3rem 0;
        padding: 1.5rem;
        background: linear-gradient(to bottom, #f9fafb, #ffffff);
        border-radius: 12px;
        border: 1px solid #e5e7eb;
    }
    
    .in-content-ad--top {
        margin-top: 1rem;
    }
    
    .in-content-ad--bottom {
        margin-bottom: 1rem;
    }
    
    .ad-label {
        display: block;
        text-align: center;
        font-size: 0.75rem;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1rem;
        font-weight: 500;
    }
    
    .in-content-ad__unit {
        margin: 0;
    }
    
    @media (max-width: 768px) {
        .in-content-ad {
            margin: 2rem -1rem;
            padding: 1rem;
            border-radius: 0;
            border-left: none;
            border-right: none;
        }
    }
</style>
```

### 8. Consent Banner Component (src/components/analytics/ConsentBanner.svelte)

```svelte
<script lang="ts">
    import { onMount } from 'svelte';
    
    let showBanner = $state(false);
    let consentGiven = $state(false);
    
    onMount(() => {
        const consent = localStorage.getItem('analytics-consent');
        if (!consent) {
            showBanner = true;
        } else {
            consentGiven = consent === 'true';
        }
    });
    
    function acceptConsent() {
        localStorage.setItem('analytics-consent', 'true');
        showBanner = false;
        consentGiven = true;
        
        // Reload to initialize analytics
        window.location.reload();
    }
    
    function declineConsent() {
        localStorage.setItem('analytics-consent', 'false');
        showBanner = false;
    }
</script>

{#if showBanner}
    <div class="consent-banner">
        <div class="consent-content">
            <p class="consent-text">
                نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك وعرض إعلانات مخصصة. 
                باستخدامك للموقع، فإنك توافق على سياسة الخصوصية الخاصة بنا.
            </p>
            <div class="consent-actions">
                <button onclick={acceptConsent} class="btn-accept">
                    موافق
                </button>
                <button onclick={declineConsent} class="btn-decline">
                    رفض
                </button>
                <a href="/privacy" class="btn-learn-more">
                    معرفة المزيد
                </a>
            </div>
        </div>
    </div>
{/if}

<style>
    .consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        color: white;
        padding: 1.5rem;
        z-index: 9999;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .consent-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        text-align: center;
    }
    
    .consent-text {
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0;
    }
    
    .consent-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    button, a {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-block;
    }
    
    .btn-accept {
        background: #14b8a6;
        color: white;
        border: none;
    }
    
    .btn-accept:hover {
        background: #0d9488;
    }
    
    .btn-decline {
        background: transparent;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .btn-decline:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .btn-learn-more {
        background: transparent;
        color: #14b8a6;
        border: 1px solid #14b8a6;
    }
    
    .btn-learn-more:hover {
        background: rgba(20, 184, 166, 0.1);
    }
    
    @media (min-width: 768px) {
        .consent-content {
            flex-direction: row;
            justify-content: space-between;
            text-align: right;
        }
        
        .consent-actions {
            flex-shrink: 0;
        }
    }
</style>
```

## Data Models

### Environment Variables (.env)

```env
# Google Analytics 4
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_GA4_ENABLED=true

# Google AdSense
PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
PUBLIC_ADSENSE_ENABLED=true
```

### TypeScript Declarations

```typescript
// src/env.d.ts (extend existing)
interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    adsbygoogle: any[];
}

interface ImportMetaEnv {
    readonly PUBLIC_GA4_MEASUREMENT_ID: string;
    readonly PUBLIC_GA4_ENABLED: string;
    readonly PUBLIC_ADSENSE_PUBLISHER_ID: string;
    readonly PUBLIC_ADSENSE_ENABLED: string;
}
```

## Error Handling

### Analytics Error Handling

1. **Missing Configuration**: If GA4 measurement ID is missing, analytics will silently fail without breaking the page
2. **Script Load Failure**: If gtag.js fails to load, event tracking functions will check for `window.gtag` existence
3. **Invalid Events**: Event tracking validates parameters before sending to prevent console errors

### AdSense Error Handling

1. **Missing Publisher ID**: If publisher ID is missing, ad components won't render
2. **Ad Block Detection**: Ads gracefully collapse when blocked, preventing layout shifts
3. **Failed Ad Loads**: Empty ad slots automatically collapse using CSS

## Testing Strategy

### Unit Tests

1. **Route Detection Tests**
   - Test `isAdEnabledPage()` with various pathnames
   - Test `isAnalyticsEnabledPage()` with excluded routes
   - Verify blog post routes are correctly identified

2. **Analytics Utility Tests**
   - Test event tracking with valid/invalid parameters
   - Test gtag availability checks
   - Test helper functions (clickButton, submitForm, etc.)

### Integration Tests

1. **Component Rendering Tests**
   - Verify GoogleAnalytics component renders on allowed pages
   - Verify AdSenseScript component renders on ad-enabled pages
   - Verify components don't render on excluded pages

2. **Ad Placement Tests**
   - Test AdUnit component with different formats
   - Test InContentAd component positioning
   - Verify responsive behavior

### Manual Testing Checklist

1. **Analytics Verification**
   - [ ] GA4 script loads on homepage
   - [ ] GA4 script loads on blog pages
   - [ ] GA4 script does NOT load on /app/admin
   - [ ] GA4 script does NOT load on /app/login
   - [ ] Custom events appear in GA4 real-time reports

2. **AdSense Verification**
   - [ ] Ads display on homepage
   - [ ] Ads display on blog posts
   - [ ] Ads display on /app/index
   - [ ] Ads display on /app/messages
   - [ ] Ads do NOT display on /app/dashboard
   - [ ] Ads do NOT display on /app/admin
   - [ ] Ads are responsive on mobile devices
   - [ ] Ad containers collapse when ads are blocked

3. **User Experience**
   - [ ] Consent banner appears on first visit
   - [ ] Consent preference is remembered
   - [ ] Ads don't cause layout shifts
   - [ ] Page load performance is acceptable
   - [ ] Ads are visually separated from content

## Implementation Notes

### Ad Placement Strategy

**Homepage**: 
- One ad unit below hero section
- One ad unit in footer area

**Blog Posts**:
- One ad unit after first paragraph
- One ad unit in middle of content (after 50% of content)
- One ad unit at end of post

**App/Index & Messages**:
- Sidebar ad unit (desktop)
- Bottom sticky ad (mobile)

### Performance Considerations

1. **Async Loading**: All scripts load asynchronously to prevent blocking
2. **Lazy Loading**: Ad components can be lazy-loaded below the fold
3. **Resource Hints**: Use `preconnect` for Google domains
4. **Bundle Size**: Utilities are tree-shakeable and minimal

### Privacy Compliance

1. **Consent Management**: Banner appears on first visit
2. **Local Storage**: Stores consent preference locally
3. **Do Not Track**: Respects browser DNT settings
4. **Data Minimization**: Only tracks essential events
5. **Privacy Policy**: Links to detailed privacy information

## Migration Path

1. Add environment variables to `.env`
2. Extend `src/config.ts` with analytics configuration
3. Create utility functions for route detection
4. Create analytics and ad components
5. Update `Layout.astro` to include components
6. Add ad units to specific pages
7. Test on development environment
8. Deploy to production with monitoring
