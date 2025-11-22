import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

// Lazy initialization - only initialize when actually used
let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;

function initializeFirebase() {
    // Only initialize in browser
    if (!isBrowser) {
        console.warn('Firebase initialization skipped - not in browser context');
        return;
    }
    
    if (!_app) {
        _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        _auth = getAuth(_app);
        _db = getFirestore(_app);
        _storage = getStorage(_app);
    }
}

// Initialize on first import in browser
if (isBrowser) {
    initializeFirebase();
}

// Export getter functions that ensure initialization
export function getFirebaseApp(): FirebaseApp | null {
    if (!isBrowser) return null;
    if (!_app) initializeFirebase();
    return _app || null;
}

export function getFirebaseAuth(): Auth | null {
    if (!isBrowser) return null;
    if (!_auth) initializeFirebase();
    return _auth || null;
}

export function getFirebaseDb(): Firestore | null {
    if (!isBrowser) return null;
    if (!_db) initializeFirebase();
    return _db || null;
}

export function getFirebaseStorage(): FirebaseStorage | null {
    if (!isBrowser) return null;
    if (!_storage) initializeFirebase();
    return _storage || null;
}

// Safe exports that won't break SSR
export const app = isBrowser ? _app : null;
export const auth = isBrowser ? _auth : null;
export const db = isBrowser ? _db : null;
export const storage = isBrowser ? _storage : null;
