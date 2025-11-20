<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ProfileFormData } from "../../../../lib/types/user";
    import { ImageUploadService } from "../../../../lib/utils/imageUpload";
    import { authStore } from "../../../../lib/stores/auth";

    export let formData: ProfileFormData;
    export let isLoading: boolean = false;

    const dispatch = createEventDispatcher();
    let uploadError = "";
    let isUploading = false;

    async function handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];

        // Validate
        const error = ImageUploadService.validateImage(file);
        if (error) {
            uploadError = error;
            return;
        }

        if (!$authStore.user) return;

        try {
            isUploading = true;
            uploadError = "";

            const downloadURL = await ImageUploadService.uploadProfilePhoto(
                $authStore.user.uid,
                file,
            );

            // Add to photos array
            formData.photos = [...formData.photos, downloadURL];
            dispatch("update", formData);
        } catch (e: any) {
            console.error(e);
            uploadError = e.message || "فشل رفع الصورة";
        } finally {
            isUploading = false;
            input.value = ""; // Reset input
        }
    }

    async function removePhoto(photoUrl: string) {
        try {
            // Optional: Delete from storage immediately or wait until profile save?
            // For now, let's just remove from the list.
            // Real deletion from storage should ideally happen here to avoid orphaned files,
            // but if the user doesn't complete the profile, we might have issues.
            // Let's delete it for now.
            await ImageUploadService.deleteProfilePhoto(photoUrl);

            formData.photos = formData.photos.filter((p) => p !== photoUrl);
            dispatch("update", formData);
        } catch (e) {
            console.error("Error removing photo:", e);
            // Still remove from UI even if storage delete fails
            formData.photos = formData.photos.filter((p) => p !== photoUrl);
            dispatch("update", formData);
        }
    }

    function handleSubmit() {
        if (formData.photos.length === 0) {
            uploadError = "يرجى إضافة صورة واحدة على الأقل";
            return;
        }
        dispatch("submit");
    }

    function handleBack() {
        dispatch("back");
    }
</script>

<div class="space-y-6">
    <div class="text-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">صورك الشخصية</h3>
        <p class="text-sm text-gray-500 mt-1">
            أضف صوراً واضحة لنفسك. الصور الواضحة تزيد من فرصك في العثور على شريك
            مناسب.
        </p>
    </div>

    <!-- Photo Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each formData.photos as photo}
            <div
                class="relative aspect-square rounded-lg overflow-hidden group bg-gray-100"
            >
                <img
                    src={photo}
                    alt="Profile"
                    class="w-full h-full object-cover"
                />
                <button
                    on:click={() => removePhoto(photo)}
                    class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
            </div>
        {/each}

        <!-- Upload Button -->
        {#if formData.photos.length < 6}
            <label
                class="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-500 cursor-pointer flex flex-col items-center justify-center transition-colors bg-gray-50 hover:bg-teal-50"
            >
                {#if isUploading}
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"
                    ></div>
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-10 w-10 text-gray-400"
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
                    <span class="mt-2 text-sm text-gray-500">أضف صورة</span>
                {/if}
                <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    on:change={handleFileUpload}
                    disabled={isUploading}
                />
            </label>
        {/if}
    </div>

    {#if uploadError}
        <p class="text-red-500 text-sm text-center">{uploadError}</p>
    {/if}

    <div class="flex gap-4 pt-6">
        <button
            on:click={handleBack}
            class="w-1/3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            disabled={isLoading || isUploading}
        >
            السابق
        </button>
        <button
            on:click={handleSubmit}
            class="w-2/3 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isUploading || formData.photos.length === 0}
        >
            {#if isLoading}
                جاري الحفظ...
            {:else}
                إتمام الملف الشخصي
            {/if}
        </button>
    </div>
</div>
