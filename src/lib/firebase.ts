import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

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
    // Skip initialization during SSR/build
    if (typeof window === 'undefined') {
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
if (typeof window !== 'undefined') {
    initializeFirebase();
}

// Export getter functions that ensure initialization
export function getFirebaseApp(): FirebaseApp {
    if (!_app) initializeFirebase();
    if (!_app) throw new Error('Firebase not initialized - running in SSR context');
    return _app;
}

export function getFirebaseAuth(): Auth {
    if (!_auth) initializeFirebase();
    if (!_auth) throw new Error('Firebase Auth not initialized - running in SSR context');
    return _auth;
}

export function getFirebaseDb(): Firestore {
    if (!_db) initializeFirebase();
    if (!_db) throw new Error('Firebase Firestore not initialized - running in SSR context');
    return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
    if (!_storage) initializeFirebase();
    if (!_storage) throw new Error('Firebase Storage not initialized - running in SSR context');
    return _storage;
}

// Legacy exports for backward compatibility - these will be undefined during SSR
export const app = _app;
export const auth = _auth;
export const db = _db;
export const storage = _storage;
