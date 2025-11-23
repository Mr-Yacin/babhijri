<script lang="ts">
    import { onMount } from "svelte";
    import { AdminService } from "../../lib/services/admin";
    import { ProfileService } from "../../lib/services/profile";
    import { userService } from "../../lib/services/user";
    import { PhotoService } from "../../lib/services/photo";
    import Modal from "../common/Modal.svelte";
    import Toast from "../common/Toast.svelte";
    import type {
        DatingProfile,
        UserProfile,
        UserActivity,
    } from "../../lib/types/user";
    import {
        ARABIC_COUNTRIES,
        COMMON_JOBS,
        INTERESTS_OPTIONS,
        EDUCATION_LEVELS,
        MARITAL_STATUS_OPTIONS,
        LANGUAGES_OPTIONS,
        RELIGION_OPTIONS,
        GENDER_OPTIONS,
    } from "../../lib/constants/form-options";

    export let uid: string = "";

    let profile: DatingProfile | null = null;
    let userAccount: UserProfile | null = null;
    let activities: UserActivity[] = [];
    let loading = true;
    let error = "";

    // Edit mode states
    let isEditing = false;
    let editForm: Partial<DatingProfile> = {};
    let saving = false;

    // Photo upload state
    let uploadingPhoto = false;
    let photoFiles: FileList | null = null;

    // Modal State
    let modalOpen = false;
    let modalTitle = "";
    let modalMessage = "";
    let modalVariant: "danger" | "warning" | "info" | "success" = "info";
    let modalAction: (() => void) | null = null;

    // Toast
    let toastComponent: Toast;

    // Multi-select helpers
    let newInterest = "";
    let newLanguage = "";

    onMount(async () => {
        if (!uid) {
            const params = new URLSearchParams(window.location.search);
            uid = params.get("uid") || params.get("id") || "";
        }
        if (uid) {
            await loadUserData();
        } else {
            error = "معرف المستخدم غير موجود";
            loading = false;
        }
    });

    async function loadUserData() {
        loading = true;
        try {
            // First, get the profile to find the real user UID
            const p = await ProfileService.getFullProfile(uid);
            profile = p;

            // If profile exists, use its UID (which is the real user UID)
            // This handles cases where the URL has profile_XXX but we need the actual user UID
            const realUid = profile?.uid || uid;

            // Now get user account and activities using the real UID
            const [u, a] = await Promise.all([
                userService.getUserProfile(realUid),
                AdminService.getUserActivity(realUid),
            ]);

            userAccount = u;
            activities = a;

            // Update uid to be the real user UID for photo uploads
            uid = realUid;
        } catch (e) {
            console.error("Error loading user data:", e);
            error = "فشل تحميل بيانات المستخدم";
        } finally {
            loading = false;
        }
    }

    function startEditing() {
        if (!profile) return;
        isEditing = true;
        editForm = { ...profile };
    }

    function cancelEditing() {
        isEditing = false;
        editForm = {};
    }
    async function saveProfile() {
        if (!uid || !editForm) return;
        saving = true;
        try {
            // Update verification date if status changes to verified
            if (
                editForm.verificationStatus === "verified" &&
                profile?.verificationStatus !== "verified"
            ) {
                editForm.verificationDate = Date.now();
            }

            // Sync verified boolean with verificationStatus
            if (editForm.verificationStatus === "verified") {
                editForm.verified = true;
            } else if (editForm.verificationStatus) {
                editForm.verified = false;
            }

            await ProfileService.updateProfile(uid, editForm);
            await loadUserData();
            isEditing = false;
            toastComponent.show("تم تحديث الملف الشخصي بنجاح", "success");
        } catch (e) {
            console.error("Error updating profile:", e);
            toastComponent.show("حدث خطأ أثناء تحديث الملف الشخصي", "error");
        } finally {
            saving = false;
        }
    }

    // Photo Management
    async function handlePhotoUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;

        if (!files || files.length === 0) return;

        uploadingPhoto = true;
        try {
            const file = files[0];

            // Validate dimensions
            const { valid, width, height } =
                await PhotoService.validateImageDimensions(file);
            if (!valid) {
                toastComponent.show(
                    `أبعاد الصورة صغيرة جداً (${width}x${height}). الحد الأدنى: 400x400`,
                    "error",
                );
                return;
            }

            // Upload photo
            const currentPhotosCount = editForm.photos?.length || 0;
            console.log(
                "Uploading photo for UID:",
                uid,
                "Photo index:",
                currentPhotosCount,
            );
            const photoURL = await PhotoService.uploadPhoto(
                file,
                uid,
                currentPhotosCount,
            );

            // Add to profile
            if (!editForm.photos) {
                editForm.photos = [];
            }
            editForm.photos = [...editForm.photos, photoURL];

            toastComponent.show("تم رفع الصورة بنجاح", "success");
        } catch (e: any) {
            console.error("Error uploading photo:", e);
            toastComponent.show(
                "حدث خطأ أثناء رفع الصورة: " + e.message,
                "error",
            );
        } finally {
            uploadingPhoto = false;
            input.value = ""; // Reset input
        }
    }

    function confirmRemovePhoto(photoURL: string, index: number) {
        modalTitle = "حذف الصورة";
        modalMessage =
            "هل أنت متأكد من حذف هذه الصورة؟ سيتم حذفها من التخزين والملف الشخصي نهائياً.";
        modalVariant = "warning";
        modalAction = () => executeRemovePhoto(photoURL, index);
        modalOpen = true;
    }

    async function executeRemovePhoto(photoURL: string, index: number) {
        try {
            // Try to delete from storage (may fail for external URLs)
            try {
                await PhotoService.deletePhoto(photoURL);
                console.log("Photo deleted from storage");
            } catch (storageError) {
                console.log(
                    "Photo not in storage or deletion failed, removing from profile only",
                    storageError,
                );
            }

            // Remove from edit form AND profile
            if (editForm.photos) {
                editForm.photos = editForm.photos.filter((_, i) => i !== index);
            }

            // If in edit mode, also update the profile immediately to save the change
            if (profile && profile.photos) {
                const updatedPhotos = profile.photos.filter(
                    (_, i) => i !== index,
                );
                await ProfileService.updateProfile(uid, {
                    photos: updatedPhotos,
                });
                // Reload to refresh the data
                await loadUserData();
            }

            toastComponent.show("تم حذف الصورة بنجاح", "success");
        } catch (e: any) {
            console.error("Error removing photo:", e);
            toastComponent.show("حدث خطأ أثناء حذف الصورة", "error");
        }
    }

    // Interest and Language Management
    function addInterest() {
        if (!newInterest.trim()) return;
        if (!editForm.interests) editForm.interests = [];
        editForm.interests = [...editForm.interests, newInterest.trim()];
        newInterest = "";
    }

    function removeInterest(index: number) {
        if (!editForm.interests) return;
        editForm.interests = editForm.interests.filter((_, i) => i !== index);
    }

    function toggleInterest(interest: string) {
        if (!editForm.interests) editForm.interests = [];
        const index = editForm.interests.indexOf(interest);
        if (index > -1) {
            editForm.interests = editForm.interests.filter(
                (_, i) => i !== index,
            );
        } else {
            editForm.interests = [...editForm.interests, interest];
        }
    }

    function addLanguage() {
        if (!newLanguage.trim()) return;
        if (!editForm.languages) editForm.languages = [];
        editForm.languages = [...editForm.languages, newLanguage.trim()];
        newLanguage = "";
    }

    function removeLanguage(index: number) {
        if (!editForm.languages) return;
        editForm.languages = editForm.languages.filter((_, i) => i !== index);
    }

    function toggleLanguage(language: string) {
        if (!editForm.languages) editForm.languages = [];
        const index = editForm.languages.indexOf(language);
        if (index > -1) {
            editForm.languages = editForm.languages.filter(
                (_, i) => i !== index,
            );
        } else {
            editForm.languages = [...editForm.languages, language];
        }
    }

    // Admin Actions
    function confirmToggleStatus() {
        if (!profile || !uid) return;
        modalTitle = profile.isActive ? "تعطيل المستخدم" : "تفعيل المستخدم";
        modalMessage = profile.isActive
            ? "هل تريد تعطيل هذا المستخدم؟ لن يتمكن من الوصول إلى حسابه."
            : "هل تريد تفعيل هذا المستخدم؟ سيتمكن من الوصول إلى حسابه مرة أخرى.";
        modalVariant = "warning";
        modalAction = executeToggleStatus;
        modalOpen = true;
    }

    async function executeToggleStatus() {
        if (!profile || !uid) return;
        try {
            await AdminService.toggleUserStatus(uid, !profile.isActive);
            await loadUserData();
            toastComponent.show(
                profile.isActive
                    ? "تم تعطيل المستخدم بنجاح"
                    : "تم تفعيل المستخدم بنجاح",
                "success",
            );
        } catch (e) {
            console.error("Error toggling status:", e);
            toastComponent.show("حدث خطأ أثناء تحديث الحالة", "error");
        }
    }

    function confirmDeleteUser() {
        if (!uid) return;
        modalTitle = "حذف المستخدم";
        modalMessage =
            "هل أنت متأكد تماماً؟ سيتم حذف جميع بيانات المستخدم نهائياً ولا يمكن التراجع عن هذا الإجراء.";
        modalVariant = "danger";
        modalAction = executeDeleteUser;
        modalOpen = true;
    }

    async function executeDeleteUser() {
        if (!uid) {
            toastComponent.show(
                "خطأ: لم يتم العثور على معرف المستخدم",
                "error",
            );
            return;
        }
        try {
            await AdminService.deleteUserAccount(uid);
            toastComponent.show("تم حذف المستخدم بنجاح", "success", 2000);
            setTimeout(() => {
                window.location.href = "/app/admin/users";
            }, 2000);
        } catch (e: any) {
            console.error("Error deleting user:", e);
            toastComponent.show(
                "حدث خطأ أثناء حذف المستخدم: " + (e.message || e),
                "error",
            );
        }
    }

    function confirmToggleRole() {
        if (!userAccount || !uid) return;
        const newRole = userAccount.role === "admin" ? "user" : "admin";
        modalTitle = "تغيير دور المستخدم";
        modalMessage = `هل تريد تغيير دور المستخدم إلى ${newRole === "admin" ? "مشرف" : "مستخدم"}؟`;
        modalVariant = "info";
        modalAction = executeToggleRole;
        modalOpen = true;
    }

    async function executeToggleRole() {
        if (!userAccount || !uid) return;
        const newRole = userAccount.role === "admin" ? "user" : "admin";
        try {
            await AdminService.updateUserRole(uid, newRole);
            await loadUserData();
            toastComponent.show("تم تحديث دور المستخدم بنجاح", "success");
        } catch (e) {
            console.error("Error updating role:", e);
            toastComponent.show("حدث خطأ أثناء تحديث الدور", "error");
        }
    }

    function formatAction(action: string) {
        const map: Record<string, string> = {
            login: "تسجيل دخول",
            update_profile: "تحديث الملف الشخصي",
            view_profile: "عرض ملف شخصي",
            like: "إعجاب",
            match: "توافق",
        };
        return map[action] || action;
    }
