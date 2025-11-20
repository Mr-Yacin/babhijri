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
