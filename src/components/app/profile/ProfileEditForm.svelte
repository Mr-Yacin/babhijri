<script lang="ts">
    import { onMount } from "svelte";
    import { authStore } from "../../../lib/stores/auth";
    import { ProfileService } from "../../../lib/services/profile";
    import type {
        ProfileFormData,
        DatingProfile,
    } from "../../../lib/types/user";

    // Reuse step components from the create wizard
    import BasicInfoStep from "./create/steps/BasicInfoStep.svelte";
    import LocationStep from "./create/steps/LocationStep.svelte";
    import AboutStep from "./create/steps/AboutStep.svelte";
    import PhotoUploadStep from "./create/steps/PhotoUploadStep.svelte";

    let isLoading = true;
    let isSaving = false;
    let error = "";
    let successMessage = "";
    let activeTab = "basic"; // basic, location, about, photos

    let formData: ProfileFormData = {
        displayName: "",
        age: 18,
        gender: "male",
        city: "",
        country: "",
        bio: "",
        interests: [],
        education: "",
        occupation: "",
        lookingFor: "marriage",
        maritalStatus: "single",
        hasChildren: false,
        religion: "Islam",
        languages: ["Arabic"],
        height: undefined,
        photos: [],
    };

    onMount(() => {
        const unsubscribe = authStore.subscribe(async (state) => {
            if (state.user) {
                try {
                    const profile = await ProfileService.getProfile(
                        state.user.uid,
                    );
                    if (profile) {
                        // Map profile to form data
                        formData = {
                            displayName: profile.displayName,
                            age: profile.age,
                            gender: profile.gender,
                            city: profile.city,
                            country: profile.country,
                            bio: profile.bio,
                            interests: profile.interests,
                            education: profile.education,
                            occupation: profile.occupation,
                            lookingFor: profile.lookingFor,
                            maritalStatus: profile.maritalStatus,
                            hasChildren: profile.hasChildren,
                            religion: profile.religion,
                            languages: profile.languages,
                            height: profile.height,
                            photos: profile.photos || [],
                        };
                    }
                } catch (e) {
                    console.error("Error loading profile:", e);
                    error = "فشل تحميل بيانات الملف الشخصي";
                } finally {
                    isLoading = false;
                }
            } else if (!state.loading) {
                // Not logged in
                window.location.href = "/app/login";
            }
        });
        return unsubscribe;
    });

    async function handleSave() {
        if (!$authStore.user) return;

        isSaving = true;
        error = "";
        successMessage = "";

        try {
            await ProfileService.updateProfile($authStore.user.uid, formData);
            successMessage = "تم حفظ التغييرات بنجاح";

            // Clear success message after 3 seconds
            setTimeout(() => {
                successMessage = "";
            }, 3000);
        } catch (e: any) {
            console.error(e);
            error = "فشل حفظ التغييرات";
        } finally {
            isSaving = false;
        }
    }

    function handleUpdate(event: CustomEvent<Partial<ProfileFormData>>) {
        formData = { ...formData, ...event.detail };
    }

    async function handlePhotoUpdate(
        event: CustomEvent<Partial<ProfileFormData>>,
    ) {
        formData = { ...formData, ...event.detail };
        // Auto-save for photos to prevent data loss
        await handleSave();
    }

    // Mock next/back for reused components (they expect these events)
    function noop() {}
</script>

<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    {#if isLoading}
        <div class="p-12 text-center">
            <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"
            ></div>
            <p class="mt-4 text-gray-500">جاري تحميل البيانات...</p>
        </div>
    {:else}
        <div class="flex flex-col md:flex-row min-h-[600px]">
            <!-- Sidebar Tabs -->
            <div class="w-full md:w-64 bg-gray-50 border-l border-gray-100 p-4">
                <nav class="space-y-1">
                    <button
                        on:click={() => (activeTab = "basic")}
                        class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors {activeTab ===
                        'basic'
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-600 hover:bg-gray-100'}"
                    >
                        المعلومات الأساسية
                    </button>
                    <button
                        on:click={() => (activeTab = "location")}
                        class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors {activeTab ===
                        'location'
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-600 hover:bg-gray-100'}"
                    >
                        الموقع والعمل
                    </button>
                    <button
                        on:click={() => (activeTab = "about")}
                        class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors {activeTab ===
                        'about'
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-600 hover:bg-gray-100'}"
                    >
                        نبذة عنك
                    </button>
                    <button
                        on:click={() => (activeTab = "photos")}
                        class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors {activeTab ===
                        'photos'
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-600 hover:bg-gray-100'}"
                    >
                        الصور
                    </button>
                </nav>
            </div>

            <!-- Content Area -->
            <div class="flex-1 p-8">
                {#if error}
                    <div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                {/if}

                {#if successMessage}
                    <div class="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                        {successMessage}
                    </div>
                {/if}

                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-900">
                        {#if activeTab === "basic"}المعلومات الأساسية
                        {:else if activeTab === "location"}الموقع والعمل
                        {:else if activeTab === "about"}نبذة عنك
                        {:else if activeTab === "photos"}الصور
                        {/if}
                    </h2>
                </div>

                <!-- We wrap components to hide their internal navigation buttons via CSS or just ignore their events -->
                <div class="edit-form-content">
                    {#if activeTab === "basic"}
                        <BasicInfoStep
                            {formData}
                            on:update={handleUpdate}
                            on:next={noop}
                        />
                    {:else if activeTab === "location"}
                        <LocationStep
                            {formData}
                            on:update={handleUpdate}
                            on:next={noop}
                            on:back={noop}
                        />
                    {:else if activeTab === "about"}
                        <AboutStep
                            {formData}
                            on:update={handleUpdate}
                            on:next={noop}
                            on:back={noop}
                        />
                    {:else if activeTab === "photos"}
                        <PhotoUploadStep
                            {formData}
                            isLoading={isSaving}
                            on:update={handlePhotoUpdate}
                            on:submit={handleSave}
                            on:back={noop}
                        />
                    {/if}
                </div>

                <!-- Global Save Button (except for photos tab which has its own logic in the component, but we can override or add an extra one) -->
                {#if activeTab !== "photos"}
                    <div
                        class="mt-8 pt-6 border-t border-gray-100 flex justify-end"
                    >
                        <button
                            on:click={handleSave}
                            disabled={isSaving}
                            class="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    /* Hide the navigation buttons inside the steps since we have our own save button */
    :global(.edit-form-content button:not([type="button"]):not(.bg-red-500)) {
        display: none;
    }

    /* But show the photo upload button and delete buttons */
    :global(.edit-form-content .relative.aspect-square button) {
        display: block !important;
    }

    /* Show the "Add Photo" label/button */
    :global(.edit-form-content label.cursor-pointer) {
        display: flex !important;
    }
</style>
