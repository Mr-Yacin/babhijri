<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { authStore } from "../../../lib/stores/auth";
    import { ProfileService } from "../../../lib/services/profile";
    import type { ProfileFormData } from "../../../lib/types/user";

    // Steps
    import BasicInfoStep from "./steps/BasicInfoStep.svelte";
    import LocationStep from "./steps/LocationStep.svelte";
    import AboutStep from "./steps/AboutStep.svelte";
    import PhotoUploadStep from "./steps/PhotoUploadStep.svelte";

    let currentStep = 1;
    let totalSteps = 4;
    let isLoading = false;
    let error = "";

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

    // Load user data if available
    onMount(() => {
        const unsubscribe = authStore.subscribe(async (state) => {
            if (state.user) {
                formData.displayName = state.user.displayName || "";

                // Check if profile already exists
                const exists = await ProfileService.profileExists(
                    state.user.uid,
                );
                if (exists) {
                    // Redirect to profile or edit page?
                    // For now, let's just log it
                    console.log("Profile already exists");
                }
            }
        });
        return unsubscribe;
    });

    function nextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
        }
    }

    async function handleSubmit() {
        if (!$authStore.user) return;

        isLoading = true;
        error = "";

        try {
            await ProfileService.createProfile($authStore.user.uid, formData);
            window.location.href = "/app/profile";
        } catch (e: any) {
            console.error(e);
            error = e.message || "حدث خطأ أثناء إنشاء الملف الشخصي";
        } finally {
            isLoading = false;
        }
    }

    function handleUpdate(event: CustomEvent<Partial<ProfileFormData>>) {
        formData = { ...formData, ...event.detail };
    }
</script>

<div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Progress Bar -->
    <div class="bg-gray-100 h-2 w-full">
        <div
            class="bg-teal-600 h-full transition-all duration-300 ease-in-out"
            style="width: {(currentStep / totalSteps) * 100}%"
        ></div>
    </div>

    <div class="p-8">
        <div class="mb-8 text-center">
            <h2 class="text-2xl font-bold text-gray-800">
                {#if currentStep === 1}المعلومات الأساسية
                {:else if currentStep === 2}الموقع والعمل
                {:else if currentStep === 3}نبذة عنك
                {:else if currentStep === 4}الصور
                {/if}
            </h2>
            <p class="text-gray-500 mt-2">
                الخطوة {currentStep} من {totalSteps}
            </p>
        </div>

        {#if error}
            <div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">
                {error}
            </div>
        {/if}

        <div class="min-h-[400px]">
            {#if currentStep === 1}
                <div in:fade>
                    <BasicInfoStep
                        {formData}
                        on:update={handleUpdate}
                        on:next={nextStep}
                    />
                </div>
            {:else if currentStep === 2}
                <div in:fade>
                    <LocationStep
                        {formData}
                        on:update={handleUpdate}
                        on:next={nextStep}
                        on:back={prevStep}
                    />
                </div>
            {:else if currentStep === 3}
                <div in:fade>
                    <AboutStep
                        {formData}
                        on:update={handleUpdate}
                        on:next={nextStep}
                        on:back={prevStep}
                    />
                </div>
            {:else if currentStep === 4}
                <div in:fade>
                    <PhotoUploadStep
                        {formData}
                        {isLoading}
                        on:update={handleUpdate}
                        on:submit={handleSubmit}
                        on:back={prevStep}
                    />
                </div>
            {/if}
        </div>
    </div>
</div>
