<script lang="ts">
    import { onMount } from "svelte";
    import type { DatingProfile } from "../../lib/types/user";
    import { getProfileById } from "../../lib/services/dating";
    import {
        updateProfile,
        deleteProfile,
    } from "../../lib/services/adminProfiles";

    export let profileId: string;

    let profile: DatingProfile | null = null;
    let loading = true;
    let saving = false;
    let error = "";

    // Form data
    let formData = {
        displayName: "",
        age: 25,
        location: "",
        city: "",
        country: "",
        bio: "",
        interests: [] as string[],
        education: "",
        occupation: "",
        photos: [] as string[],
        verified: false,
        lookingFor: "marriage" as "marriage" | "friendship",
        maritalStatus: "single" as "single" | "divorced" | "widowed",
        hasChildren: false,
        religion: "",
        languages: [] as string[],
        height: 165,
        isActive: true,
    };

    let newInterest = "";
    let newLanguage = "";
    let newPhoto = "";

    onMount(async () => {
        await loadProfile();
    });

    async function loadProfile() {
        try {
            loading = true;
            profile = await getProfileById(profileId);

            if (profile) {
                // Populate form
                formData = {
                    displayName: profile.displayName,
                    age: profile.age,
                    location: profile.location,
                    city: profile.city,
                    country: profile.country,
                    bio: profile.bio,
                    interests: [...profile.interests],
                    education: profile.education,
                    occupation: profile.occupation,
                    photos: [...profile.photos],
                    verified: profile.verified,
                    lookingFor: profile.lookingFor,
                    maritalStatus: profile.maritalStatus,
                    hasChildren: profile.hasChildren,
                    religion: profile.religion,
                    languages: [...profile.languages],
                    height: profile.height,
                    isActive: profile.isActive,
                };
            }

            loading = false;
        } catch (err: any) {
            error = err.message || "Failed to load profile";
            loading = false;
        }
    }

    async function handleSave() {
        try {
            saving = true;
            await updateProfile(profileId, formData);
            alert("Profile updated successfully!");
            saving = false;
        } catch (err: any) {
            alert("Failed to update profile: " + err.message);
            saving = false;
        }
    }

    async function handleDelete() {
        if (
            !confirm(
                `Are you sure you want to delete ${formData.displayName}'s profile? This action cannot be undone.`,
            )
        ) {
            return;
        }

        try {
            await deleteProfile(profileId);
            alert("Profile deleted successfully!");
            window.location.href = "/app/admin/profiles";
        } catch (err: any) {
            alert("Failed to delete profile: " + err.message);
        }
    }

    function addInterest() {
        if (newInterest.trim()) {
            formData.interests = [...formData.interests, newInterest.trim()];
            newInterest = "";
        }
    }

    function removeInterest(index: number) {
        formData.interests = formData.interests.filter((_, i) => i !== index);
    }

    function addLanguage() {
        if (newLanguage.trim()) {
            formData.languages = [...formData.languages, newLanguage.trim()];
            newLanguage = "";
        }
    }

    function removeLanguage(index: number) {
        formData.languages = formData.languages.filter((_, i) => i !== index);
    }

    function addPhoto() {
        if (newPhoto.trim()) {
            formData.photos = [...formData.photos, newPhoto.trim()];
            newPhoto = "";
        }
    }

    function removePhoto(index: number) {
        formData.photos = formData.photos.filter((_, i) => i !== index);
    }

    function goBack() {
        window.location.href = "/app/admin/profiles";
    }
</script>

