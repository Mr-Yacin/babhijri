<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import ProfileCard from "./ProfileCard.svelte";
    import ProfileDetailModal from "./ProfileDetailModal.svelte";
    import {
        getProfiles,
        getUserLikes,
        toggleLike,
        filterProfilesByRegion,
    } from "../../lib/services/dating";
    import { authStore } from "../../lib/stores/auth";
    import type { DatingProfile } from "../../lib/types/user";
    import { MOCK_PROFILES } from "../../lib/data/mockProfiles";

    let profiles: DatingProfile[] = [];
    let filteredProfiles: DatingProfile[] = [];
    let likedProfileIds: Set<string> = new Set();
    let loading = true;
    let error = "";
    let filter = "all";
    let selectedProfile: DatingProfile | null = null;
    let currentUserId = "";

    // Subscribe to auth state
    const unsubscribe = authStore.subscribe((state) => {
        if (state.user) {
            currentUserId = state.user.uid;
        }
    });

    onMount(async () => {
        try {
            // Try to fetch profiles from Firestore
            const firestoreProfiles = await getProfiles();

            // If Firestore is empty, use mock profiles
            if (firestoreProfiles.length === 0) {
                console.log("📝 No profiles in Firestore, using mock data");
                profiles = MOCK_PROFILES;
            } else {
                profiles = firestoreProfiles;
            }

            filteredProfiles = profiles;

            // Fetch user's likes if logged in
            if (currentUserId) {
                try {
                    const likes = await getUserLikes(currentUserId);
                    likedProfileIds = new Set(likes);
                } catch (err) {
                    console.log(
                        "Could not load likes, continuing without them",
                    );
                }
            }

            loading = false;
        } catch (err) {
            console.error(
                "Error loading profiles from Firestore, using mock data:",
                err,
            );
            // Fallback to mock profiles if Firestore fails
            profiles = MOCK_PROFILES;
            filteredProfiles = profiles;
            loading = false;
        }
    });

    onDestroy(() => {
        unsubscribe();
    });

    function handleFilterChange(newFilter: string) {
        filter = newFilter;
        filteredProfiles = filterProfilesByRegion(profiles, filter);
    }

    async function handleToggleLike(event: CustomEvent) {
        const profileId = event.detail.id;

        if (!currentUserId) {
            alert("يجب تسجيل الدخول للإعجاب بالملفات الشخصية");
            return;
        }

        try {
            // Optimistic update
            const wasLiked = likedProfileIds.has(profileId);
            if (wasLiked) {
                likedProfileIds.delete(profileId);
            } else {
                likedProfileIds.add(profileId);
            }
            likedProfileIds = likedProfileIds; // Trigger reactivity

            // Update Firestore
            await toggleLike(currentUserId, profileId);
        } catch (err) {
            console.error("Error toggling like:", err);
            // Revert optimistic update on error
            const wasLiked = likedProfileIds.has(profileId);
            if (wasLiked) {
                likedProfileIds.delete(profileId);
            } else {
                likedProfileIds.add(profileId);
            }
            likedProfileIds = likedProfileIds;
            alert("حدث خطأ أثناء تحديث الإعجاب");
        }
    }

    function handleProfileClick(event: CustomEvent) {
        const profileId = event.detail.id;
        selectedProfile = profiles.find((p) => p.uid === profileId) || null;
    }

    function closeModal() {
        selectedProfile = null;
    }

    async function handleModalToggleLike() {
        if (selectedProfile) {
            await handleToggleLike({
                detail: { id: selectedProfile.uid },
            } as CustomEvent);
        }
    }
</script>

<!-- Filter Buttons -->
<div class="mb-8 flex gap-4 overflow-x-auto pb-2">
    <button
        class="px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors {filter ===
        'all'
            ? 'bg-pink-600 text-white'
            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}"
        on:click={() => handleFilterChange("all")}
    >
        الكل ({profiles.length})
    </button>
    <button
        class="px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors {filter ===
        'europe'
            ? 'bg-pink-600 text-white'
            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}"
        on:click={() => handleFilterChange("europe")}
    >
        أوروبا
    </button>
    <button
        class="px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors {filter ===
        'north-america'
            ? 'bg-pink-600 text-white'
            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}"
        on:click={() => handleFilterChange("north-america")}
    >
        أمريكا الشمالية
    </button>
</div>

<!-- Loading State -->
{#if loading}
    <div class="flex items-center justify-center py-20">
        <div class="text-center">
            <div
                class="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"
            ></div>
            <p class="text-gray-600">جاري تحميل الملفات الشخصية...</p>
        </div>
    </div>
{:else if error}
    <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-600">{error}</p>
    </div>
{:else if filteredProfiles.length === 0}
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <p class="text-gray-600 text-lg">لا توجد ملفات شخصية متاحة حالياً</p>
    </div>
{:else}
    <!-- Profile Grid -->
    <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
        {#each filteredProfiles as profile (profile.uid)}
            <ProfileCard
                id={profile.uid}
                name={profile.displayName}
                age={profile.age}
                location={profile.location}
                bio={profile.bio}
                image={profile.photos[0]}
                verified={profile.verified}
                liked={likedProfileIds.has(profile.uid)}
                on:click={handleProfileClick}
                on:toggleLike={handleToggleLike}
            />
        {/each}
    </div>
{/if}

<!-- Profile Detail Modal -->
{#if selectedProfile}
    <ProfileDetailModal
        profile={selectedProfile}
        isLiked={likedProfileIds.has(selectedProfile.uid)}
        onClose={closeModal}
        onToggleLike={handleModalToggleLike}
    />
{/if}
