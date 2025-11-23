import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    query,
    where,
    onSnapshot,
    Timestamp,
    type Unsubscribe
} from 'firebase/firestore';
import { getFirebaseDb } from '../firebase';
import { getUserLikes } from './dating';

/**
 * Get the count of unread messages for a user
 * Returns the number of conversations with unread messages
 */
export async function getUnreadMessageCount(userId: string): Promise<number> {
    try {
        const db = getFirebaseDb();
        if (!db) throw new Error('Firebase not initialized');

        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where('participants', 'array-contains', userId)
        );

        const snapshot = await getDocs(q);
        let unreadCount = 0;

        snapshot.forEach((doc) => {
            const conversation = doc.data();
            const readBy = conversation.readBy || [];

            // If the user hasn't marked this conversation as read
            if (!readBy.includes(userId)) {
                unreadCount++;
            }
        });

        return unreadCount;
    } catch (error) {
        console.error('Error getting unread message count:', error);
        return 0;
    }
}

/**
 * Subscribe to real-time unread message count updates
 */
export function subscribeToUnreadCount(
    userId: string,
    callback: (count: number) => void
): Unsubscribe {
    const db = getFirebaseDb();
    if (!db) throw new Error('Firebase not initialized');

    const conversationsRef = collection(db, 'conversations');
    const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId)
    );

    return onSnapshot(q, (snapshot) => {
        let unreadCount = 0;

        snapshot.forEach((doc) => {
            const conversation = doc.data();
            const readBy = conversation.readBy || [];

            if (!readBy.includes(userId)) {
                unreadCount++;
            }
        });

        callback(unreadCount);
    });
}

/**
 * Get matching likes (mutual likes) for a user
 * Returns profile IDs where both users have liked each other
 */
export async function getMatchingLikes(userId: string): Promise<string[]> {
    try {
        const db = getFirebaseDb();
        if (!db) throw new Error('Firebase not initialized');

        // Get all profiles this user has liked
        const userLikes = await getUserLikes(userId);

        if (userLikes.length === 0) {
            return [];
        }

        // Check which of those profiles have also liked this user back
        const matchingLikes: string[] = [];

        for (const likedProfileId of userLikes) {
            const theirLikesRef = collection(db, 'users', likedProfileId, 'likes');
            const likeDoc = doc(theirLikesRef, userId);
            const likeSnap = await getDoc(likeDoc);

            if (likeSnap.exists()) {
                // This is a mutual like (match)
                matchingLikes.push(likedProfileId);
            }
        }

        return matchingLikes;
    } catch (error) {
        console.error('Error getting matching likes:', error);
        return [];
    }
}

/**
 * Update user's last activity timestamp
 */
export async function updateLastActivity(userId: string): Promise<void> {
    try {
        const db = getFirebaseDb();
        if (!db) throw new Error('Firebase not initialized');

        const activityRef = doc(db, 'userActivity', userId);
        await setDoc(activityRef, {
            userId,
            lastActivity: Timestamp.now(),
            updatedAt: Timestamp.now()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating last activity:', error);
        // Don't throw - activity tracking is not critical
    }
}

/**
 * Get user's last activity timestamp
 */
export async function getLastActivity(userId: string): Promise<number | null> {
    try {
        const db = getFirebaseDb();
        if (!db) throw new Error('Firebase not initialized');

        const activityRef = doc(db, 'userActivity', userId);
        const activitySnap = await getDoc(activityRef);

        if (activitySnap.exists()) {
            const data = activitySnap.data();
            const lastActivity = data.lastActivity;

            if (lastActivity instanceof Timestamp) {
                return lastActivity.toMillis();
            }
            return lastActivity || null;
        }

        return null;
    } catch (error) {
        console.error('Error getting last activity:', error);
        return null;
    }
}

/**
 * Format last activity as a human-readable string
 */
export function formatLastActivity(timestamp: number | null): string {
    if (!timestamp) return 'غير متاح';

    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 5) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days === 1) return 'البارحة';
    if (days < 7) return `منذ ${days} أيام`;
    if (days < 30) return `منذ ${Math.floor(days / 7)} أسابيع`;

    return `منذ ${Math.floor(days / 30)} شهر`;
}
