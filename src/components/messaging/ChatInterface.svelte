<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import type { Message } from "../../lib/types/messaging";
    import type { DatingProfile } from "../../lib/types/user";
    import {
        getMessages,
        sendMessage,
        subscribeToMessages,
        markConversationAsRead,
    } from "../../lib/services/messaging";

    export let conversationId: string;
    export let currentUserId: string;
    export let currentUserName: string;
    export let currentUserPhoto: string = "";
    export let otherUserProfile: DatingProfile;

    const dispatch = createEventDispatcher();

    let messages: Message[] = [];
    let newMessageContent = "";
    let loading = true;
    let sending = false;
    let messagesContainer: HTMLDivElement;
    let unsubscribe: (() => void) | null = null;

    onMount(async () => {
        try {
            // Subscribe to real-time messages
            unsubscribe = subscribeToMessages(conversationId, (msgs) => {
                messages = msgs;
                loading = false;
                scrollToBottom();
            });

            // Mark conversation as read
            await markConversationAsRead(conversationId, currentUserId);
        } catch (error) {
            console.error("Error loading messages:", error);
            loading = false;
        }
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    async function handleSendMessage() {
        if (!newMessageContent.trim() || sending) return;

        const content = newMessageContent.trim();
        newMessageContent = "";
        sending = true;

        try {
            await sendMessage(
                conversationId,
                currentUserId,
                currentUserName,
                content,
                currentUserPhoto,
            );
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
            alert("فشل إرسال الرسالة. الرجاء المحاولة مرة أخرى.");
            newMessageContent = content;
        } finally {
            sending = false;
        }
    }

    function scrollToBottom() {
        setTimeout(() => {
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 100);
    }

    function formatMessageTime(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("ar", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function handleKeyPress(e: KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }
</script>

<div class="h-full flex flex-col bg-white">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 bg-white shadow-sm">
        <div class="flex items-center gap-3">
            <button
                on:click={() => dispatch("back")}
                class="lg:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="العودة للمحادثات"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                </svg>
            </button>

            <img
                src={otherUserProfile.photos[0] || "/default-avatar.png"}
                alt={otherUserProfile.displayName}
                class="w-12 h-12 rounded-full object-cover"
            />
            <div class="flex-1">
                <h2 class="font-bold text-gray-800">
                    {otherUserProfile.displayName}
                </h2>
                <p class="text-sm text-gray-500">
                    {otherUserProfile.location}
                </p>
            </div>
        </div>
    </div>

    <!-- Messages -->
    <div
        bind:this={messagesContainer}
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
    >
        {#if loading}
            <div class="flex items-center justify-center h-full">
                <div
                    class="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"
                ></div>
            </div>
        {:else if messages.length === 0}
            <div class="flex flex-col items-center justify-center h-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-16 h-16 text-gray-300 mb-4"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                </svg>
                <p class="text-gray-500">ابدأ المحادثة بإرسال رسالة</p>
            </div>
        {:else}
            {#each messages as message (message.id)}
                <div
                    class="flex {message.senderId === currentUserId
                        ? 'justify-end'
                        : 'justify-start'}"
                >
                    <div
                        class="max-w-[70%] {message.senderId === currentUserId
                            ? 'bg-pink-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'} rounded-2xl px-4 py-2 shadow-sm"
                    >
                        <p class="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                        </p>
                        <p
                            class="text-xs mt-1 {message.senderId ===
                            currentUserId
                                ? 'text-pink-100'
                                : 'text-gray-500'}"
                        >
                            {formatMessageTime(message.timestamp)}
                        </p>
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <!-- Message Input -->
    <div class="p-4 border-t border-gray-200 bg-white">
        <div class="flex gap-2">
            <input
                type="text"
                bind:value={newMessageContent}
                on:keypress={handleKeyPress}
                placeholder="اكتب رسالة..."
                class="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                disabled={sending}
            />
            <button
                on:click={handleSendMessage}
                disabled={!newMessageContent.trim() || sending}
                class="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {#if sending}
                    <div
                        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    ></div>
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
                        />
                    </svg>
                {/if}
                إرسال
            </button>
        </div>
    </div>
</div>
