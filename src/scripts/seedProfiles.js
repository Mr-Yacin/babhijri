/**
 * Simple script to seed Firestore with mock dating profiles
 * This uses the client SDK with anonymous authentication
 * Run with: npm run seed:profiles
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { firebaseConfig } from './firebase-config.js';

console.log('🔧 Initializing Firebase...');
console.log('  Project:', firebaseConfig.projectId);
console.log('');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Mock profiles data - just 2 for quick testing
const MOCK_PROFILES = [
    {
        uid: 'profile_001',
        displayName: 'أميرة',
        age: 24,
        gender: 'female',
        location: 'برلين، ألمانيا',
        city: 'برلين',
        country: 'ألمانيا',
        bio: 'مهندسة برمجيات، أحب السفر والقراءة. أبحث عن شريك طموح يشاركني حب التعلم والاستكشاف.',
        interests: ['السفر', 'القراءة', 'البرمجة', 'الطبخ', 'اليوغا'],
        education: 'ماجستير في علوم الحاسوب',
        occupation: 'مهندسة برمجيات',
        photos: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        verified: true,
        lookingFor: 'marriage',
        maritalStatus: 'single',
        hasChildren: false,
        religion: 'مسلمة',
        languages: ['العربية', 'الإنجليزية', 'الألمانية'],
        height: 165,
        isActive: true
    },
    {
        uid: 'profile_002',
        displayName: 'سارة',
        age: 26,
        gender: 'female',
        location: 'لندن، بريطانيا',
        city: 'لندن',
        country: 'بريطانيا',
        bio: 'طبيبة أسنان، أحب الفن والموسيقى. أبحث عن شخص متدين وملتزم بقيمه.',
        interests: ['الفن', 'الموسيقى', 'الطب', 'التطوع', 'الرسم'],
        education: 'دكتوراه في طب الأسنان',
        occupation: 'طبيبة أسنان',
        photos: [
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        verified: true,
        lookingFor: 'marriage',
        maritalStatus: 'single',
        hasChildren: false,
        religion: 'مسلمة',
        languages: ['العربية', 'الإنجليزية'],
        height: 162,
        isActive: true
    }
];

async function seedProfiles() {
    try {
        // Sign in anonymously to get authentication
        console.log('🔐 Signing in anonymously...');
        await signInAnonymously(auth);
        console.log('✅ Authenticated successfully\n');

        console.log('🌱 Starting to seed Firestore with mock profiles...\n');

        let successCount = 0;
        let errorCount = 0;

        for (const profile of MOCK_PROFILES) {
            try {
                const profileData = {
                    ...profile,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                };

                const profileRef = doc(db, 'profiles', profile.uid);
                await setDoc(profileRef, profileData);
                console.log(`✅ Added profile: ${profile.displayName} (${profile.uid})`);
                successCount++;
            } catch (error) {
                console.error(`❌ Error adding profile ${profile.displayName}:`);
                console.error('   Message:', error.message);
                if (error.code) console.error('   Code:', error.code);
                errorCount++;
            }
        }

        console.log('\n📊 Seeding Summary:');
        console.log(`   ✅ Successfully added: ${successCount} profiles`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   📝 Total: ${MOCK_PROFILES.length} profiles\n`);

        if (successCount === MOCK_PROFILES.length) {
            console.log('🎉 All profiles seeded successfully!');
            console.log('\n📍 Next steps:');
            console.log('   1. Open http://localhost:4321/app in your browser');
            console.log('   2. The profiles should load automatically');
            console.log('   3. Try liking profiles and viewing details\n');
        } else if (successCount > 0) {
            console.log('⚠️  Some profiles were added, but some failed.');
            console.log('   You can still test the app with the profiles that were added.\n');
        } else {
            console.log('❌ No profiles were added.');
            console.log('   Check the Firestore security rules in Firebase Console.');
            console.log('   You may need to temporarily allow writes for development.\n');
        }

        process.exit(0);
    } catch (error) {
        console.error('\n💥 Fatal error:');
        console.error(error.message);
        if (error.code) console.error('Error code:', error.code);
        console.log('\n💡 Tip: Check your Firestore security rules in Firebase Console');
        process.exit(1);
    }
}

// Run the seeding function
seedProfiles();
