import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp,
    type Firestore
} from 'firebase/firestore';
import { getFirebaseDb } from '../firebase';
import type { DatingProfile, PublicProfile, ProfileFormData, UserSettings, ProfileStats } from '../types/user';
import { ImageUploadService } from '../utils/imageUpload';

const COLLECTION_NAME = 'profiles';
const SETTINGS_COLLECTION = 'userSettings';
const STATS_COLLECTION = 'profileStats';

function getDb(): Firestore {
    const db = getFirebaseDb();
    if (!db) {
        throw new Error('Firestore is not initialized');
    }
    return db;
}

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
            const profileRef = doc(getDb(), COLLECTION_NAME, uid);

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

            // Initialize default settings
            await this.initializeSettings(uid);

            // Initialize stats
            await this.initializeStats(uid);
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    },

    /**
     * Get a user's dating profile
     */
    /**
     * Get a user's public dating profile (strips admin data)
     */
    async getProfile(uid: string): Promise<PublicProfile | null> {
        try {
            const profileRef = doc(getDb(), COLLECTION_NAME, uid);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                // Convert Firestore Timestamps to numbers for compatibility
                const fullProfile = {
                    ...data,
                    createdAt: data.createdAt instanceof Timestamp
                        ? data.createdAt.toMillis()
                        : data.createdAt,
                    updatedAt: data.updatedAt instanceof Timestamp
                        ? data.updatedAt.toMillis()
                        : data.updatedAt
                } as DatingProfile;

                // Strip admin fields for public view
                const { verificationStatus, adminNotes, verificationDate, rejectionReason, ...publicProfile } = fullProfile;
                return publicProfile as PublicProfile;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting profile:', error);
            throw error;
        }
    },

    /**
     * Get a user's full dating profile (including admin data)
     * Only for use by admins or the user themselves (in edit mode)
     */
    async getFullProfile(uid: string): Promise<DatingProfile | null> {
        try {
            const profileRef = doc(getDb(), COLLECTION_NAME, uid);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

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
            console.error('Error getting full profile:', error);
            throw error;
        }
    },

    /**
     * Update a user's dating profile
     */
    async updateProfile(uid: string, data: Partial<DatingProfile>): Promise<void> {
        try {
            const profileRef = doc(getDb(), COLLECTION_NAME, uid);

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
            const profileRef = doc(getDb(), COLLECTION_NAME, uid);
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
            const profileRef = doc(getDb(), COLLECTION_NAME, uid);
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
    },

    /**
     * Toggle profile visibility (active/inactive)
     */
    async updateProfileVisibility(uid: string, isActive: boolean): Promise<void> {
        try {
            const profileRef = doc(getDb(), COLLECTION_NAME, uid);
            await updateDoc(profileRef, {
                isActive,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating profile visibility:', error);
            throw error;
        }
    },

    /**
     * Get profile statistics
     */
    async getProfileStats(uid: string): Promise<ProfileStats> {
        try {
            const statsRef = doc(getDb(), STATS_COLLECTION, uid);
            const docSnap = await getDoc(statsRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    views: data.views || 0,
                    likes: data.likes || 0,
                    matches: data.matches || 0,
                    lastUpdated: data.lastUpdated instanceof Timestamp
                        ? data.lastUpdated.toMillis()
                        : data.lastUpdated || Date.now()
                } as ProfileStats;
            } else {
                // Return default stats if none exist
                return {
                    views: 0,
                    likes: 0,
                    matches: 0,
                    lastUpdated: Date.now()
                };
            }
        } catch (error) {
            console.error('Error getting profile stats:', error);
            throw error;
        }
    },

    /**
     * Initialize default stats for a new profile
     */
    async initializeStats(uid: string): Promise<void> {
        try {
            const statsRef = doc(getDb(), STATS_COLLECTION, uid);
            await setDoc(statsRef, {
                views: 0,
                likes: 0,
                matches: 0,
                lastUpdated: serverTimestamp()
            });
        } catch (error) {
            console.error('Error initializing stats:', error);
            // Don't throw - stats are not critical
        }
    },

    /**
     * Get user settings
     */
    async getUserSettings(uid: string): Promise<UserSettings> {
        try {
            const settingsRef = doc(getDb(), SETTINGS_COLLECTION, uid);
            const docSnap = await getDoc(settingsRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    uid: data.uid,
                    emailNotifications: data.emailNotifications ?? true,
                    matchNotifications: data.matchNotifications ?? true,
                    messageNotifications: data.messageNotifications ?? true,
                    profileVisibility: data.profileVisibility || 'everyone',
                    showOnlineStatus: data.showOnlineStatus ?? true,
                    language: data.language || 'ar',
                    updatedAt: data.updatedAt instanceof Timestamp
                        ? data.updatedAt.toMillis()
                        : data.updatedAt || Date.now()
                } as UserSettings;
            } else {
                // Return default settings
                return {
                    uid,
                    emailNotifications: true,
                    matchNotifications: true,
                    messageNotifications: true,
                    profileVisibility: 'everyone',
                    showOnlineStatus: true,
                    language: 'ar',
                    updatedAt: Date.now()
                };
            }
        } catch (error) {
            console.error('Error getting user settings:', error);
            throw error;
        }
    },

    /**
     * Update user settings
     */
    async updateUserSettings(uid: string, settings: Partial<UserSettings>): Promise<void> {
        try {
            const settingsRef = doc(getDb(), SETTINGS_COLLECTION, uid);
            const updateData = {
                ...settings,
                uid,
                updatedAt: serverTimestamp()
            };

            const cleanedData = this.removeUndefined(updateData);
            await setDoc(settingsRef, cleanedData, { merge: true });
        } catch (error) {
            console.error('Error updating user settings:', error);
            throw error;
        }
    },

    /**
     * Initialize default settings for a new user
     */
    async initializeSettings(uid: string): Promise<void> {
        try {
            const settingsRef = doc(getDb(), SETTINGS_COLLECTION, uid);
            await setDoc(settingsRef, {
                uid,
                emailNotifications: true,
                matchNotifications: true,
                messageNotifications: true,
                profileVisibility: 'everyone',
                showOnlineStatus: true,
                language: 'ar',
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error initializing settings:', error);
            // Don't throw - settings can be created later
        }
    },

    /**
     * Upload a profile photo
     */
    async uploadProfilePhoto(uid: string, file: File): Promise<string> {
        return ImageUploadService.uploadProfilePhoto(uid, file);
    },

    /**
     * Delete a profile photo
     */
    async deleteProfilePhoto(photoUrl: string): Promise<void> {
        return ImageUploadService.deleteProfilePhoto(photoUrl);
    }
};

