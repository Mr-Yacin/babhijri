<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ProfileFormData } from "../../../../lib/types/user";

    export let formData: ProfileFormData;

    const dispatch = createEventDispatcher();

    let errors: Partial<Record<keyof ProfileFormData, string>> = {};

    const countries = [
        "الجزائر",
        "المغرب",
        "تونس",
        "مصر",
        "السعودية",
        "الإمارات",
        "قطر",
        "الكويت",
        "البحرين",
        "عمان",
        "الأردن",
        "لبنان",
        "فلسطين",
        "العراق",
        "سوريا",
        "اليمن",
        "ليبيا",
        "السودان",
        "فرنسا",
        "ألمانيا",
        "بريطانيا",
        "كندا",
        "الولايات المتحدة",
        "أخرى",
    ];

    const educationLevels = [
        "ثانوي",
        "بكالوريوس",
        "ماجستير",
        "دكتوراه",
        "تكوين مهني",
        "بدون شهادة",
    ];

    function validate() {
        errors = {};
        if (!formData.country) errors.country = "الدولة مطلوبة";
        if (!formData.city) errors.city = "المدينة مطلوبة";
        if (!formData.education) errors.education = "المستوى التعليمي مطلوب";
        if (!formData.occupation) errors.occupation = "المهنة مطلوبة";

        return Object.keys(errors).length === 0;
    }

    function handleNext() {
        if (validate()) {
            dispatch("next");
        }
    }

    function handleBack() {
        dispatch("back");
    }

    function handleChange() {
        dispatch("update", formData);
    }
</script>

<div class="space-y-6">
    <!-- Country -->
    <div>
        <label
            for="country"
            class="block text-sm font-medium text-gray-700 mb-1">الدولة</label
        >
        <select
            id="country"
            bind:value={formData.country}
            on:change={handleChange}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
            <option value="">اختر الدولة</option>
            {#each countries as country}
                <option value={country}>{country}</option>
            {/each}
        </select>
        {#if errors.country}
            <p class="text-red-500 text-xs mt-1">{errors.country}</p>
        {/if}
    </div>

    <!-- City -->
    <div>
        <label for="city" class="block text-sm font-medium text-gray-700 mb-1"
            >المدينة</label
        >
        <input
            type="text"
            id="city"
            bind:value={formData.city}
            on:input={handleChange}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="مثال: الجزائر العاصمة، الدار البيضاء..."
        />
        {#if errors.city}
            <p class="text-red-500 text-xs mt-1">{errors.city}</p>
        {/if}
    </div>

    <!-- Education -->
    <div>
        <label
            for="education"
            class="block text-sm font-medium text-gray-700 mb-1"
            >المستوى التعليمي</label
        >
        <select
            id="education"
            bind:value={formData.education}
            on:change={handleChange}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
            <option value="">اختر المستوى التعليمي</option>
            {#each educationLevels as level}
                <option value={level}>{level}</option>
            {/each}
        </select>
        {#if errors.education}
            <p class="text-red-500 text-xs mt-1">{errors.education}</p>
        {/if}
    </div>

    <!-- Occupation -->
    <div>
        <label
            for="occupation"
            class="block text-sm font-medium text-gray-700 mb-1">المهنة</label
        >
        <input
            type="text"
            id="occupation"
            bind:value={formData.occupation}
            on:input={handleChange}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="مثال: مهندس برمجيات، طبيب، طالب..."
        />
        {#if errors.occupation}
            <p class="text-red-500 text-xs mt-1">{errors.occupation}</p>
        {/if}
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
