import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile } from '../types/user';
import type { User } from 'firebase/auth';

export const userService = {
    async createUserProfile(user: User, additionalData: Partial<UserProfile> = {}) {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            const { displayName, email, photoURL } = user;
            const createdAt = Date.now();

            try {
                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: displayName || '',
                    email: email || '',
                    photoURL: photoURL || '',
                    role: 'user',
                    createdAt,
                    updatedAt: createdAt,
                    ...additionalData
                });
            } catch (error) {
                console.error('Error creating user profile', error);
                throw error;
            }
        }
    },

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        if (!uid) return null;
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
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                ...data,
                updatedAt: Date.now()
            });
        } catch (error) {
            console.error('Error updating user profile', error);
            throw error;
        }
    }
};
