<script lang="ts">
    import type { ProfileFormData } from "../../../../../lib/types/user";

    export let formData: ProfileFormData;
    export let nextStep: () => void;
    export let prevStep: () => void;

    let errors = {
        country: "",
        city: "",
        education: "",
        occupation: "",
    };

    const arabicCountries = [
        "السعودية",
        "الإمارات",
        "مصر",
        "الكويت",
        "قطر",
        "البحرين",
        "عمان",
        "الأردن",
        "لبنان",
        "العراق",
        "الجزائر",
        "المغرب",
        "تونس",
        "ليبيا",
        "السودان",
        "اليمن",
        "سوريا",
        "فلسطين",
        "موريتانيا",
        "الصومال",
        "جيبوتي",
        "جزر القمر",
    ];

    const commonJobs = [
        "طالب",
        "مهندس",
        "طبيب",
        "معلم",
        "مطور برمجيات",
        "مدير",
        "محاسب",
        "مبيعات",
        "تسويق",
        "عمل حر",
        "بدون عمل",
        "متقاعد",
    ];

    let selectedCountry = arabicCountries.includes(formData.country)
        ? formData.country
        : formData.country
          ? "other"
          : "";
    let customCountry = selectedCountry === "other" ? formData.country : "";

    let selectedOccupation = commonJobs.includes(formData.occupation)
        ? formData.occupation
        : formData.occupation
          ? "other"
          : "";
    let customOccupation =
        selectedOccupation === "other" ? formData.occupation : "";

    $: {
        if (selectedCountry === "other") {
            formData.country = customCountry;
        } else {
            formData.country = selectedCountry;
        }
    }

    $: {
        if (selectedOccupation === "other") {
            formData.occupation = customOccupation;
        } else {
            formData.occupation = selectedOccupation;
        }
    }

    const validate = () => {
        let isValid = true;
        errors = {
            country: "",
            city: "",
            education: "",
            occupation: "",
        };

        if (!formData.country?.trim()) {
            errors.country = "البلد مطلوب";
            isValid = false;
        }

        if (!formData.city?.trim()) {
            errors.city = "المدينة مطلوبة";
            isValid = false;
        }

        if (!formData.education) {
            errors.education = "المستوى التعليمي مطلوب";
            isValid = false;
        }

        if (!formData.occupation?.trim()) {
            errors.occupation = "المهنة مطلوبة";
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
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            الموقع والخلفية
        </h2>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
            أين تعيش وماذا تعمل؟
        </p>
    </div>

    <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label
                    for="country"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >البلد</label
                >
                <select
                    id="country"
                    bind:value={selectedCountry}
                    class="w-full px-4 py-2.5 rounded-lg border {errors.country
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors"
                >
                    <option value="">اختر البلد</option>
                    {#each arabicCountries as country}
                        <option value={country}>{country}</option>
                    {/each}
                    <option value="other">أخرى</option>
                </select>
                {#if selectedCountry === "other"}
                    <input
                        type="text"
                        bind:value={customCountry}
                        placeholder="اكتب اسم البلد"
                        class="mt-2 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                {/if}
                {#if errors.country}
                    <p class="mt-1 text-sm text-red-500">{errors.country}</p>
                {/if}
            </div>

            <div>
                <label
                    for="city"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >المدينة</label
                >
                <input
                    type="text"
                    id="city"
                    bind:value={formData.city}
                    class="w-full px-4 py-2.5 rounded-lg border {errors.city
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors"
                    placeholder="مثال: الرياض"
                />
                {#if errors.city}
                    <p class="mt-1 text-sm text-red-500">{errors.city}</p>
                {/if}
            </div>
        </div>

        <div>
            <label
                for="education"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >المستوى التعليمي</label
            >
            <select
                id="education"
                bind:value={formData.education}
                class="w-full px-4 py-2.5 rounded-lg border {errors.education
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors"
            >
                <option value="">اختر المستوى التعليمي</option>
                <option value="high_school">ثانوية عامة</option>
                <option value="bachelors">بكالوريوس</option>
                <option value="masters">ماجستير</option>
                <option value="phd">دكتوراه</option>
                <option value="other">آخر</option>
            </select>
            {#if errors.education}
                <p class="mt-1 text-sm text-red-500">{errors.education}</p>
            {/if}
        </div>

        <div>
            <label
                for="occupation"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >المهنة</label
            >
            <select
                id="occupation"
                bind:value={selectedOccupation}
                class="w-full px-4 py-2.5 rounded-lg border {errors.occupation
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors"
            >
                <option value="">اختر المهنة</option>
                {#each commonJobs as job}
                    <option value={job}>{job}</option>
                {/each}
                <option value="other">أخرى</option>
            </select>
            {#if selectedOccupation === "other"}
                <input
                    type="text"
                    bind:value={customOccupation}
                    placeholder="اكتب اسم المهنة"
                    class="mt-2 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
            {/if}
            {#if errors.occupation}
                <p class="mt-1 text-sm text-red-500">{errors.occupation}</p>
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
