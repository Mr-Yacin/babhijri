/**
 * Script to seed Firestore with mock dating profiles
 * Run with: npm run seed:profiles
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { MOCK_PROFILES } from '../lib/data/mockProfiles.js';

const firebaseConfig = {
    apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedProfiles() {
    console.log('🌱 Starting to seed Firestore with mock profiles...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const profile of MOCK_PROFILES) {
        try {
            const profileRef = doc(db, 'profiles', profile.uid);
            await setDoc(profileRef, profile);
            console.log(`✅ Added profile: ${profile.displayName} (${profile.uid})`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error adding profile ${profile.displayName}:`, error);
            errorCount++;
        }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Successfully added: ${successCount} profiles`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total: ${MOCK_PROFILES.length} profiles\n`);

    if (successCount === MOCK_PROFILES.length) {
        console.log('🎉 All profiles seeded successfully!');
    } else {
        console.log('⚠️  Some profiles failed to seed. Check errors above.');
    }

    process.exit(0);
}

// Run the seeding function
seedProfiles().catch((error) => {
    console.error('💥 Fatal error during seeding:', error);
    process.exit(1);
});
