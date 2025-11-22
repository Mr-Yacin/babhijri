/**
 * Admin service for managing dating profiles
 */

import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import type { DatingProfile } from '../types/user';

/**
 * Get all profiles (admin only)
 */
export async function getAllProfiles(): Promise<DatingProfile[]> {
    try {
        const profilesRef = collection(db, 'profiles');
        const q = query(profilesRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            ...doc.data(),
            uid: doc.id,
        } as DatingProfile));
    } catch (error) {
        console.error('Error fetching all profiles:', error);
        throw error;
    }
}

/**
 * Update profile (admin only)
 */
export async function updateProfile(uid: string, data: Partial<DatingProfile>): Promise<void> {
    try {
        const profileRef = doc(db, 'profiles', uid);
        await updateDoc(profileRef, {
            ...data,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

/**
 * Delete profile (admin only)
 */
export async function deleteProfile(uid: string): Promise<void> {
    try {
        const profileRef = doc(db, 'profiles', uid);
        await deleteDoc(profileRef);
    } catch (error) {
        console.error('Error deleting profile:', error);
        throw error;
    }
}

/**
 * Toggle profile active status
 */
export async function toggleProfileStatus(uid: string, isActive: boolean): Promise<void> {
    try {
        const profileRef = doc(db, 'profiles', uid);
        await updateDoc(profileRef, {
            isActive,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error toggling profile status:', error);
        throw error;
    }
}
