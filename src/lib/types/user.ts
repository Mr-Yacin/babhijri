export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    bio?: string;
    location?: string;
    role: 'user' | 'admin';
    createdAt: number;
    updatedAt: number;
}

export interface DatingProfile {
    uid: string;
    displayName: string;
    age: number;
    gender: 'male' | 'female';
    location: string; // General location string
    city: string;
    country: string;
    bio: string;
    interests: string[];
    education: string;
    occupation: string;
    photos: string[];
    verified: boolean;
    lookingFor: 'marriage' | 'friendship';
    maritalStatus: 'single' | 'divorced' | 'widowed';
    hasChildren: boolean;
    religion: string;
    languages: string[];
    height?: number;
    createdAt: number;
    updatedAt: number;
    isActive: boolean;
}

export interface ProfileFormData {
    displayName: string;
    age: number;
    gender: 'male' | 'female';
    city: string;
    country: string;
    bio: string;
    interests: string[];
    education: string;
    occupation: string;
    lookingFor: 'marriage' | 'friendship';
    maritalStatus: 'single' | 'divorced' | 'widowed';
    hasChildren: boolean;
    religion: string;
    languages: string[];
    height?: number;
    photos: string[];
}

export interface UserSettings {
    uid: string;
    emailNotifications: boolean;
    matchNotifications: boolean;
    messageNotifications: boolean;
    profileVisibility: 'everyone' | 'matches';
    showOnlineStatus: boolean;
    language: 'ar' | 'en';
    updatedAt: number;
}

export interface ProfileStats {
    views: number;
    likes: number;
    matches: number;
    lastUpdated: number;
}

// Admin-specific types
export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    verifiedUsers: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    totalProfiles: number;
    maleUsers: number;
    femaleUsers: number;
    lastUpdated: number;
}

export interface UserActivity {
    uid: string;
    action: 'login' | 'logout' | 'profile_update' | 'profile_create' | 'settings_update' | 'account_delete';
    timestamp: number;
    details?: string;
    ipAddress?: string;
}

export interface UserListItem {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    verified: boolean;
    createdAt: number;
    lastLogin?: number;
    profileCompletion?: number;
}

export interface AdminFilters {
    search?: string;
    role?: 'user' | 'admin' | 'all';
    status?: 'active' | 'inactive' | 'all';
    verified?: 'verified' | 'unverified' | 'all';
    dateFrom?: number;
    dateTo?: number;
}
