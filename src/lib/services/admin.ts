import {
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp,
    DocumentSnapshot,
    QueryConstraint,
    writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { ProfileService } from './profile';
import type { AdminStats, UserListItem, UserActivity, AdminFilters, DatingProfile } from '../types/user';

const USERS_COLLECTION = 'users';
const PROFILES_COLLECTION = 'profiles';
const ACTIVITY_COLLECTION = 'userActivity';
const STATS_COLLECTION = 'adminStats';

export const AdminService = {
    /**
     * Get overall platform statistics
     */
    async getAdminStats(): Promise<AdminStats> {
        try {
            const statsRef = doc(db, STATS_COLLECTION, 'platform');
            const docSnap = await getDoc(statsRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    totalUsers: data.totalUsers || 0,
                    activeUsers: data.activeUsers || 0,
                    inactiveUsers: data.inactiveUsers || 0,
                    verifiedUsers: data.verifiedUsers || 0,
                    newUsersThisWeek: data.newUsersThisWeek || 0,
                    newUsersThisMonth: data.newUsersThisMonth || 0,
                    totalProfiles: data.totalProfiles || 0,
                    maleUsers: data.maleUsers || 0,
                    femaleUsers: data.femaleUsers || 0,
                    lastUpdated: data.lastUpdated instanceof Timestamp
                        ? data.lastUpdated.toMillis()
                        : data.lastUpdated || Date.now()
                } as AdminStats;
            } else {
                // Calculate stats on the fly if not cached
                return await this.calculateStats();
            }
        } catch (error) {
            console.error('Error getting admin stats:', error);
            throw error;
        }
    },

    /**
     * Calculate platform statistics from scratch
     */
    async calculateStats(): Promise<AdminStats> {
        try {
            const profilesRef = collection(db, PROFILES_COLLECTION);
            const allProfilesSnap = await getDocs(profilesRef);

            const now = Date.now();
            const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
            const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

            let totalUsers = 0;
            let activeUsers = 0;
            let inactiveUsers = 0;
            let verifiedUsers = 0;
            let newUsersThisWeek = 0;
            let newUsersThisMonth = 0;
            let maleUsers = 0;
            let femaleUsers = 0;

            allProfilesSnap.forEach((doc) => {
                const profile = doc.data() as DatingProfile;
                totalUsers++;

                if (profile.isActive) activeUsers++;
                else inactiveUsers++;

                if (profile.verified) verifiedUsers++;

                const createdAt = (profile.createdAt as any) instanceof Timestamp
                    ? (profile.createdAt as any).toMillis()
                    : profile.createdAt;

                if (createdAt >= oneWeekAgo) newUsersThisWeek++;
                if (createdAt >= oneMonthAgo) newUsersThisMonth++;

                if (profile.gender === 'male') maleUsers++;
                else if (profile.gender === 'female') femaleUsers++;
            });

            return {
                totalUsers,
                activeUsers,
                inactiveUsers,
                verifiedUsers,
                newUsersThisWeek,
                newUsersThisMonth,
                totalProfiles: totalUsers,
                maleUsers,
                femaleUsers,
                lastUpdated: now
            };
        } catch (error) {
            console.error('Error calculating stats:', error);
            throw error;
        }
    },

    /**
     * Get all users with pagination and filters
     * Implements recursive fetching to ensure pageSize is met even with client-side filtering
     * ALWAYS queries the 'users' collection to ensure consistency
     */
    async getAllUsers(
        filters: AdminFilters = {},
        pageSize: number = 20,
        lastDoc?: DocumentSnapshot
    ): Promise<{ users: UserListItem[], lastDoc: DocumentSnapshot | null, hasMore: boolean }> {
        try {
            const accumulatedUsers: { data: UserListItem, doc: DocumentSnapshot }[] = [];
            let currentLastDoc = lastDoc || null;
            let hasMoreInDb = true;
            let iterations = 0;
            const MAX_ITERATIONS = 10; // Increased limit for deeper searches
            const FETCH_SIZE = 50; // Fetch larger batches

            // ALWAYS query the users collection
            const collectionRef = collection(db, USERS_COLLECTION);

            while (accumulatedUsers.length < pageSize && hasMoreInDb && iterations < MAX_ITERATIONS) {
                iterations++;
                const constraints: QueryConstraint[] = [];

                // Apply User-level filters (Role)
                if (filters.role && filters.role !== 'all') {
                    constraints.push(where('role', '==', filters.role));
                }

                // Order and Pagination
                constraints.push(orderBy('createdAt', 'desc'));
                constraints.push(limit(FETCH_SIZE));

                if (currentLastDoc) {
                    constraints.push(startAfter(currentLastDoc));
                }

                const q = query(collectionRef, ...constraints);
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    hasMoreInDb = false;
                    break;
                }

                // Update currentLastDoc for the next iteration
                currentLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

                if (querySnapshot.docs.length < FETCH_SIZE) {
                    hasMoreInDb = false;
                }

                // Process results
                const processPromises = querySnapshot.docs.map(async (docSnapshot) => {
                    const userData = docSnapshot.data();
                    let profileData: any = null;

                    try {
                        const profileDoc = await getDoc(doc(db, PROFILES_COLLECTION, userData.uid));
                        if (profileDoc.exists()) {
                            profileData = profileDoc.data();
                        }
                    } catch (e) {
                        console.error(`Error fetching profile data for ${userData.uid}`, e);
                    }

                    // Client-side filtering for Profile fields

                    // Status Filter
                    if (filters.status && filters.status !== 'all') {
                        const isActive = profileData?.isActive || false;
                        if (filters.status === 'active' && !isActive) return null;
                        if (filters.status === 'inactive' && isActive) return null;
                    }

                    // Verified Filter
                    if (filters.verified && filters.verified !== 'all') {
                        const isVerified = profileData?.verified || false;
                        if (filters.verified === 'verified' && !isVerified) return null;
                        if (filters.verified === 'unverified' && isVerified) return null;
                    }

                    const userItem: UserListItem = {
                        uid: userData.uid,
                        email: userData.email || '',
                        displayName: userData.displayName || 'Unknown',
                        photoURL: profileData?.photos?.[0] || userData.photoURL,
                        role: userData.role || 'user',
                        isActive: profileData?.isActive || false,
                        verified: profileData?.verified || false,
                        createdAt: (userData.createdAt as any) instanceof Timestamp
                            ? (userData.createdAt as any).toMillis()
                            : userData.createdAt,
                        profileCompletion: profileData ? ProfileService.calculateProfileCompletion(profileData as DatingProfile) : 0
                    };

                    // Search Filter
                    if (filters.search) {
                        const searchLower = filters.search.toLowerCase();
                        const nameMatch = userItem.displayName?.toLowerCase().includes(searchLower);
                        const emailMatch = userItem.email?.toLowerCase().includes(searchLower);

                        if (!nameMatch && !emailMatch) {
                            return null;
                        }
                    }

                    return { data: userItem, doc: docSnapshot };
                });

                const results = await Promise.all(processPromises);
                const validResults = results.filter(r => r !== null) as { data: UserListItem, doc: DocumentSnapshot }[];
                accumulatedUsers.push(...validResults);
            }

            // Prepare final result
            let finalUsers: UserListItem[] = [];
            let finalLastDoc: DocumentSnapshot | null = null;
            let finalHasMore = false;

            if (accumulatedUsers.length > pageSize) {
                const sliced = accumulatedUsers.slice(0, pageSize);
                finalUsers = sliced.map(x => x.data);
                finalLastDoc = sliced[sliced.length - 1].doc;
                finalHasMore = true;
            } else {
                finalUsers = accumulatedUsers.map(x => x.data);
                finalLastDoc = currentLastDoc;
                finalHasMore = hasMoreInDb;
            }

            return { users: finalUsers, lastDoc: finalLastDoc, hasMore: finalHasMore };
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    },

    /**
     * Get recently joined users
     */
    async getRecentUsers(limitCount: number = 10): Promise<UserListItem[]> {
        try {
            const profilesRef = collection(db, PROFILES_COLLECTION);
            const q = query(
                profilesRef,
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            const users: UserListItem[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data() as DatingProfile;
                users.push({
                    uid: data.uid,
                    email: '',
                    displayName: data.displayName,
                    photoURL: data.photos?.[0],
                    role: 'user',
                    isActive: data.isActive,
                    verified: data.verified,
                    createdAt: (data.createdAt as any) instanceof Timestamp
                        ? (data.createdAt as any).toMillis()
                        : data.createdAt,
                    profileCompletion: ProfileService.calculateProfileCompletion(data)
                });
            });

            return users;
        } catch (error) {
            console.error('Error getting recent users:', error);
            throw error;
        }
    },

    /**
     * Get user activity logs
     */
    async getUserActivity(uid: string, limitCount: number = 50): Promise<UserActivity[]> {
        try {
            const activityRef = collection(db, ACTIVITY_COLLECTION);
            const q = query(
                activityRef,
                where('uid', '==', uid),
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            const activities: UserActivity[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                activities.push({
                    uid: data.uid,
                    action: data.action,
                    timestamp: (data.timestamp as any) instanceof Timestamp
                        ? (data.timestamp as any).toMillis()
                        : data.timestamp,
                    details: data.details,
                    ipAddress: data.ipAddress
                } as UserActivity);
            });

            return activities;
        } catch (error) {
            console.error('Error getting user activity:', error);
            return []; // Return empty array if activity tracking is not set up
        }
    },

    /**
     * Toggle user active status
     */
    async toggleUserStatus(uid: string, isActive: boolean): Promise<void> {
        try {
            const profileRef = doc(db, PROFILES_COLLECTION, uid);
            await updateDoc(profileRef, {
                isActive,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error toggling user status:', error);
            throw error;
        }
    },

    /**
     * Update user role (admin/user)
     */
    async updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
        try {
            const userRef = doc(db, USERS_COLLECTION, uid);
            await updateDoc(userRef, {
                role,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    },

    /**
     * Delete user account (admin action)
     */
    async deleteUserAccount(uid: string): Promise<void> {
        try {
            const batch = writeBatch(db);

            // Delete profile
            const profileRef = doc(db, PROFILES_COLLECTION, uid);
            batch.delete(profileRef);

            // Delete user document
            const userRef = doc(db, USERS_COLLECTION, uid);
            batch.delete(userRef);

            // Delete user settings
            const settingsRef = doc(db, 'userSettings', uid);
            batch.delete(settingsRef);

            // Delete user stats
            const statsRef = doc(db, STATS_COLLECTION, uid);
            batch.delete(statsRef);

            // Commit the batch
            await batch.commit();

            // Note: The user auth account still exists in Firebase Auth
            // and must be deleted via Admin SDK or by the user.
        } catch (error) {
            console.error('Error deleting user account:', error);
            throw error;
        }
    },

    /**
     * Search users by name or location
     */
    async searchUsers(searchQuery: string): Promise<UserListItem[]> {
        try {
            // Note: Firestore doesn't support full-text search natively
            // This is a simple implementation that fetches all profiles and filters client-side
            // For production, consider using Algolia or similar service

            const profilesRef = collection(db, PROFILES_COLLECTION);
            const q = query(profilesRef, limit(100)); // Limit to avoid fetching too much data

            const querySnapshot = await getDocs(q);
            const users: UserListItem[] = [];
            const searchLower = searchQuery.toLowerCase();

            querySnapshot.forEach((doc) => {
                const data = doc.data() as DatingProfile;
                const nameMatch = data.displayName?.toLowerCase().includes(searchLower);
                const locationMatch = data.location?.toLowerCase().includes(searchLower);

                if (nameMatch || locationMatch) {
                    users.push({
                        uid: data.uid,
                        email: '',
                        displayName: data.displayName,
                        photoURL: data.photos?.[0],
                        role: 'user',
                        isActive: data.isActive,
                        verified: data.verified,
                        createdAt: (data.createdAt as any) instanceof Timestamp
                            ? (data.createdAt as any).toMillis()
                            : data.createdAt,
                        profileCompletion: ProfileService.calculateProfileCompletion(data)
                    });
                }
            });

            return users;
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }
};
