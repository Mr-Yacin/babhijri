<script lang="ts">
    import type { ProfileFormData } from "../../../../../lib/types/user";

    export let formData: ProfileFormData;
    export let nextStep: () => void;

    let errors = {
        displayName: "",
        age: "",
        gender: "",
    };

    const validate = () => {
        let isValid = true;
        errors = {
            displayName: "",
            age: "",
            gender: "",
        };

        if (!formData.displayName?.trim()) {
            errors.displayName = "الاسم مطلوب";
            isValid = false;
        }

        if (!formData.age) {
            errors.age = "العمر مطلوب";
            isValid = false;
        } else if (formData.age < 18) {
            errors.age = "يجب أن يكون العمر 18 عاماً على الأقل";
            isValid = false;
        }

        if (!formData.gender) {
            errors.gender = "يرجى اختيار الجنس";
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
            المعلومات الأساسية
        </h2>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
            أخبرنا قليلاً عن نفسك للبدء
        </p>
    </div>

    <div class="space-y-5">
        <div>
            <label
                for="displayName"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >الاسم المعروض</label
            >
            <input
                type="text"
                id="displayName"
                bind:value={formData.displayName}
                class="w-full px-4 py-2.5 rounded-lg border {errors.displayName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors"
                placeholder="الاسم الذي سيظهر للآخرين"
            />
            {#if errors.displayName}
                <p class="mt-1 text-sm text-red-500">{errors.displayName}</p>
            {/if}
        </div>

        <div>
            <label
                for="age"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >العمر</label
            >
            <input
                type="number"
                id="age"
                bind:value={formData.age}
                min="18"
                max="100"
                class="w-full px-4 py-2.5 rounded-lg border {errors.age
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors"
            />
            {#if errors.age}
                <p class="mt-1 text-sm text-red-500">{errors.age}</p>
            {/if}
        </div>

        <div>
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >الجنس</label
            >
            <div class="grid grid-cols-2 gap-4">
                <label
                    class={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${formData.gender === "male" ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"} ${errors.gender ? "border-red-500" : ""}`}
                >
                    <input
                        type="radio"
                        bind:group={formData.gender}
                        value="male"
                        class="sr-only"
                    />
                    <span class="font-medium">ذكر</span>
                </label>
                <label
                    class={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${formData.gender === "female" ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"} ${errors.gender ? "border-red-500" : ""}`}
                >
                    <input
                        type="radio"
                        bind:group={formData.gender}
                        value="female"
                        class="sr-only"
                    />
                    <span class="font-medium">أنثى</span>
                </label>
            </div>
            {#if errors.gender}
                <p class="mt-1 text-sm text-red-500">{errors.gender}</p>
            {/if}
        </div>
    </div>

    <div class="pt-6">
        <button
            on:click={handleNext}
            class="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-all transform active:scale-[0.98]"
        >
            التالي
        </button>
    </div>
</div>
