/**
 * Script to seed Firestore with mock dating profiles using Firebase Admin SDK
 * Run with: npm run seed:profiles
 */

import admin from 'firebase-admin';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase Admin with client SDK config
// This works for development but uses less secure client credentials
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: firebaseConfig.projectId,
        clientEmail: `firebase-adminsdk@${firebaseConfig.projectId}.iam.gserviceaccount.com`,
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n')
    }),
    projectId: firebaseConfig.projectId
});

const db = admin.firestore();

console.log('🔧 Firebase Admin initialized');
console.log('  Project ID:', firebaseConfig.projectId);
console.log('');

// Simplified mock profiles
const MOCK_PROFILES = [
    {
        uid: 'profile_001',
        displayName: 'أميرة',
        age: 24,
        gender: 'female',
        location: 'برلين، ألمانيا',
        city: 'برلين',
        country: 'ألمانيا',
        bio: 'مهندسة برمجيات، أحب السفر والقراءة.',
        interests: ['السفر', 'القراءة', 'البرمجة'],
        education: 'ماجستير في علوم الحاسوب',
        occupation: 'مهندسة برمجيات',
        photos: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'
        ],
        verified: true,
        lookingFor: 'marriage',
        maritalStatus: 'single',
        hasChildren: false,
        religion: 'مسلمة',
        languages: ['العربية', 'الإنجليزية'],
        height: 165,
        isActive: true,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
    },
    {
        uid: 'profile_002',
        displayName: 'سارة',
        age: 26,
        gender: 'female',
        location: 'لندن، بريطانيا',
        city: 'لندن',
        country: 'بريطانيا',
        bio: 'طبيبة أسنان، أحب الفن والموسيقى.',
        interests: ['الفن', 'الموسيقى', 'الطب'],
        education: 'دكتوراه في طب الأسنان',
        occupation: 'طبيبة أسنان',
        photos: [
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800'
        ],
        verified: true,
        lookingFor: 'marriage',
        maritalStatus: 'single',
        hasChildren: false,
        religion: 'مسلمة',
        languages: ['العربية', 'الإنجليزية'],
        height: 162,
        isActive: true,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
    }
];

async function seedProfiles() {
    console.log('🌱 Starting to seed Firestore with mock profiles...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const profile of MOCK_PROFILES) {
        try {
            await db.collection('profiles').doc(profile.uid).set(profile);
            console.log(`✅ Added profile: ${profile.displayName} (${profile.uid})`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error adding profile ${profile.displayName}:`);
            console.error('   Error message:', error.message);
            errorCount++;
        }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Successfully added: ${successCount} profiles`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total: ${MOCK_PROFILES.length} profiles\n`);

    if (successCount === MOCK_PROFILES.length) {
        console.log('🎉 All profiles seeded successfully!');
        console.log('You can now test the app at http://localhost:4321/app');
    } else {
        console.log('⚠️  Some profiles failed to seed. Check errors above.');
    }

    process.exit(0);
}

// Run the seeding function
seedProfiles().catch((error) => {
    console.error('💥 Fatal error during seeding:');
    console.error(error);
    process.exit(1);
});
