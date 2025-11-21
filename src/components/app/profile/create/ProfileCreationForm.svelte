<script lang="ts">
    import { onMount } from "svelte";
    import { authStore } from "../../../../lib/stores/auth";
    import { ProfileService } from "../../../../lib/services/profile";
    import type { ProfileFormData } from "../../../../lib/types/user";

    import BasicInfoStep from "./steps/BasicInfoStep.svelte";
    import LocationStep from "./steps/LocationStep.svelte";
    import AboutStep from "./steps/AboutStep.svelte";
    import PhotoUploadStep from "./steps/PhotoUploadStep.svelte";

    let currentStep = 1;
    let loading = false;
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
        religion: "muslim",
        languages: ["العربية"],
        photos: [],
    };

    onMount(() => {
        // Load draft from localStorage if exists
        const draft = localStorage.getItem("profile_creation_draft");
        if (draft) {
            try {
                formData = { ...formData, ...JSON.parse(draft) };
            } catch (e) {
                console.error("Error loading draft", e);
            }
        }

        // Pre-fill display name from auth if available
        if ($authStore.user?.displayName && !formData.displayName) {
            formData.displayName = $authStore.user.displayName;
        }
    });

    // Save draft on change
    $: {
        if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(
                "profile_creation_draft",
                JSON.stringify(formData),
            );
        }
    }

    const nextStep = () => {
        currentStep++;
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const prevStep = () => {
        currentStep--;
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submitForm = async () => {
        if (!$authStore.user) return;

        loading = true;
        error = "";

        try {
            await ProfileService.createProfile($authStore.user.uid, formData);
            localStorage.removeItem("profile_creation_draft");
            window.location.href = "/app/profile";
        } catch (err: any) {
            console.error("Error creating profile:", err);
            error = "حدث خطأ أثناء إنشاء الملف الشخصي. يرجى المحاولة مرة أخرى.";
        } finally {
            loading = false;
        }
    };
</script>

<div
    class="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
>
    <!-- Background Elements -->
    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl -z-10 opacity-30 pointer-events-none"
    >
        <div
            class="absolute top-20 left-20 w-72 h-72 bg-teal-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
        ></div>
        <div
            class="absolute top-20 right-20 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
        ></div>
        <div
            class="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
        ></div>
    </div>

    <div class="max-w-2xl mx-auto w-full">
        <!-- Header -->
        <div class="text-center mb-10">
            <h1
                class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600 mb-2"
            >
                أكمل ملفك الشخصي
            </h1>
            <p class="text-gray-600 dark:text-gray-300 text-lg">
                خطوات بسيطة تفصلك عن العثور على شريك حياتك
            </p>
        </div>

        <!-- Progress Steps -->
        <div class="mb-8 relative">
            <div
                class="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full -z-10"
            ></div>
            <div
                class="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-teal-500 to-purple-600 -translate-y-1/2 rounded-full -z-10 transition-all duration-500"
                style="width: {((currentStep - 1) / 3) * 100}%"
            ></div>

            <div class="flex justify-between w-full">
                {#each [1, 2, 3, 4] as step}
                    <div class="flex flex-col items-center gap-2">
                        <div
                            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4
                            {currentStep >= step
                                ? 'bg-white border-teal-500 text-teal-600 shadow-lg scale-110'
                                : 'bg-gray-100 border-white text-gray-400 dark:bg-gray-800 dark:border-gray-700'}"
                        >
                            {#if currentStep > step}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            {:else}
                                {step}
                            {/if}
                        </div>
                        <span
                            class="text-xs font-medium {currentStep >= step
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-gray-400'}"
                        >
                            {#if step === 1}الأساسية
                            {:else if step === 2}الموقع
                            {:else if step === 3}عنك
                            {:else if step === 4}الصور
                            {/if}
                        </span>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Form Card -->
        <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20 dark:border-gray-700/50 relative overflow-hidden"
        >
            <!-- Decorative top line -->
            <div
                class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500"
            ></div>

            {#if error}
                <div
                    class="mb-6 p-4 bg-red-50/90 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3 animate-shake"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    {error}
                </div>
            {/if}

            {#if loading}
                <div class="flex flex-col items-center justify-center py-20">
                    <div class="relative w-20 h-20">
                        <div
                            class="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"
                        ></div>
                        <div
                            class="absolute top-0 left-0 w-full h-full border-4 border-teal-600 rounded-full border-t-transparent animate-spin"
                        ></div>
                    </div>
                    <p
                        class="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse"
                    >
                        جاري إنشاء ملفك الشخصي...
                    </p>
                </div>
            {:else}
                <div class="transition-all duration-500 ease-in-out">
                    {#key currentStep}
                        <div class="animate-fade-in">
                            {#if currentStep === 1}
                                <BasicInfoStep {formData} {nextStep} />
                            {:else if currentStep === 2}
                                <LocationStep
                                    {formData}
                                    {nextStep}
                                    {prevStep}
                                />
                            {:else if currentStep === 3}
                                <AboutStep {formData} {nextStep} {prevStep} />
                            {:else if currentStep === 4}
                                <PhotoUploadStep
                                    {formData}
                                    {submitForm}
                                    {prevStep}
                                />
                            {/if}
                        </div>
                    {/key}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .animate-blob {
        animation: blob 7s infinite;
    }
    .animation-delay-2000 {
        animation-delay: 2s;
    }
    .animation-delay-4000 {
        animation-delay: 4s;
    }
    @keyframes blob {
        0% {
            transform: translate(0px, 0px) scale(1);
        }
        33% {
            transform: translate(30px, -50px) scale(1.1);
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
        }
        100% {
            transform: translate(0px, 0px) scale(1);
        }
    }
</style>
