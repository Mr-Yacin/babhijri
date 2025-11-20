<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ProfileFormData } from "../../../../lib/types/user";

    export let formData: ProfileFormData;

    const dispatch = createEventDispatcher();

    let errors: Partial<Record<keyof ProfileFormData, string>> = {};
    let newInterest = "";

    const commonInterests = [
        "السفر",
        "القراءة",
        "الطبخ",
        "الرياضة",
        "التصوير",
        "الموسيقى",
        "الأفلام",
        "التكنولوجيا",
        "الطبيعة",
        "الفن",
        "الكتابة",
        "التطوع",
        "الحيوانات",
        "التسوق",
        "ألعاب الفيديو",
    ];

    function validate() {
        errors = {};
        if (!formData.bio || formData.bio.length < 20) {
            errors.bio = "يرجى كتابة نبذة مختصرة لا تقل عن 20 حرفاً";
        }
        if (formData.interests.length < 3) {
            // We'll handle this as a general error or specific field error
            // For now, let's enforce it
            // errors.interests = 'يرجى اختيار 3 اهتمامات على الأقل';
        }

        return Object.keys(errors).length === 0;
    }

    function handleNext() {
        if (validate()) {
            if (formData.interests.length < 3) {
                alert("يرجى اختيار 3 اهتمامات على الأقل");
                return;
            }
            dispatch("next");
        }
    }

    function handleBack() {
        dispatch("back");
    }

    function handleChange() {
        dispatch("update", formData);
    }

    function toggleInterest(interest: string) {
        if (formData.interests.includes(interest)) {
            formData.interests = formData.interests.filter(
                (i) => i !== interest,
            );
        } else {
            if (formData.interests.length >= 10) return; // Max 10 interests
            formData.interests = [...formData.interests, interest];
        }
        handleChange();
    }

    function addCustomInterest() {
        if (newInterest && !formData.interests.includes(newInterest)) {
            if (formData.interests.length >= 10) return;
            formData.interests = [...formData.interests, newInterest.trim()];
            newInterest = "";
            handleChange();
        }
    }
</script>

<div class="space-y-6">
    <!-- Bio -->
    <div>
        <label for="bio" class="block text-sm font-medium text-gray-700 mb-1"
            >نبذة عنك</label
        >
        <p class="text-xs text-gray-500 mb-2">
            تحدث عن نفسك، شخصيتك، وما تبحث عنه في شريك حياتك.
        </p>
        <textarea
            id="bio"
            rows="5"
            bind:value={formData.bio}
            on:input={handleChange}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="أنا شخص هادئ، أحب السفر..."
        ></textarea>
        <div class="flex justify-between mt-1">
            {#if errors.bio}
                <p class="text-red-500 text-xs">{errors.bio}</p>
            {:else}
                <span></span>
            {/if}
            <span class="text-xs text-gray-400"
                >{formData.bio?.length || 0} حرف</span
            >
        </div>
    </div>

    <!-- Interests -->
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
            >الاهتمامات والهوايات</label
        >
        <p class="text-xs text-gray-500 mb-3">
            اختر 3 على الأقل (الحد الأقصى 10)
        </p>

        <!-- Selected Interests -->
        <div class="flex flex-wrap gap-2 mb-4">
            {#each formData.interests as interest}
                <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                >
                    {interest}
                    <button
                        type="button"
                        on:click={() => toggleInterest(interest)}
                        class="mr-2 text-teal-600 hover:text-teal-900 focus:outline-none"
                    >
                        &times;
                    </button>
                </span>
            {/each}
        </div>

        <!-- Common Interests Selection -->
        <div class="flex flex-wrap gap-2 border-t pt-4 border-gray-100">
            {#each commonInterests as interest}
                <button
                    type="button"
                    on:click={() => toggleInterest(interest)}
                    class="px-3 py-1 rounded-full text-sm border transition-colors
                    {formData.interests.includes(interest)
                        ? 'bg-teal-50 border-teal-200 text-teal-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}"
                >
                    {interest}
                </button>
            {/each}
        </div>

        <!-- Add Custom Interest -->
        <div class="mt-4 flex gap-2">
            <input
                type="text"
                bind:value={newInterest}
                placeholder="أضف اهتماماً آخر..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                on:keydown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addCustomInterest())}
            />
            <button
                type="button"
                on:click={addCustomInterest}
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
                إضافة
            </button>
        </div>
    </div>

    <div class="flex gap-4 pt-6">
        <button
            on:click={handleBack}
            class="w-1/3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
            السابق
        </button>
        <button
            on:click={handleNext}
            class="w-2/3 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
            التالي
        </button>
    </div>
</div>