<div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
            <button
                on:click={goBack}
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                ← Back
            </button>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <p class="text-gray-600 mt-1">ID: {profileId}</p>
            </div>
        </div>

        <button
            on:click={handleDelete}
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
            Delete Profile
        </button>
    </div>

    {#if loading}
        <div class="text-center py-12">
            <div
                class="inline-block w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"
            ></div>
            <p class="text-gray-600 mt-4">Loading profile...</p>
        </div>
    {:else if error}
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p class="text-red-600">{error}</p>
        </div>
    {:else}
        <form on:submit|preventDefault={handleSave} class="space-y-6">
            <!-- Photos Section -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h3 class="text-lg font-bold text-gray-900 mb-4">Photos</h3>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {#each formData.photos as photo, index}
                        <div class="relative group">
                            <img
                                src={photo}
                                alt="Profile {index + 1}"
                                class="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                on:click={() => removePhoto(index)}
                                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ✕
                            </button>
                        </div>
                    {/each}
                </div>

                <div class="flex gap-2">
                    <input
                        type="url"
                        bind:value={newPhoto}
                        placeholder="Add photo URL..."
                        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                        type="button"
                        on:click={addPhoto}
                        class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                    >
                        Add Photo
                    </button>
                </div>
            </div>

            <!-- Basic Info -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h3 class="text-lg font-bold text-gray-900 mb-4">
                    Basic Information
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            for="name"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Name</label
                        >
                        <input
                            id="name"
                            type="text"
                            bind:value={formData.displayName}
                            required
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label
                            for="age"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Age</label
                        >
                        <input
                            id="age"
                            type="number"
                            bind:value={formData.age}
                            min="18"
                            max="100"
                            required
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label
                            for="city"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >City</label
                        >
                        <input
                            id="city"
                            type="text"
                            bind:value={formData.city}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label
                            for="country"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Country</label
                        >
                        <input
                            id="country"
                            type="text"
                            bind:value={formData.country}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div class="md:col-span-2">
                        <label
                            for="location"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Location</label
                        >
                        <input
                            id="location"
                            type="text"
                            bind:value={formData.location}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div class="md:col-span-2">
                        <label
                            for="bio"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Bio</label
                        >
                        <textarea
                            id="bio"
                            bind:value={formData.bio}
                            rows="4"
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        ></textarea>
                    </div>

                    <div>
                        <label
                            for="education"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Education</label
                        >
                        <input
                            id="education"
                            type="text"
                            bind:value={formData.education}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label
                            for="occupation"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Occupation</label
                        >
                        <input
                            id="occupation"
                            type="text"
                            bind:value={formData.occupation}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label
                            for="religion"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Religion</label
                        >
                        <input
                            id="religion"
                            type="text"
                            bind:value={formData.religion}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label
                            for="height"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Height (cm)</label
                        >
                        <input
                            id="height"
                            type="number"
                            bind:value={formData.height}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <!-- Status Toggles -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h3 class="text-lg font-bold text-gray-900 mb-4">Status</h3>

                <div class="space-y-4">
                    <label class="flex items-center gap-3">
                        <input
                            type="checkbox"
                            bind:checked={formData.isActive}
                            class="w-5 h-5 text-pink-600 rounded"
                        />
                        <span class="text-gray-700">Active</span>
                    </label>

                    <label class="flex items-center gap-3">
                        <input
                            type="checkbox"
                            bind:checked={formData.verified}
                            class="w-5 h-5 text-pink-600 rounded"
                        />
                        <span class="text-gray-700">Verified</span>
                    </label>

                    <label class="flex items-center gap-3">
                        <input
                            type="checkbox"
                            bind:checked={formData.hasChildren}
                            class="w-5 h-5 text-pink-600 rounded"
                        />
                        <span class="text-gray-700">Has Children</span>
                    </label>
                </div>
            </div>

            <!-- Interests -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h3 class="text-lg font-bold text-gray-900 mb-4">Interests</h3>

                <div class="flex flex-wrap gap-2 mb-4">
                    {#each formData.interests as interest, index}
                        <span
                            class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm flex items-center gap-2"
                        >
                            {interest}
                            <button
                                type="button"
                                on:click={() => removeInterest(index)}
                                class="hover:text-pink-900">✕</button
                            >
                        </span>
                    {/each}
                </div>

                <div class="flex gap-2">
                    <input
                        type="text"
                        bind:value={newInterest}
                        placeholder="Add interest..."
                        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                        type="button"
                        on:click={addInterest}
                        class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                    >
                        Add
                    </button>
                </div>
            </div>

            <!-- Languages -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h3 class="text-lg font-bold text-gray-900 mb-4">Languages</h3>

                <div class="flex flex-wrap gap-2 mb-4">
                    {#each formData.languages as language, index}
                        <span
                            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                        >
                            {language}
                            <button
                                type="button"
                                on:click={() => removeLanguage(index)}
                                class="hover:text-blue-900">✕</button
                            >
                        </span>
                    {/each}
                </div>

                <div class="flex gap-2">
                    <input
                        type="text"
                        bind:value={newLanguage}
                        placeholder="Add language..."
                        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                        type="button"
                        on:click={addLanguage}
                        class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                    >
                        Add
                    </button>
                </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end gap-4">
                <button
                    type="button"
                    on:click={goBack}
                    class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    class="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-400"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    {/if}
</div>
