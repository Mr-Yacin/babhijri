# Implementation Plan

- [x] 1. Set up configuration and environment variables





  - Extend `src/config.ts` with `ANALYTICS_CONFIG` object containing GA4 and AdSense settings
  - Add route configuration for ad-enabled and analytics-enabled pages
  - Create `.env.example` with placeholder values for GA4 and AdSense IDs
  - Update TypeScript declarations in `src/env.d.ts` for Window interface and environment variables
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2. Create utility functions for analytics and ads





  - Create `src/lib/utils/analytics.ts` with route detection and event tracking functions
  - Implement `isAnalyticsEnabledPage()` function to check if analytics should load
  - Implement `trackEvent()` and `trackPageView()` functions for GA4
  - Create helper functions for common events (clickButton, submitForm, viewProfile, sendMessage)
  - Create `src/lib/utils/ads.ts` with `isAdEnabledPage()` function for route-based ad filtering
  - _Requirements: 1.4, 2.1, 2.4, 2.5, 5.4_

- [x] 3. Build Google Analytics components





  - Create `src/components/analytics/GoogleAnalytics.astro` component
  - Implement conditional loading based on route and configuration
  - Add GA4 script tags with measurement ID from config
  - Initialize gtag with page view tracking
  - Ensure async loading to prevent blocking page render
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 4. Build Google AdSense components





  - Create `src/components/ads/AdSenseScript.astro` for loading AdSense script
  - Implement conditional loading based on route and configuration
  - Create `src/components/ads/AdUnit.astro` as reusable ad unit component
  - Add support for different ad formats (auto, fluid, rectangle, vertical, horizontal)
  - Add support for different ad styles (display, in-article, in-feed)
  - Implement responsive ad sizing with proper data attributes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 5. Create specialized ad components





  - Create `src/components/ads/InContentAd.astro` for blog post ads
  - Add professional styling with ad label and visual separation
  - Implement position variants (top, middle, bottom)
  - Add responsive design for mobile and desktop
  - Style ad containers to collapse gracefully when ads fail to load
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Build consent management component





  - Create `src/components/analytics/ConsentBanner.svelte` for privacy consent
  - Implement local storage for consent preferences
  - Add accept, decline, and learn more actions
  - Style banner with professional design and RTL support
  - Add logic to reload page after consent to initialize analytics
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Integrate analytics and ads into main layout





  - Update `src/layouts/Layout.astro` to include GoogleAnalytics component
  - Add AdSenseScript component to Layout.astro
  - Add ConsentBanner component to Layout.astro
  - Add resource hints (preconnect) for Google domains for performance
  - Verify AdminLayout.astro remains unchanged (no tracking)
  - _Requirements: 1.1, 1.2, 3.1, 3.2_

- [x] 8. Add ad placements to homepage





  - Open `src/pages/index.astro` and identify placement locations
  - Add AdUnit component below hero section
  - Add AdUnit component in footer area
  - Ensure ads are visually separated from content
  - Test responsive behavior on mobile
  - _Requirements: 3.5, 4.1, 4.2, 4.4_

- [x] 9. Add ad placements to blog pages





  - Open `src/pages/blog/[...slug].astro` for blog post template
  - Add InContentAd component after first paragraph
  - Add InContentAd component in middle of content
  - Add InContentAd component at end of post
  - Ensure proper spacing and content-to-ad ratio
  - _Requirements: 3.5, 4.1, 4.2, 4.4, 4.5_

- [x] 10. Add ad placements to app pages





  - Add ad unit to `src/pages/app/index.astro`
  - Add ad unit to `src/pages/app/messages.astro`
  - Implement sidebar ad for desktop and bottom sticky for mobile
  - Ensure ads don't interfere with app functionality
  - _Requirements: 3.5, 4.1, 4.2, 4.3_

- [x] 11. Add event tracking to interactive elements





  - Identify key user interactions (CTA buttons, form submissions)
  - Add event tracking calls using analytics utility functions
  - Track button clicks on homepage CTA
  - Track form submissions on contact page
  - Track profile views and message sends in app
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 12. Verify route-based filtering





  - Test that analytics loads on allowed pages (homepage, blog, app/index, messages)
  - Test that analytics does NOT load on excluded pages (admin, profile, dashboard, login, signup)
  - Test that ads display on ad-enabled pages only
  - Test that ads do NOT display on ad-excluded pages
  - Verify blog post routes are correctly identified
  - _Requirements: 1.1, 1.2, 3.1, 3.2_

- [x] 13. Test responsive ad behavior





  - Test ad display on mobile devices (320px, 375px, 414px widths)
  - Test ad display on tablet devices (768px, 1024px widths)
  - Test ad display on desktop (1280px, 1920px widths)
  - Verify ads don't cause layout shifts or overflow
  - Test ad container collapse when ads are blocked
  - _Requirements: 3.3, 4.2, 4.3_

- [x] 14. Update documentation





  - Add setup instructions to README.md for environment variables
  - Document how to add new ad placements using components
  - Document how to track custom events using analytics utilities
  - Add comments to configuration explaining each option
  - Create example `.env` file with all required variables
  - _Requirements: 5.5_
