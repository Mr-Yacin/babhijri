import { db } from '../firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    Timestamp,
    type Unsubscribe
} from 'firebase/firestore';
import type { Message, Conversation, ConversationWithProfile } from '../types/messaging';
import type { DatingProfile } from '../types/user';
import { getProfileById } from './dating';

/**
 * Get or create a conversation between two users
 */
export async function getOrCreateConversation(
    userId: string,
    otherUserId: string,
    userName: string,
    otherUserName: string,
    userPhoto?: string,
    otherUserPhoto?: string
): Promise<string> {
    try {
        // Check if conversation already exists
        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where('participants', 'array-contains', userId)
        );

        const querySnapshot = await getDocs(q);
        let existingConversationId: string | null = null;

        querySnapshot.forEach((doc) => {
            const data = doc.data() as Conversation;
            if (data.participants.includes(otherUserId)) {
                existingConversationId = doc.id;
            }
        });

        if (existingConversationId) {
            return existingConversationId;
        }

        // Create new conversation
        const now = Date.now();
        const newConversation: Omit<Conversation, 'id'> = {
            participants: [userId, otherUserId],
            participantNames: {
                [userId]: userName,
                [otherUserId]: otherUserName
            },
            participantPhotos: {
                [userId]: userPhoto || '',
                [otherUserId]: otherUserPhoto || ''
            },
            unreadCount: {
                [userId]: 0,
                [otherUserId]: 0
            },
            createdAt: now,
            updatedAt: now
        };

        const docRef = await addDoc(conversationsRef, newConversation);
        return docRef.id;
    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        throw error;
    }
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string): Promise<ConversationWithProfile[]> {
    try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where('participants', 'array-contains', userId),
            orderBy('updatedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const conversations: ConversationWithProfile[] = [];

        for (const docSnap of querySnapshot.docs) {
            const conversation = { id: docSnap.id, ...docSnap.data() } as Conversation;

            // Get the other user's ID
            const otherUserId = conversation.participants.find(id => id !== userId);

            if (otherUserId) {
                // Fetch the other user's profile
                const profile = await getProfileById(otherUserId);

                if (profile) {
                    conversations.push({
                        conversation,
                        otherUserProfile: profile
                    });
                }
            }
        }

        return conversations;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    senderPhoto?: string
): Promise<void> {
    try {
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const now = Date.now();

        const newMessage: Omit<Message, 'id'> = {
            conversationId,
            senderId,
            senderName,
            senderPhoto,
            content,
            timestamp: now,
            read: false
        };

        await addDoc(messagesRef, newMessage);

        // Update conversation's last message and unread count
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);

        if (conversationSnap.exists()) {
            const conversation = conversationSnap.data() as Conversation;
            const otherUserId = conversation.participants.find(id => id !== senderId);

            if (otherUserId) {
                const newUnreadCount = { ...conversation.unreadCount };
                newUnreadCount[otherUserId] = (newUnreadCount[otherUserId] || 0) + 1;

                await updateDoc(conversationRef, {
                    lastMessage: {
                        content,
                        senderId,
                        timestamp: now
                    },
                    unreadCount: newUnreadCount,
                    updatedAt: now
                });
            }
        }
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string, limitCount: number = 50): Promise<Message[]> {
    try {
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const q = query(
            messagesRef,
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const messages: Message[] = [];

        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as Message);
        });

        return messages.reverse(); // Return in chronological order
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

/**
 * Subscribe to real-time message updates
 */
export function subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
): Unsubscribe {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as Message);
        });
        callback(messages);
    });
}

/**
 * Subscribe to real-time conversation updates
 */
export function subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
): Unsubscribe {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const conversations: Conversation[] = [];
        snapshot.forEach((doc) => {
            conversations.push({ id: doc.id, ...doc.data() } as Conversation);
        });
        callback(conversations);
    });
}

/**
 * Mark conversation as read for a user
 */
export async function markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    try {
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);

        if (conversationSnap.exists()) {
            const conversation = conversationSnap.data() as Conversation;
            const newUnreadCount = { ...conversation.unreadCount };
            newUnreadCount[userId] = 0;

            await updateDoc(conversationRef, {
                unreadCount: newUnreadCount
            });

            // Mark all messages as read
            const messagesRef = collection(db, 'conversations', conversationId, 'messages');
            const q = query(messagesRef, where('read', '==', false), where('senderId', '!=', userId));
            const querySnapshot = await getDocs(q);

            const updatePromises = querySnapshot.docs.map(doc =>
                updateDoc(doc.ref, { read: true })
            );

            await Promise.all(updatePromises);
        }
    } catch (error) {
        console.error('Error marking conversation as read:', error);
        throw error;
    }
}
