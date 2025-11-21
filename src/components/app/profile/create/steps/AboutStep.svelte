<script lang="ts">
    import type { ProfileFormData } from "../../../../../lib/types/user";

    export let formData: ProfileFormData;
    export let nextStep: () => void;
    export let prevStep: () => void;

    let interestInput = "";
    let errors = {
        bio: "",
        interests: "",
        languages: "",
    };

    const predefinedInterests = [
        "القراءة",
        "السفر",
        "الرياضة",
        "الطبخ",
        "الموسيقى",
        "الأفلام",
        "الفن",
        "التصوير",
        "الكتابة",
        "البرمجة",
        "الألعاب",
        "الطبيعة",
        "الحيوانات",
        "التطوع",
    ];

    const addInterest = (interest: string) => {
        if (interest.trim() && !formData.interests.includes(interest.trim())) {
            formData.interests = [...formData.interests, interest.trim()];
            interestInput = "";
            if (errors.interests) errors.interests = "";
        }
    };

    const handleAddCustomInterest = () => {
        addInterest(interestInput);
    };

    const removeInterest = (interest: string) => {
        formData.interests = formData.interests.filter((i) => i !== interest);
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddCustomInterest();
        }
    };

    const toggleInterest = (interest: string) => {
        if (formData.interests.includes(interest)) {
            removeInterest(interest);
        } else {
            addInterest(interest);
        }
    };

    const validate = () => {
        let isValid = true;
        errors = {
            bio: "",
            interests: "",
            languages: "",
        };

        if (!formData.bio?.trim()) {
            errors.bio = "النبذة الشخصية مطلوبة";
            isValid = false;
        } else if (formData.bio.length < 10) {
            errors.bio = "النبذة قصيرة جداً، يرجى كتابة المزيد";
            isValid = false;
        }

        if (formData.interests.length === 0) {
            errors.interests = "يرجى اختيار اهتمام واحد على الأقل";
            isValid = false;
        }

        if (formData.languages.length === 0) {
            errors.languages = "يرجى اختيار لغة واحدة على الأقل";
            isValid = false;
        }

        return isValid;
    };

    const handleNext = () => {
        if (validate()) {
            nextStep();
        }
    };
</script>

<div class="space-y-6 animate-fade-in">
    <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">عنك</h2>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
            حدثنا عن اهتماماتك وشخصيتك
        </p>
    </div>

    <div class="space-y-5">
        <div>
            <label
                for="bio"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >نبذة عنك</label
            >
            <textarea
                id="bio"
                bind:value={formData.bio}
                rows="4"
                class="w-full px-4 py-2.5 rounded-lg border {errors.bio
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors resize-none"
                placeholder="اكتب نبذة قصيرة عن نفسك..."
            ></textarea>
            <div class="flex justify-between mt-1">
                {#if errors.bio}
                    <p class="text-sm text-red-500">{errors.bio}</p>
                {:else}
                    <span></span>
                {/if}
                <p class="text-xs text-gray-500 text-left">
                    {formData.bio?.length || 0}/500
                </p>
            </div>
        </div>

        <div>
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >الاهتمامات</label
            >

            <!-- Predefined Interests -->
            <div class="flex flex-wrap gap-2 mb-4">
                {#each predefinedInterests as interest}
                    <button
                        type="button"
                        on:click={() => toggleInterest(interest)}
                        class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border {formData.interests.includes(
                            interest,
                        )
                            ? 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700'}"
                    >
                        {interest}
                    </button>
                {/each}
            </div>

            <label
                for="interests"
                class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                >أضف اهتمامات أخرى</label
            >
            <div class="flex gap-2 mb-2">
                <input
                    type="text"
                    id="interests"
                    bind:value={interestInput}
                    on:keydown={handleKeydown}
                    class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="أضف اهتماماً (اضغط Enter)"
                />
                <button
                    on:click={handleAddCustomInterest}
                    type="button"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    إضافة
                </button>
            </div>

            <div class="flex flex-wrap gap-2 min-h-[2rem]">
                {#if formData.interests.length === 0}
                    <p class="text-sm text-gray-400 italic">
                        لم تتم إضافة اهتمامات بعد
                    </p>
                {:else}
                    {#each formData.interests as interest}
                        {#if !predefinedInterests.includes(interest)}
                            <span
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 animate-scale-in"
                            >
                                {interest}
                                <button
                                    type="button"
                                    on:click={() => removeInterest(interest)}
                                    class="mr-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                                >
                                    &times;
                                </button>
                            </span>
                        {/if}
                    {/each}
                {/if}
            </div>
            {#if errors.interests}
                <p class="mt-1 text-sm text-red-500">{errors.interests}</p>
            {/if}
        </div>

        <div>
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >اللغات</label
            >
            <div class="grid grid-cols-2 gap-2">
                {#each ["العربية", "الإنجليزية", "الفرنسية", "الألمانية", "الإسبانية", "التركية"] as lang}
                    <label
                        class="flex items-center space-x-2 space-x-reverse cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <input
                            type="checkbox"
                            bind:group={formData.languages}
                            value={lang}
                            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span class="text-gray-900 dark:text-white">{lang}</span
                        >
                    </label>
                {/each}
            </div>
            {#if errors.languages}
                <p class="mt-1 text-sm text-red-500">{errors.languages}</p>
            {/if}
        </div>
    </div>

    <div class="pt-6 flex gap-4">
        <button
            on:click={prevStep}
            class="w-1/3 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
        >
            السابق
        </button>
        <button
            on:click={handleNext}
            class="w-2/3 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-all transform active:scale-[0.98]"
        >
            التالي
        </button>
    </div>
</div>

<style>
    /* Ensure button text is visible */
    button.bg-primary-600 {
        background-color: #0d9488; /* Teal-600 fallback */
        color: white;
    }
    button:disabled {
        background-color: #cbd5e1; /* Slate-300 */
        cursor: not-allowed;
    }
</style>
