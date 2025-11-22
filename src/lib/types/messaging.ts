import type { DatingProfile } from './user';

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    content: string;
    timestamp: number;
    read: boolean;
}

export interface Conversation {
    id: string;
    participants: string[]; // Array of user IDs
    participantNames: Record<string, string>; // Map of uid -> display name
    participantPhotos: Record<string, string>; // Map of uid -> photo URL
    lastMessage?: {
        content: string;
        senderId: string;
        timestamp: number;
    };
    unreadCount: Record<string, number>; // Map of uid -> unread count for that user
    createdAt: number;
    updatedAt: number;
}

export interface ConversationWithProfile {
    conversation: Conversation;
    otherUserProfile: DatingProfile;
}
