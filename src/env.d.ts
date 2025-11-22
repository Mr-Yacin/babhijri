/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_FIREBASE_API_KEY: string;
    readonly PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    readonly PUBLIC_FIREBASE_PROJECT_ID: string;
    readonly PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly PUBLIC_FIREBASE_APP_ID: string;
    readonly PUBLIC_GA4_MEASUREMENT_ID: string;
    readonly PUBLIC_GA4_ENABLED: string;
    readonly PUBLIC_ADSENSE_PUBLISHER_ID: string;
    readonly PUBLIC_ADSENSE_ENABLED: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Window interface extensions for analytics and ads
interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    adsbygoogle: any[];
}
