<script lang="ts">
    import { onMount } from "svelte";
    import ProfileCard from "../dating/ProfileCard.svelte";
    import { getProfiles } from "../../lib/services/dating";
    import type { DatingProfile } from "../../lib/types/user";
    import { MOCK_PROFILES } from "../../lib/data/mockProfiles";

    let profiles: DatingProfile[] = [];
    let loading = true;
    let error = "";

    onMount(async () => {
        try {
            // Try to fetch profiles from Firestore
            const firestoreProfiles = await getProfiles();

            // If Firestore is empty, use mock profiles
            if (firestoreProfiles.length === 0) {
                profiles = MOCK_PROFILES.slice(0, 4);
            } else {
                // Get 4 random profiles or just the first 4
                profiles = firestoreProfiles.slice(0, 4);
            }
            loading = false;
        } catch (err) {
            console.error(
                "Error loading profiles from Firestore, using mock data:",
                err,
            );
            // Fallback to mock profiles if Firestore fails
            profiles = MOCK_PROFILES.slice(0, 4);
            loading = false;
        }
    });

    function handleProfileClick(event: CustomEvent) {
        // Redirect to app to view full profile
        window.location.href = `/app`;
    }
</script>

{#if loading}
    <div class="flex items-center justify-center py-12">
        <div class="text-center">
            <div
                class="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"
            ></div>
            <p class="text-gray-600">جاري تحميل الملفات المميزة...</p>
        </div>
    </div>
{:else if profiles.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each profiles as profile (profile.uid)}
            <div
                class="transform hover:-translate-y-1 transition-transform duration-300"
            >
                <ProfileCard
                    id={profile.uid}
                    name={profile.displayName}
                    age={profile.age}
                    location={profile.location}
                    bio={profile.bio}
                    image={profile.photos[0]}
                    verified={profile.verified}
                    liked={false}
                    showActions={false}
                    on:click={handleProfileClick}
                />
            </div>
        {/each}
    </div>

    <!-- Hidden on index page as we show CTA overlay instead -->
    <div class="mt-12 text-center hidden">
        <a
            href="/app"
            class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-pink-600 hover:bg-pink-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl"
        >
            تصفح جميع الملفات
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fill-rule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                />
            </svg>
        </a>
    </div>
{/if}