</script>

<Modal
    bind:isOpen={modalOpen}
    title={modalTitle}
    message={modalMessage}
    variant={modalVariant}
    on:confirm={() => modalAction && modalAction()}
/>

<Toast bind:this={toastComponent} />

{#if loading}
    <div class="flex justify-center items-center py-12">
        <svg
            class="animate-spin h-12 w-12 text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
            ></path>
        </svg>
    </div>
{:else if error || !profile}
    <div class="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {error || "المستخدم غير موجود"}
    </div>
{:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="space-y-6">
            <!-- User Info Card -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <div class="text-center mb-6">
                    <div
                        class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden"
                    >
                        {#if profile.photos && profile.photos[0]}
                            <img
                                src={profile.photos[0]}
                                alt={profile.displayName}
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            {profile.displayName.substring(0, 2).toUpperCase()}
                        {/if}
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 mb-1">
                        {profile.displayName}
                    </h2>
                    <p class="text-sm text-gray-500 mb-3">
                        {userAccount?.email || "غير متوفر"}
                    </p>

                    <div class="flex justify-center gap-2">
                        <span
                            class="px-3 py-1 {profile.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'} rounded-full text-xs font-medium"
                        >
                            {profile.isActive ? "نشط" : "غير نشط"}
                        </span>
                        <span
                            class="px-3 py-1 {userAccount?.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'} rounded-full text-xs font-medium"
                        >
                            {userAccount?.role === "admin" ? "مشرف" : "مستخدم"}
                        </span>
                    </div>
                </div>

                <div class="space-y-3 border-t border-gray-100 pt-6">
                    {#if !isEditing}
                        <button
                            on:click={startEditing}
                            class="w-full py-2 px-4 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-medium"
                        >
                            تعديل الملف الشخصي
                        </button>
                        <button
                            on:click={confirmToggleStatus}
                            class="w-full py-2 px-4 {profile.isActive
                                ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'} rounded-lg transition-colors font-medium"
                        >
                            {profile.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
                        </button>
                        <button
                            on:click={confirmToggleRole}
                            class="w-full py-2 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                        >
                            {userAccount?.role === "admin"
                                ? "إزالة صلاحيات المشرف"
                                : "منح صلاحيات المشرف"}
                        </button>
                    {/if}
                    <button
                        on:click={confirmDeleteUser}
                        class="w-full py-2 px-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                        حذف الحساب
                    </button>
                </div>
            </div>

            <!-- Activity Log -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h3 class="font-bold text-gray-900 mb-4">سجل النشاط</h3>
                <div class="space-y-3 max-h-64 overflow-y-auto">
                    {#each activities as activity}
                        <div class="text-sm">
                            <div class="flex justify-between items-start">
                                <span class="text-gray-700">
                                    {formatAction(activity.action)}
                                </span>
                                <span class="text-gray-400 text-xs">
                                    {new Date(
                                        activity.timestamp,
                                    ).toLocaleDateString("ar-SA")}
                                </span>
                            </div>
                            {#if activity.details}
                                <p class="text-gray-500 text-xs mt-1">
                                    {activity.details}
                                </p>
                            {/if}
                        </div>
                    {:else}
                        <p class="text-gray-400 text-sm text-center py-4">
                            لا توجد أنشطة مسجلة
                        </p>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
            {#if isEditing}
                <!-- Edit Form -->
                <form on:submit|preventDefault={saveProfile} class="space-y-6">
                    <!-- Photos Section -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h3 class="text-lg font-bold text-gray-900 mb-4">
                            الصور الشخصية
                        </h3>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {#each editForm.photos || [] as photo, index}
                                <div class="relative group">
                                    <img
                                        src={photo}
                                        alt="Profile photo {index + 1}"
                                        class="w-full aspect-square object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        on:click={() =>
                                            confirmRemovePhoto(photo, index)}
                                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                    {#if index === 0}
                                        <span
                                            class="absolute bottom-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded"
                                        >
                                            رئيسية
                                        </span>
                                    {/if}
                                </div>
                            {/each}

                            {#if !editForm.photos || editForm.photos.length < 6}
                                <label
                                    class="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                                >
                                    <span class="text-3xl text-gray-400">+</span
                                    >
                                    <span class="text-xs text-gray-500 mt-2"
                                        >إضافة صورة</span
                                    >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        on:change={handlePhotoUpload}
                                        class="hidden"
                                        disabled={uploadingPhoto}
                                    />
                                </label>
                            {/if}
                        </div>

                        {#if uploadingPhoto}
                            <div class="text-center text-teal-600 text-sm">
                                جاري رفع الصورة...
                            </div>
                        {/if}

                        <p class="text-xs text-gray-500 mt-2">
                            * يمكنك رفع حتى 6 صور. الحد الأدنى للأبعاد: 400×400
                            بكسل. الحد الأقصى للحجم: 5 ميجابايت
                        </p>
                    </div>

                    <!-- Basic Info -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h3 class="text-lg font-bold text-gray-900 mb-4">
                            المعلومات الأساسية
                        </h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="name"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    الاسم الكامل
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    bind:value={editForm.displayName}
                                    required
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label
                                    for="age"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    العمر
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    bind:value={editForm.age}
                                    min="18"
                                    max="100"
                                    required
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label
                                    for="gender"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    الجنس
                                </label>
                                <select
                                    id="gender"
                                    bind:value={editForm.gender}
                                    required
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    {#each GENDER_OPTIONS as option}
                                        <option value={option.value}
                                            >{option.label}</option
                                        >
                                    {/each}
                                </select>
                            </div>

                            <div>
                                <label
                                    for="country"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    الدولة
                                </label>
                                <select
                                    id="country"
                                    bind:value={editForm.country}
                                    required
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">اختر الدولة</option>
                                    {#each ARABIC_COUNTRIES as country}
                                        <option value={country}
                                            >{country}</option
                                        >
                                    {/each}
                                </select>
                            </div>

                            <div>
                                <label
                                    for="city"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    المدينة
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    bind:value={editForm.city}
                                    required
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label
                                    for="occupation"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    المهنة
                                </label>
                                <select
                                    id="occupation"
                                    bind:value={editForm.occupation}
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">اختر المهنة</option>
                                    {#each COMMON_JOBS as job}
                                        <option value={job}>{job}</option>
                                    {/each}
                                </select>
                            </div>

                            <div>
                                <label
                                    for="education"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    المستوى التعليمي
                                </label>
                                <select
                                    id="education"
                                    bind:value={editForm.education}
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">اختر المستوى</option>
                                    {#each EDUCATION_LEVELS as level}
                                        <option value={level}>{level}</option>
                                    {/each}
                                </select>
                            </div>

                            <div>
                                <label
                                    for="maritalStatus"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    الحالة الاجتماعية
                                </label>
                                <select
                                    id="maritalStatus"
                                    bind:value={editForm.maritalStatus}
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">اختر الحالة</option>
                                    {#each MARITAL_STATUS_OPTIONS as status}
                                        <option value={status}>{status}</option>
                                    {/each}
                                </select>
                            </div>

                            <div>
                                <label
                                    for="religion"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    الديانة
                                </label>
                                <select
                                    id="religion"
                                    bind:value={editForm.religion}
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">اختر الديانة</option>
                                    {#each RELIGION_OPTIONS as religion}
                                        <option value={religion}
                                            >{religion}</option
                                        >
                                    {/each}
                                </select>
                            </div>

                            <div>
                                <label
                                    for="height"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    الطول (سم)
                                </label>
                                <input
                                    type="number"
                                    id="height"
                                    bind:value={editForm.height}
                                    min="140"
                                    max="220"
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div class="md:col-span-2">
                                <label
                                    for="bio"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    نبذة عني
                                </label>
                                <textarea
                                    id="bio"
                                    bind:value={editForm.bio}
                                    rows="4"
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="اكتب نبذة قصيرة عنك..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Interests -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h3 class="text-lg font-bold text-gray-900 mb-4">
                            الاهتمامات
                        </h3>

                        <div class="flex flex-wrap gap-2 mb-4">
                            {#each INTERESTS_OPTIONS as interest}
                                <button
                                    type="button"
                                    on:click={() => toggleInterest(interest)}
                                    class="px-4 py-2 rounded-full text-sm font-medium transition-colors {editForm.interests?.includes(
                                        interest,
                                    )
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                                >
                                    {interest}
                                </button>
                            {/each}
                        </div>

                        <div class="flex gap-2">
                            <input
                                type="text"
                                bind:value={newInterest}
                                placeholder="إضافة اهتمام آخر..."
                                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                on:keypress={(e) =>
                                    e.key === "Enter" &&
                                    (e.preventDefault(), addInterest())}
                            />
                            <button
                                type="button"
                                on:click={addInterest}
                                class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                            >
                                إضافة
                            </button>
                        </div>

                        {#if editForm.interests && editForm.interests.filter((i) => !INTERESTS_OPTIONS.includes(i)).length > 0}
                            <div class="mt-4">
                                <p class="text-sm text-gray-600 mb-2">
                                    اهتمامات أخرى:
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    {#each editForm.interests.filter((i) => !INTERESTS_OPTIONS.includes(i)) as interest, index}
                                        <span
                                            class="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-1"
                                        >
                                            {interest}
                                            <button
                                                type="button"
                                                on:click={() => {
                                                    const idx =
                                                        editForm.interests?.indexOf(
                                                            interest,
                                                        ) ?? -1;
                                                    if (idx >= 0)
                                                        removeInterest(idx);
                                                }}
                                                class="text-teal-900 hover:text-teal-700"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Languages -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h3 class="text-lg font-bold text-gray-900 mb-4">
                            اللغات
                        </h3>

                        <div class="flex flex-wrap gap-2 mb-4">
                            {#each LANGUAGES_OPTIONS as language}
                                <button
                                    type="button"
                                    on:click={() => toggleLanguage(language)}
                                    class="px-4 py-2 rounded-full text-sm font-medium transition-colors {editForm.languages?.includes(
                                        language,
                                    )
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                                >
                                    {language}
                                </button>
                            {/each}
                        </div>

                        <div class="flex gap-2">
                            <input
                                type="text"
                                bind:value={newLanguage}
                                placeholder="إضافة لغة أخرى..."
                                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                on:keypress={(e) =>
                                    e.key === "Enter" &&
                                    (e.preventDefault(), addLanguage())}
                            />
                            <button
                                type="button"
                                on:click={addLanguage}
                                class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                            >
                                إضافة
                            </button>
                        </div>
                    </div>

                    <!-- Admin Data Section -->
                    <div
                        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-purple-500"
                    >
                        <h3
                            class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
                        >
                            <span>🛡️</span>
                            بيانات الإدارة
                        </h3>

                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label
                                    for="verificationStatus"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    حالة التوثيق
                                </label>
                                <select
                                    id="verificationStatus"
                                    bind:value={editForm.verificationStatus}
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="none">غير موثق (None)</option
                                    >
                                    <option value="pending"
                                        >قيد المراجعة (Pending)</option
                                    >
                                    <option value="verified"
                                        >موثق (Verified)</option
                                    >
                                    <option value="rejected"
                                        >مرفوض (Rejected)</option
                                    >
                                </select>
                            </div>

                            {#if editForm.verificationStatus === "rejected"}
                                <div>
                                    <label
                                        for="rejectionReason"
                                        class="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        سبب الرفض
                                    </label>
                                    <input
                                        type="text"
                                        id="rejectionReason"
                                        bind:value={editForm.rejectionReason}
                                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="اذكر سبب رفض التوثيق..."
                                    />
                                </div>
                            {/if}

                            <div>
                                <label
                                    for="adminNotes"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    ملاحظات الإدارة (سرية)
                                </label>
                                <textarea
                                    id="adminNotes"
                                    bind:value={editForm.adminNotes}
                                    rows="3"
                                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="ملاحظات خاصة بالمشرفين فقط..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            class="flex-1 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                        <button
                            type="button"
                            on:click={cancelEditing}
                            disabled={saving}
                            class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            {:else}
                <!-- View Mode -->
                <div
                    class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                    <h3 class="text-lg font-bold text-gray-900 mb-4">
                        تفاصيل الملف الشخصي
                    </h3>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">العمر</p>
                            <p class="font-medium">{profile.age} سنة</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">الجنس</p>
                            <p class="font-medium">
                                {profile.gender === "male" ? "ذكر" : "أنثى"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">الموقع</p>
                            <p class="font-medium">
                                {profile.city}, {profile.country}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">المهنة</p>
                            <p class="font-medium">
                                {profile.occupation || "-"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">التعليم</p>
                            <p class="font-medium">
                                {profile.education || "-"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">
                                الحالة الاجتماعية
                            </p>
                            <p class="font-medium">
                                {profile.maritalStatus || "-"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">الديانة</p>
                            <p class="font-medium">{profile.religion || "-"}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">الطول</p>
                            <p class="font-medium">
                                {profile.height ? `${profile.height} سم` : "-"}
                            </p>
                        </div>
                    </div>

                    {#if profile.bio}
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <p class="text-sm text-gray-500 mb-2">نبذة عني</p>
                            <p class="text-gray-700">{profile.bio}</p>
                        </div>
                    {/if}

                    {#if profile.interests && profile.interests.length > 0}
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <p class="text-sm text-gray-500 mb-2">الاهتمامات</p>
                            <div class="flex flex-wrap gap-2">
                                {#each profile.interests as interest}
                                    <span
                                        class="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                                    >
                                        {interest}
                                    </span>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    {#if profile.languages && profile.languages.length > 0}
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <p class="text-sm text-gray-500 mb-2">اللغات</p>
                            <div class="flex flex-wrap gap-2">
                                {#each profile.languages as language}
                                    <span
                                        class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                        {language}
                                    </span>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    {#if profile.photos && profile.photos.length > 0}
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <p class="text-sm text-gray-500 mb-2">
                                الصور ({profile.photos.length})
                            </p>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {#each profile.photos as photo}
                                    <img
                                        src={photo}
                                        alt="Profile"
                                        class="w-full aspect-square object-cover rounded-lg"
                                    />
                                {/each}
                            </div>
                        </div>
                    {/if}
                    <!-- Admin Data Display -->
                    <div class="mt-6 pt-6 border-t border-gray-100">
                        <h4
                            class="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2"
                        >
                            <span>🛡️</span> بيانات الإدارة
                        </h4>
                        <div class="bg-purple-50 rounded-lg p-4 space-y-3">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <span class="text-xs text-gray-500 block"
                                        >حالة التوثيق</span
                                    >
                                    <span class="font-medium text-gray-900">
                                        {#if profile.verificationStatus === "verified"}
                                            <span class="text-green-600"
                                                >موثق ✅</span
                                            >
                                        {:else if profile.verificationStatus === "pending"}
                                            <span class="text-orange-600"
                                                >قيد المراجعة ⏳</span
                                            >
                                        {:else if profile.verificationStatus === "rejected"}
                                            <span class="text-red-600"
                                                >مرفوض ❌</span
                                            >
                                        {:else}
                                            <span class="text-gray-600"
                                                >غير موثق</span
                                            >
                                        {/if}
                                    </span>
                                </div>

                                {#if profile.verificationDate}
                                    <div>
                                        <span
                                            class="text-xs text-gray-500 block"
                                            >تاريخ التوثيق</span
                                        >
                                        <span class="text-gray-900">
                                            {new Date(
                                                profile.verificationDate,
                                            ).toLocaleDateString("ar-SA")}
                                        </span>
                                    </div>
                                {/if}
                            </div>

                            {#if profile.verificationStatus === "rejected" && profile.rejectionReason}
                                <div>
                                    <span class="text-xs text-gray-500 block"
                                        >سبب الرفض</span
                                    >
                                    <span class="text-red-700"
                                        >{profile.rejectionReason}</span
                                    >
                                </div>
                            {/if}

                            {#if profile.adminNotes}
                                <div>
                                    <span class="text-xs text-gray-500 block"
                                        >ملاحظات الإدارة</span
                                    >
                                    <p
                                        class="text-gray-700 text-sm whitespace-pre-wrap"
                                    >
                                        {profile.adminNotes}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}
