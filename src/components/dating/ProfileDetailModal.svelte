<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { DatingProfile } from "../../lib/types/user";

    export let profile: DatingProfile;
    export let isLiked: boolean = false;
    export let onClose: () => void;
    export let onToggleLike: () => void;

    let currentPhotoIndex = 0;

    function nextPhoto() {
        if (currentPhotoIndex < profile.photos.length - 1) {
            currentPhotoIndex++;
        }
    }

    function prevPhoto() {
        if (currentPhotoIndex > 0) {
            currentPhotoIndex--;
        }
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }
</script>

<!-- Modal Backdrop -->
<div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
>
    <!-- Modal Content -->
    <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        dir="rtl"
    >
        <!-- Close Button -->
        <button
            on:click={onClose}
            class="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10"
            aria-label="إغلاق"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>

        <!-- Photo Gallery -->
        <div class="relative h-96 bg-gray-900">
            <img
                src={profile.photos[currentPhotoIndex]}
                alt={profile.displayName}
                class="w-full h-full object-cover"
            />

            <!-- Photo Navigation -->
            {#if profile.photos.length > 1}
                <div
                    class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
                >
                    {#each profile.photos as _, index}
                        <button
                            on:click={() => (currentPhotoIndex = index)}
                            class="w-2 h-2 rounded-full transition-all {currentPhotoIndex ===
                            index
                                ? 'bg-white w-8'
                                : 'bg-white/50'}"
                            aria-label={`صورة ${index + 1}`}
                        />
                    {/each}
                </div>

                {#if currentPhotoIndex > 0}
                    <button
                        on:click={prevPhoto}
                        class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        aria-label="الصورة السابقة"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                {/if}

                {#if currentPhotoIndex < profile.photos.length - 1}
                    <button
                        on:click={nextPhoto}
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        aria-label="الصورة التالية"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                {/if}
            {/if}

            <!-- Gradient Overlay -->
            <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20"
            >
                <h2
                    class="text-white text-3xl font-bold flex items-center gap-2"
                >
                    {profile.displayName}, {profile.age}
                    {#if profile.verified}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="w-7 h-7 text-blue-400"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    {/if}
                </h2>
                <p class="text-gray-200 text-lg flex items-center gap-2 mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                    </svg>
                    {profile.location}
                </p>
            </div>
        </div>

        <!-- Profile Details -->
        <div class="p-6 space-y-6">
            <!-- Bio -->
            <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">نبذة عني</h3>
                <p class="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>

            <!-- Interests -->
            {#if profile.interests && profile.interests.length > 0}
                <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">
                        الاهتمامات
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        {#each profile.interests as interest}
                            <span
                                class="px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium"
                            >
                                {interest}
                            </span>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-gray-500 text-sm mb-1">التعليم</p>
                    <p class="text-gray-900 font-medium">{profile.education}</p>
                </div>

                <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-gray-500 text-sm mb-1">المهنة</p>
                    <p class="text-gray-900 font-medium">
                        {profile.occupation}
                    </p>
                </div>

                <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-gray-500 text-sm mb-1">الحالة الاجتماعية</p>
                    <p class="text-gray-900 font-medium">
                        {profile.maritalStatus === "single"
                            ? "أعزب/عزباء"
                            : profile.maritalStatus === "divorced"
                              ? "مطلق/مطلقة"
                              : "أرمل/أرملة"}
                    </p>
                </div>

                <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-gray-500 text-sm mb-1">أبحث عن</p>
                    <p class="text-gray-900 font-medium">
                        {profile.lookingFor === "marriage" ? "زواج" : "صداقة"}
                    </p>
                </div>

                {#if profile.languages && profile.languages.length > 0}
                    <div class="bg-gray-50 rounded-xl p-4">
                        <p class="text-gray-500 text-sm mb-1">اللغات</p>
                        <p class="text-gray-900 font-medium">
                            {profile.languages.join("، ")}
                        </p>
                    </div>
                {/if}

                {#if profile.height}
                    <div class="bg-gray-50 rounded-xl p-4">
                        <p class="text-gray-500 text-sm mb-1">الطول</p>
                        <p class="text-gray-900 font-medium">
                            {profile.height} سم
                        </p>
                    </div>
                {/if}
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4">
                <button
                    on:click={() =>
                        (window.location.href = `/app/messages?profile=${profile.uid}`)}
                    class="flex-1 py-3 rounded-xl bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors"
                >
                    مراسلة
                </button>
                <button
                    on:click={onToggleLike}
                    class="w-14 h-12 flex items-center justify-center rounded-xl border-2 {isLiked
                        ? 'border-pink-500 bg-pink-50 text-pink-500'
                        : 'border-gray-200 text-gray-400 hover:text-pink-500 hover:border-pink-300'} transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isLiked ? "currentColor" : "none"}
                        stroke="currentColor"
                        stroke-width={isLiked ? "0" : "2"}
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
    }

    .animate-slideUp {
        animation: slideUp 0.3s ease-out;
    }
</style>
