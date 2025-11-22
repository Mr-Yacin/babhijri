export const SITE_CONFIG = {
    name: 'BabHijra',
    nameArabic: 'باب الهجرة',
    domain: 'babhijra.com',
    url: 'https://babhijra.com',
    description: 'Immigration and Dating for the Arabic Community',
    descriptionArabic: 'منصة الهجرة والتعارف للمجتمع العربي',

    // Email Configuration
    email: {
        info: 'info@babhijra.com',      // Main contact email
        support: 'support@babhijra.com', // Technical support
        privacy: 'privacy@babhijra.com', // Privacy inquiries
        noreply: 'noreply@babhijra.com'  // No-reply emails
    },

    // Social Media (update with your actual links)
    social: {
        facebook: 'https://www.facebook.com/babhijra',
        twitter: 'https://x.com/babhijra',
        instagram: 'https://www.instagram.com/babhijra'
    },

    // Localization
    defaultLang: 'ar',
    dir: 'rtl',
};

export const NAV_LINKS = [
    { name: 'Home', href: '/', translation: 'الرئيسية' },
    { name: 'Blog', href: '/blog', translation: 'المدونة' },
    { name: 'Dating', href: '/app', translation: 'تعارف' },
];

/**
 * Analytics and Advertising Configuration
 * 
 * This configuration manages Google Analytics 4 (GA4) tracking and Google AdSense
 * ad placements across the site. Both features are optional and can be disabled
 * by setting the respective ENABLED environment variable to 'false'.
 * 
 * Privacy Considerations:
 * - Analytics and ads are excluded from sensitive pages (admin, login, profile)
 * - A consent banner is displayed on first visit
 * - User preferences are stored in local storage
 * - All tracking respects user consent choices
 */
export const ANALYTICS_CONFIG = {
    /**
     * Google Analytics 4 Configuration
     * 
     * Setup:
     * 1. Create a GA4 property at https://analytics.google.com/
     * 2. Get your Measurement ID (format: G-XXXXXXXXXX)
     * 3. Add to .env: PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
     * 
     * Features:
     * - Automatic page view tracking
     * - Custom event tracking via analytics utility functions
     * - Route-based filtering (excludes sensitive pages)
     * - Privacy-compliant with consent management
     */
    ga4: {
        // GA4 Measurement ID from environment variables
        // Format: G-XXXXXXXXXX
        measurementId: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || '',
        
        // Enable/disable analytics globally
        // Set PUBLIC_GA4_ENABLED=false in .env to disable
        enabled: import.meta.env.PUBLIC_GA4_ENABLED !== 'false',
    },
    
    /**
     * Google AdSense Configuration
     * 
     * Setup:
     * 1. Create an AdSense account at https://www.google.com/adsense/
     * 2. Get approved and obtain your Publisher ID
     * 3. Add to .env: PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
     * 4. Create ad units in AdSense dashboard
     * 5. Use ad slot IDs in AdUnit components
     * 
     * Features:
     * - Responsive ad units that adapt to screen sizes
     * - Professional in-content ad styling for blog posts
     * - Automatic ad container collapse when ads fail to load
     * - Route-based filtering (excludes sensitive pages)
     */
    adsense: {
        // AdSense Publisher ID from environment variables
        // Format: ca-pub-XXXXXXXXXXXXXXXX
        publisherId: import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || '',
        
        // Enable/disable ads globally
        // Set PUBLIC_ADSENSE_ENABLED=false in .env to disable
        enabled: import.meta.env.PUBLIC_ADSENSE_ENABLED !== 'false',
        
        /**
         * Ad Slot IDs
         * 
         * Replace these placeholder values with real slot IDs from your AdSense dashboard.
         * To get slot IDs:
         * 1. Go to AdSense → Ads → By ad unit
         * 2. Create ad units for each placement
         * 3. Copy the slot ID (10-digit number) for each ad unit
         * 
         * Ad Unit Types to Create:
         * - Display ads: homepage, sidebar, mobile sticky
         * - In-article ads: blog content ads
         */
        slots: {
            // Homepage ad placements
            homepageTop: '1964007296',      // Replace with real slot ID
            homepageFooter: '7664601128',   // Replace with real slot ID
            
            // Blog post ad placements (create as In-article ad units)
            blogTop: '1964007296',          // Replace with real slot ID
            blogMiddle: '1772435607',       // Replace with real slot ID
            blogBottom: '1964007296',       // Replace with real slot ID
            
            // App page ad placements
            appSidebar: '8529399737',       // Replace with real slot ID
            appMobileSticky: '7124818724',  // Replace with real slot ID
            
            // Messages page ad placement
            messagesTop: '5811737056',      // Replace with real slot ID
        },
    },
    
    /**
     * Page Routing Rules
     * 
     * These arrays control which pages display ads and analytics.
     * Modify these arrays to customize tracking and ad behavior.
     * 
     * Best Practices:
     * - Exclude admin and authentication pages for privacy
     * - Exclude profile and dashboard pages for user experience
     * - Include public content pages (homepage, blog) for revenue
     * - Maintain 3:1 content-to-ad ratio on ad-enabled pages
     */
    routes: {
        /**
         * Ad-Enabled Pages
         * 
         * Pages where Google AdSense ads will be displayed.
         * Blog post routes are matched with startsWith('/blog') logic.
         * 
         * To add a new page:
         * 1. Add the route path to this array
         * 2. Place AdUnit or InContentAd components in the page
         * 3. Ensure proper ad density (3:1 content-to-ad ratio)
         */
        adEnabledPages: [
            '/',                // Homepage
            '/blog',            // Blog listing page
            '/blog/',           // Blog listing page (trailing slash)
            '/app',             // App landing page
            '/app/',            // App landing page (trailing slash)
            '/app/messages',    // Messages page
        ],
        
        /**
         * Ad-Excluded Pages
         * 
         * Pages where ads should NOT be displayed for privacy,
         * user experience, or legal reasons.
         * 
         * These pages are checked first before adEnabledPages.
         * If a route starts with any path in this array, ads won't load.
         */
        adExcludedPages: [
            '/app/admin',       // Admin panel (privacy)
            '/app/profile',     // User profiles (privacy)
            '/app/dashboard',   // User dashboard (privacy)
            '/app/login',       // Login page (user experience)
            '/app/signup',      // Signup page (user experience)
            '/app/settings',    // Settings page (user experience)
            '/contact',         // Contact page (professional)
            '/help',            // Help page (professional)
            '/privacy',         // Privacy policy (legal)
            '/terms',           // Terms of service (legal)
        ],
        
        /**
         * Analytics-Excluded Pages
         * 
         * Pages where Google Analytics should NOT track user behavior.
         * Typically includes sensitive pages for privacy compliance.
         * 
         * All other pages will have analytics enabled by default.
         * Analytics respects user consent from the consent banner.
         */
        analyticsExcludedPages: [
            '/app/admin',       // Admin panel (privacy)
            '/app/profile',     // User profiles (privacy)
            '/app/dashboard',   // User dashboard (privacy)
            '/app/login',       // Login page (privacy)
            '/app/signup',      // Signup page (privacy)
        ],
    },
};
