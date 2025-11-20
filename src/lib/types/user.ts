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
