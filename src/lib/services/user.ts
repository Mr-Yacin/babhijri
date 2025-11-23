import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseDb } from '../firebase';
import type { UserProfile } from '../types/user';
import type { User } from 'firebase/auth';

export const userService = {
    async createUserProfile(user: User, additionalData: Partial<UserProfile> = {}) {
        if (!user) return;

        const db = getFirebaseDb();
        if (!db) {
            console.error('Firestore not initialized');
            throw new Error('Firestore not initialized');
        }

        const userRef = doc(db, 'users', user.uid);

        try {
            const snapshot = await getDoc(userRef);

            if (!snapshot.exists()) {
                const { displayName, email, photoURL } = user;
                const createdAt = Date.now();

                const userData = {
                    uid: user.uid,
                    displayName: displayName || '',
                    email: email || '',
                    photoURL: photoURL || '',
                    role: 'user',
                    createdAt,
                    updatedAt: createdAt,
                    ...additionalData
                };

                try {
                    await setDoc(userRef, userData);
                    console.log('User profile created successfully in Firestore:', user.uid);
                } catch (error) {
                    console.error('Error creating user profile', error);
                    throw error;
                }
            } else {
                console.log('User profile already exists:', user.uid);
            }
        } catch (outerError) {
            console.error('Error checking/creating user profile:', outerError);
            throw outerError;
        }
    },

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        if (!uid) return null;

        const db = getFirebaseDb();
        if (!db) {
            console.error('Firestore not initialized');
            return null;
        }

        try {
            const userRef = doc(db, 'users', uid);
            const snapshot = await getDoc(userRef);
            if (snapshot.exists()) {
                return snapshot.data() as UserProfile;
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile', error);
            return null;
        }
    },

    async updateUserProfile(uid: string, data: Partial<UserProfile>) {
        if (!uid) return;

        const db = getFirebaseDb();
        if (!db) {
            console.error('Firestore not initialized');
            throw new Error('Firestore not initialized');
        }

        try {
            // Create a mutable copy and remove the 'role' property to prevent privilege escalation.
            // Role changes should only be handled by specific admin functions.
            const updateData = { ...data };
            delete (updateData as any).role;

            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                ...updateData,
                updatedAt: Date.now()
            });
        } catch (error) {
            console.error('Error updating user profile', error);
            throw error;
        }
    }
};
