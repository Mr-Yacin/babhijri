<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { ConversationWithProfile } from "../../lib/types/messaging";
    import { createEventDispatcher } from "svelte";

    export let conversations: ConversationWithProfile[] = [];
    export let currentUserId: string;
    export let selectedConversationId: string | null = null;

    const dispatch = createEventDispatcher();

    function selectConversation(conversationId: string) {
        dispatch("select", { conversationId });
    }

    function getOtherUserName(conversation: ConversationWithProfile): string {
        return conversation.otherUserProfile.displayName;
    }

    function getOtherUserPhoto(conversation: ConversationWithProfile): string {
        return conversation.otherUserProfile.photos[0] || "/default-avatar.png";
    }

    function getLastMessagePreview(
        conversation: ConversationWithProfile,
    ): string {
        if (!conversation.conversation.lastMessage) {
            return "ابدأ المحادثة...";
        }
        const maxLength = 50;
        const content = conversation.conversation.lastMessage.content;
        return content.length > maxLength
            ? content.substring(0, maxLength) + "..."
            : content;
    }

    function formatTimestamp(timestamp: number): string {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "الآن";
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        if (hours < 24) return `منذ ${hours} ساعة`;
        if (days < 7) return `منذ ${days} يوم`;
        return new Date(timestamp).toLocaleDateString("ar");
    }

    function getUnreadCount(conversation: ConversationWithProfile): number {
        return conversation.conversation.unreadCount[currentUserId] || 0;
    }
</script>

<div class="h-full flex flex-col bg-white border-l border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 class="text-xl font-bold text-gray-800">الرسائل</h2>
    </div>

    <!-- Conversations List -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
        {#if conversations.length === 0}
            <div class="p-8 text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-16 h-16 mx-auto text-gray-300 mb-4"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                </svg>
                <p class="text-gray-500">لا توجد محادثات بعد</p>
                <p class="text-gray-400 text-sm mt-2">
                    ابدأ بمراسلة الأشخاص الذين أعجبوا بك
                </p>
            </div>
        {:else}
            {#each conversations as conv (conv.conversation.id)}
                <button
                    class="w-full text-right p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors {selectedConversationId ===
                    conv.conversation.id
                        ? 'bg-pink-50 border-r-4 border-r-pink-500'
                        : ''}"
                    on:click={() => selectConversation(conv.conversation.id)}
                >
                    <div class="flex items-center gap-3">
                        <!-- Avatar -->
                        <div class="relative flex-shrink-0">
                            <img
                                src={getOtherUserPhoto(conv)}
                                alt={getOtherUserName(conv)}
                                class="w-14 h-14 rounded-full object-cover"
                            />
                            {#if getUnreadCount(conv) > 0}
                                <div
                                    class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                    {getUnreadCount(conv)}
                                </div>
                            {/if}
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-1">
                                <h3
                                    class="font-semibold text-gray-800 truncate"
                                >
                                    {getOtherUserName(conv)}
                                </h3>
                                {#if conv.conversation.lastMessage}
                                    <span class="text-xs text-gray-500">
                                        {formatTimestamp(
                                            conv.conversation.lastMessage
                                                .timestamp,
                                        )}
                                    </span>
                                {/if}
                            </div>
                            <p
                                class="text-sm text-gray-600 truncate {getUnreadCount(
                                    conv,
                                ) > 0
                                    ? 'font-semibold'
                                    : ''}"
                            >
                                {getLastMessagePreview(conv)}
                            </p>
                        </div>
                    </div>
                </button>
            {/each}
        {/if}
    </div>
</div>
