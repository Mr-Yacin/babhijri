import { ANALYTICS_CONFIG } from '../../config';

interface EventParams {
    [key: string]: string | number | boolean;
}

/**
 * Check if analytics should be enabled for the current page
 * @param pathname - The current page pathname
 * @returns true if analytics should load, false otherwise
 */
export function isAnalyticsEnabledPage(pathname: string): boolean {
    // Check if page is in excluded list
    const excluded = ANALYTICS_CONFIG.routes.analyticsExcludedPages;
    return !excluded.some(path => pathname.startsWith(path));
}

/**
 * Track a custom event in Google Analytics
 * @param eventName - Name of the event to track
 * @param params - Optional event parameters
 */
export function trackEvent(eventName: string, params?: EventParams): void {
    if (typeof window === 'undefined' || !window.gtag) {
        return;
    }
    
    window.gtag('event', eventName, params);
}

/**
 * Track a page view in Google Analytics
 * @param url - The page URL to track
 */
export function trackPageView(url: string): void {
    if (typeof window === 'undefined' || !window.gtag) {
        return;
    }
    
    window.gtag('config', ANALYTICS_CONFIG.ga4.measurementId, {
        page_path: url,
    });
}

/**
 * Common event tracking helpers
 */
export const analytics = {
    /**
     * Track button click events
     * @param buttonId - Unique identifier for the button
     * @param buttonText - Text displayed on the button
     */
    clickButton: (buttonId: string, buttonText: string) => {
        trackEvent('button_click', {
            button_id: buttonId,
            button_text: buttonText,
        });
    },
    
    /**
     * Track form submission events
     * @param formType - Type of form being submitted (e.g., 'contact', 'signup')
     */
    submitForm: (formType: string) => {
        trackEvent('form_submit', {
            form_type: formType,
        });
    },
    
    /**
     * Track profile view events
     * @param profileId - ID of the profile being viewed
     */
    viewProfile: (profileId: string) => {
        trackEvent('profile_view', {
            profile_id: profileId,
        });
    },
    
    /**
     * Track message sent events
     */
    sendMessage: () => {
        trackEvent('message_sent');
    },
};
