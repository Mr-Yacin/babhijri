import { ANALYTICS_CONFIG } from '../../config';

/**
 * Check if ads should be enabled for the current page
 * @param pathname - The current page pathname
 * @returns true if ads should display, false otherwise
 */
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

/**
 * Initialize AdSense ads on the page
 * This should be called after the AdSense script has loaded
 */
export function initializeAds(): void {
    if (typeof window === 'undefined') {
        return;
    }
    
    // AdSense auto ads initialization
    (window.adsbygoogle = window.adsbygoogle || []).push({});
}
