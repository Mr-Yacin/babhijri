<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ProfileFormData } from "../../../../lib/types/user";

    export let formData: ProfileFormData;

    const dispatch = createEventDispatcher();

    let errors: Partial<Record<keyof ProfileFormData, string>> = {};

    function validate() {
        errors = {};
        if (!formData.displayName) errors.displayName = "الاسم مطلوب";
        if (formData.age < 18)
            errors.age = "يجب أن يكون العمر 18 عاماً على الأقل";
        if (!formData.gender) errors.gender = "الجنس مطلوب";
        if (!formData.maritalStatus)
            errors.maritalStatus = "الحالة الاجتماعية مطلوبة";

        return Object.keys(errors).length === 0;
    }

    function handleNext() {
        if (validate()) {
            dispatch("next");
        }
    }

    function handleChange() {
        dispatch("update", formData);
    }
</script>

<div class="space-y-6">
    <!-- Display Name -->
    <div>
        <label
            for="displayName"
            class="block text-sm font-medium text-gray-700 mb-1"
            >الاسم الظاهر</label
        >
        <input
            type="text"
            id="displayName"
            bind:value={formData.displayName}
            on:input={handleChange}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="كيف تحب أن يظهر اسمك؟"
        />
        {#if errors.displayName}
            <p class="text-red-500 text-xs mt-1">{errors.displayName}</p>
        {/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Age -->
        <div>
            <label
                for="age"
                class="block text-sm font-medium text-gray-700 mb-1"
                >العمر</label
            >
            <input
                type="number"
                id="age"
                min="18"
                max="99"
                bind:value={formData.age}
                on:input={handleChange}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {#if errors.age}
                <p class="text-red-500 text-xs mt-1">{errors.age}</p>
            {/if}
        </div>

        <!-- Gender -->
        <div>
            <span class="block text-sm font-medium text-gray-700 mb-1"
                >الجنس</span
            >
            <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="gender"
                        value="male"
                        bind:group={formData.gender}
                        on:change={handleChange}
                        class="text-teal-600 focus:ring-teal-500"
                    />
                    <span>ذكر</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="gender"
                        value="female"
                        bind:group={formData.gender}
                        on:change={handleChange}
                        class="text-teal-600 focus:ring-teal-500"
                    />
                    <span>أنثى</span>
                </label>
            </div>
            {#if errors.gender}
                <p class="text-red-500 text-xs mt-1">{errors.gender}</p>
            {/if}
        </div>
    </div>

    <!-- Marital Status -->
    <div>
        <label
            for="maritalStatus"
            class="block text-sm font-medium text-gray-700 mb-1"
            >الحالة الاجتماعية</label
        >
        <select
            id="maritalStatus"
            bind:value={formData.maritalStatus}
            on:change={handleChange}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
            <option value="single">أعزب / عزباء</option>
            <option value="divorced">مطلق / مطلقة</option>
            <option value="widowed">أرمل / أرملة</option>
        </select>
    </div>

    <!-- Has Children -->
    <div class="flex items-center gap-3">
        <input
            type="checkbox"
            id="hasChildren"
            bind:checked={formData.hasChildren}
            on:change={handleChange}
            class="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
        />
        <label for="hasChildren" class="text-sm text-gray-700"
            >لديك أطفال؟</label
        >
    </div>

    <!-- Looking For -->
    <div>
        <span class="block text-sm font-medium text-gray-700 mb-1">أبحث عن</span
        >
        <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    name="lookingFor"
                    value="marriage"
                    bind:group={formData.lookingFor}
                    on:change={handleChange}
                    class="text-teal-600 focus:ring-teal-500"
                />
                <span>زواج</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    name="lookingFor"
                    value="friendship"
                    bind:group={formData.lookingFor}
                    on:change={handleChange}
                    class="text-teal-600 focus:ring-teal-500"
                />
                <span>تعارف جاد</span>
            </label>
        </div>
    </div>

    <div class="pt-6">
        <button
            on:click={handleNext}
            class="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
            التالي
        </button>
    </div>
</div>
