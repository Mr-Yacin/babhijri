import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import type { DatingProfile, ProfileFormData } from '../types/user';

const COLLECTION_NAME = 'profiles';

export const ProfileService = {
    /**
     * Remove undefined values from an object
     * Firestore doesn't accept undefined values
     */
    removeUndefined(obj: any): any {
        const cleaned: any = {};
        Object.keys(obj).forEach(key => {
            if (obj[key] !== undefined) {
                cleaned[key] = obj[key];
            }
        });
        return cleaned;
    },

    /**
     * Create or overwrite a user's dating profile
     */
    async createProfile(uid: string, data: ProfileFormData): Promise<void> {
        try {
            const profileRef = doc(db, COLLECTION_NAME, uid);

            const newProfile: any = {
                uid,
                ...data,
                location: `${data.city}, ${data.country}`,
                photos: data.photos || [],
                verified: false,
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            // Remove undefined values (Firestore doesn't accept them)
            const cleanedProfile = this.removeUndefined(newProfile);

            await setDoc(profileRef, cleanedProfile);
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    },

    /**
     * Get a user's dating profile
     */
    async getProfile(uid: string): Promise<DatingProfile | null> {
        try {
            const profileRef = doc(db, COLLECTION_NAME, uid);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                // Convert Firestore Timestamps to numbers for compatibility
                return {
                    ...data,
                    createdAt: data.createdAt instanceof Timestamp
                        ? data.createdAt.toMillis()
                        : data.createdAt,
                    updatedAt: data.updatedAt instanceof Timestamp
                        ? data.updatedAt.toMillis()
                        : data.updatedAt
                } as DatingProfile;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting profile:', error);
            throw error;
        }
    },

    /**
     * Update a user's dating profile
     */
    async updateProfile(uid: string, data: Partial<DatingProfile>): Promise<void> {
        try {
            const profileRef = doc(db, COLLECTION_NAME, uid);

            const updateData = {
                ...data,
                updatedAt: serverTimestamp()
            };

            // Remove undefined values (Firestore doesn't accept them)
            const cleanedData = this.removeUndefined(updateData);

            await updateDoc(profileRef, cleanedData);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    /**
     * Delete a user's dating profile (soft delete or hard delete)
     */
    async deleteProfile(uid: string): Promise<void> {
        try {
            const profileRef = doc(db, COLLECTION_NAME, uid);
            await deleteDoc(profileRef);
        } catch (error) {
            console.error('Error deleting profile:', error);
            throw error;
        }
    },

    /**
     * Check if a profile exists for the user
     */
    async profileExists(uid: string): Promise<boolean> {
        try {
            const profileRef = doc(db, COLLECTION_NAME, uid);
            const docSnap = await getDoc(profileRef);
            return docSnap.exists();
        } catch (error) {
            console.error('Error checking profile existence:', error);
            return false;
        }
    },

    /**
     * Calculate profile completion percentage
     */
    calculateProfileCompletion(profile: DatingProfile): number {
        const fields = [
            'displayName', 'age', 'gender', 'city', 'country',
            'bio', 'interests', 'education', 'occupation',
            'lookingFor', 'maritalStatus', 'religion', 'languages', 'photos'
        ];

        let completed = 0;

        fields.forEach(field => {
            const value = profile[field as keyof DatingProfile];
            if (Array.isArray(value)) {
                if (value.length > 0) completed++;
            } else if (value) {
                completed++;
            }
        });

        return Math.round((completed / fields.length) * 100);
    }
};
