<script lang="ts">
    import { onMount } from "svelte";
    import { authStore } from "../../lib/stores/auth";
    import ConversationList from "./ConversationList.svelte";
    import ChatInterface from "./ChatInterface.svelte";
    import {
        getUserConversations,
        getOrCreateConversation,
        subscribeToConversations,
    } from "../../lib/services/messaging";
    import { getProfileById } from "../../lib/services/dating";
    import type { ConversationWithProfile } from "../../lib/types/messaging";
    import type { DatingProfile } from "../../lib/types/user";

    let currentUserId = "";
    let currentUserName = "";
    let currentUserPhoto = "";
    let conversations: ConversationWithProfile[] = [];
    let selectedConversationId: string | null = null;
    let selectedProfile: DatingProfile | null = null;
    let loading = true;
    let conversationsUnsubscribe: (() => void) | null = null;
    let showChatOnMobile = false;

    onMount(async () => {
        const authUnsubscribe = authStore.subscribe(async (state) => {
            if (!state.loading && !state.isLoggedIn) {
                window.location.href = "/app/login";
                return;
            }

            if (state.user) {
                currentUserId = state.user.uid;

                // Fetch profile separately
                const profile = await getProfileById(currentUserId);
                if (profile) {
                    currentUserName = profile.displayName;
                    currentUserPhoto = profile.photos?.[0] || "";
                } else {
                    currentUserName =
                        state.user.email?.split("@")[0] || "مستخدم";
                }

                await loadConversations();

                // Check if we should open a specific conversation
                const urlParams = new URLSearchParams(window.location.search);
                const profileId = urlParams.get("profile");

                if (profileId && profileId !== currentUserId) {
                    await openConversationWithProfile(profileId);
                }
            }
        });

        return () => {
            authUnsubscribe();
            if (conversationsUnsubscribe) {
                conversationsUnsubscribe();
            }
        };
    });

    async function loadConversations() {
        try {
            // Load initial conversations
            conversations = await getUserConversations(currentUserId);
            loading = false;

            // Subscribe to real-time updates
            conversationsUnsubscribe = subscribeToConversations(
                currentUserId,
                async (updatedConversations) => {
                    // Map conversations to include profile data
                    const conversationsWithProfiles: ConversationWithProfile[] =
                        [];
                    for (const conv of updatedConversations) {
                        const otherUserId = conv.participants.find(
                            (id) => id !== currentUserId,
                        );
                        if (otherUserId) {
                            const profile = await getProfileById(otherUserId);
                            if (profile) {
                                conversationsWithProfiles.push({
                                    conversation: conv,
                                    otherUserProfile: profile,
                                });
                            }
                        }
                    }
                    conversations = conversationsWithProfiles;
                },
            );
        } catch (error) {
            console.error("Error loading conversations:", error);
            loading = false;
        }
    }

    async function openConversationWithProfile(profileId: string) {
        try {
            const profile = await getProfileById(profileId);
            if (!profile) {
                alert("الملف الشخصي غير موجود");
                return;
            }

            const conversationId = await getOrCreateConversation(
                currentUserId,
                profileId,
                currentUserName,
                profile.displayName,
                currentUserPhoto,
                profile.photos?.[0],
            );

            selectedConversationId = conversationId;
            selectedProfile = profile;
            showChatOnMobile = true;

            // Reload conversations to include new one
            await loadConversations();
        } catch (error) {
            console.error("Error opening conversation:", error);
            alert("حدث خطأ أثناء فتح المحادثة");
        }
    }

    function handleSelectConversation(event: CustomEvent) {
        const conversationId = event.detail.conversationId;
        selectedConversationId = conversationId;
        showChatOnMobile = true;

        const conv = conversations.find(
            (c) => c.conversation.id === conversationId,
        );
        if (conv) {
            selectedProfile = conv.otherUserProfile;
        }
    }

    function handleBackToConversations() {
        showChatOnMobile = false;
    }
</script>

{#if loading}
    <div class="flex items-center justify-center h-full">
        <div class="text-center">
            <div
                class="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"
            ></div>
            <p class="text-gray-600">جاري تحميل المحادثات...</p>
        </div>
    </div>
{:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 h-full overflow-hidden">
        <!-- Conversation List -->
        <div
            class="lg:col-span-1 border-r border-gray-200 h-full overflow-hidden {showChatOnMobile
                ? 'hidden lg:block'
                : 'block'}"
        >
            <ConversationList
                {conversations}
                {currentUserId}
                {selectedConversationId}
                on:select={handleSelectConversation}
            />
        </div>

        <!-- Chat Interface -->
        <div
            class="lg:col-span-2 h-full overflow-hidden {showChatOnMobile
                ? 'block'
                : 'hidden lg:block'}"
        >
            {#if selectedConversationId && selectedProfile}
                {#key selectedConversationId}
                    <ChatInterface
                        conversationId={selectedConversationId}
                        {currentUserId}
                        {currentUserName}
                        {currentUserPhoto}
                        otherUserProfile={selectedProfile}
                        on:back={handleBackToConversations}
                    />
                {/key}
            {:else}
                <div class="flex items-center justify-center h-full bg-gray-50">
                    <div class="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-20 h-20 mx-auto text-gray-300 mb-4"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                            />
                        </svg>
                        <p class="text-gray-500 text-lg">
                            اختر محادثة لبدء المراسلة
                        </p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}
