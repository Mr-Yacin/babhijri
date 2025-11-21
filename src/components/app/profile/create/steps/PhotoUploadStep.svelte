<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ProfileFormData } from "../../../../../lib/types/user";
    import { ProfileService } from "../../../../../lib/services/profile";
    import { authStore } from "../../../../../lib/stores/auth";

    export let formData: ProfileFormData;
    export let submitForm: () => void; // Used for "Finish" in creation flow
    export let prevStep: () => void;
    export let isValid: boolean = false;
    export let isLoading: boolean = false; // Used to show loading state from parent

    const dispatch = createEventDispatcher();

    let uploading = false;
    let error = "";

    const MAX_PHOTOS = 6;

    const handleFileSelect = async (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        if (formData.photos.length >= MAX_PHOTOS) {
            error = `يمكنك إضافة ${MAX_PHOTOS} صور كحد أقصى`;
            return;
        }

        const file = input.files[0];
        if (!$authStore.user) return;

        uploading = true;
        error = "";

        try {
            const url = await ProfileService.uploadProfilePhoto(
                $authStore.user.uid,
                file,
            );
            const newPhotos = [...formData.photos, url];
            formData.photos = newPhotos;

            // Dispatch update event for parent to handle (e.g., auto-save in edit mode)
            dispatch("update", { photos: newPhotos });
        } catch (err: any) {
            error = err.message || "فشل رفع الصورة";
        } finally {
            uploading = false;
            input.value = ""; // Reset input
        }
    };

    const removePhoto = async (url: string) => {
        if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;

        try {
            await ProfileService.deleteProfilePhoto(url);
            const newPhotos = formData.photos.filter((p: string) => p !== url);
            formData.photos = newPhotos;
            dispatch("update", { photos: newPhotos });
        } catch (err: any) {
            error = err.message || "فشل حذف الصورة";
        }
    };

    const setMainPhoto = (url: string) => {
        if (formData.photos[0] === url) return; // Already main

        const otherPhotos = formData.photos.filter((p: string) => p !== url);
        const newPhotos = [url, ...otherPhotos];
        formData.photos = newPhotos;
        dispatch("update", { photos: newPhotos });
    };

    $: isValid = formData.photos.length > 0;
</script>

<div class="space-y-6 animate-fade-in">
    <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">الصور</h2>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
            أضف صوراً شخصية لملفك. الصورة الأولى هي الصورة الرئيسية.
        </p>
    </div>

    {#if error}
        <div
            class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg animate-shake"
        >
            {error}
        </div>
    {/if}

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each formData.photos as photo, index}
            <div class="group animate-scale-in">
                <div
                    class="relative aspect-square rounded-lg overflow-hidden border-2 {index ===
                    0
                        ? 'border-teal-500 ring-4 ring-teal-200 dark:ring-teal-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'} transition-all"
                >
                    <img
                        src={photo}
                        alt="Profile"
                        class="w-full h-full object-cover"
                    />

                    <!-- Delete button (always visible or on hover) -->
                    <button
                        on:click={() => removePhoto(photo)}
                        class="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-sm"
                        title="حذف الصورة"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>

                    {#if index === 0}
                        <!-- Star icon for main photo -->
                        <div
                            class="absolute top-2 left-2 p-1.5 bg-teal-600/90 text-white rounded-full shadow-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                />
                            </svg>
                        </div>
                        <div
                            class="absolute bottom-0 inset-x-0 bg-teal-600/90 text-white text-xs font-medium py-1.5 text-center"
                        >
                            الصورة الرئيسية
                        </div>
                    {/if}
                </div>

                <!-- Actions below image -->
                <div class="mt-2 flex justify-center">
                    {#if index !== 0}
                        <button
                            type="button"
                            on:click={() => setMainPhoto(photo)}
                            class="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 px-3 py-1.5 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                />
                            </svg>
                            تعيين كرئيسية
                        </button>
                    {:else}
                        <span
                            class="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            الصورة الافتراضية
                        </span>
                    {/if}
                </div>
            </div>
        {/each}

        {#if formData.photos.length < MAX_PHOTOS}
            <label
                class="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors bg-gray-50 dark:bg-gray-800/50 group"
            >
                {#if uploading}
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                    ></div>
                {:else}
                    <div
                        class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors mb-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </div>
                    <span
                        class="text-sm text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                        >أضف صورة</span
                    >
                    <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        on:change={handleFileSelect}
                    />
                {/if}
            </label>
        {/if}
    </div>

    <div class="pt-6 flex gap-4">
        <button
            on:click={prevStep}
            class="w-1/3 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
        >
            السابق
        </button>
        <button
            on:click={submitForm}
            disabled={!isValid || uploading || isLoading}
            class="w-2/3 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
            {uploading || isLoading ? "جاري الحفظ..." : "حفظ"}
        </button>
    </div>
</div>
