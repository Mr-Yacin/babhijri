import { getFirebaseDb } from '../firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import type { DatingProfile } from '../types/user';

/**
 * Fetch all active dating profiles from Firestore
 */
export async function getProfiles(): Promise<DatingProfile[]> {
    try {
        const db = getFirebaseDb();
        if (!db) {
            throw new Error('Firebase not initialized');
        }
        
        const profilesRef = collection(db, 'profiles');
        const q = query(
            profilesRef,
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const profiles: DatingProfile[] = [];

        querySnapshot.forEach((doc) => {
            profiles.push(doc.data() as DatingProfile);
        });

        return profiles;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}

/**
 * Fetch a single profile by ID
 */
export async function getProfileById(uid: string): Promise<DatingProfile | null> {
    try {
        const db = getFirebaseDb();
        if (!db) {
            throw new Error('Firebase not initialized');
        }
        
        const profileRef = doc(db, 'profiles', uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
            return profileSnap.data() as DatingProfile;
        }

        return null;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

/**
 * Toggle like for a profile
 * @param userId - Current user's ID
 * @param profileId - Profile to like/unlike
 * @returns true if liked, false if unliked
 */
export async function toggleLike(userId: string, profileId: string): Promise<boolean> {
    try {
        const db = getFirebaseDb();
        if (!db) {
            throw new Error('Firebase not initialized');
        }
        
        const likeRef = doc(db, 'users', userId, 'likes', profileId);
        const likeSnap = await getDoc(likeRef);

        if (likeSnap.exists()) {
            // Unlike - delete the document
            await deleteDoc(likeRef);
            return false;
        } else {
            // Like - create the document
            await setDoc(likeRef, {
                profileId,
                timestamp: Timestamp.now()
            });
            return true;
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
}

/**
 * Get all liked profile IDs for a user
 */
export async function getUserLikes(userId: string): Promise<string[]> {
    try {
        const db = getFirebaseDb();
        if (!db) {
            throw new Error('Firebase not initialized');
        }
        
        const likesRef = collection(db, 'users', userId, 'likes');
        const querySnapshot = await getDocs(likesRef);

        const likedIds: string[] = [];
        querySnapshot.forEach((doc) => {
            likedIds.push(doc.id);
        });

        return likedIds;
    } catch (error) {
        console.error('Error fetching user likes:', error);
        throw error;
    }
}

/**
 * Check if a user has liked a specific profile
 */
export async function isProfileLiked(userId: string, profileId: string): Promise<boolean> {
    try {
        const db = getFirebaseDb();
        if (!db) {
            throw new Error('Firebase not initialized');
        }
        
        const likeRef = doc(db, 'users', userId, 'likes', profileId);
        const likeSnap = await getDoc(likeRef);

        return likeSnap.exists();
    } catch (error) {
        console.error('Error checking if profile is liked:', error);
        throw error;
    }
}

/**
 * Filter profiles by region
 */
export function filterProfilesByRegion(profiles: DatingProfile[], region: string): DatingProfile[] {
    if (region === 'all') {
        return profiles;
    }

    const europeanCountries = [
        'ألمانيا', 'بريطانيا', 'فرنسا', 'هولندا', 'إسبانيا', 'النمسا',
        'السويد', 'بلجيكا', 'إيطاليا', 'الدنمارك', 'النرويج', 'أيرلندا',
        'البرتغال', 'سويسرا'
    ];

    const northAmericanCountries = ['أمريكا', 'كندا'];

    if (region === 'europe') {
        return profiles.filter(p => europeanCountries.includes(p.country));
    } else if (region === 'north-america') {
        return profiles.filter(p => northAmericanCountries.includes(p.country));
    }

    return profiles;
}
