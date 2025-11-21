<script lang="ts">
    import { onMount } from "svelte";
    import { AdminService } from "../../lib/services/admin";
    import { ProfileService } from "../../lib/services/profile";
    import { userService } from "../../lib/services/user";
    import Modal from "../common/Modal.svelte";
    import Toast from "../common/Toast.svelte";
    import type {
        DatingProfile,
        UserProfile,
        UserActivity,
    } from "../../lib/types/user";

    export let uid: string = "";

    let profile: DatingProfile | null = null;
    let userAccount: UserProfile | null = null;
    let activities: UserActivity[] = [];
    let loading = true;
    let error = "";

    // Edit Mode State
    let isEditing = false;
    let editForm: Partial<DatingProfile> = {};
    let saving = false;

    // Modal State
    let modalOpen = false;
    let modalTitle = "";
    let modalMessage = "";
    let modalVariant: "danger" | "warning" | "info" | "success" = "info";
    let modalAction: (() => void) | null = null;

    // Toast
    let toastComponent: Toast;

    onMount(async () => {
        if (!uid) {
            const params = new URLSearchParams(window.location.search);
            uid = params.get("uid") || "";
        }
        if (uid) {
            await loadUserData();
        } else {
            error = "User ID not found";
            loading = false;
        }
    });

    async function loadUserData() {
        loading = true;
        try {
            const [p, u, a] = await Promise.all([
                ProfileService.getProfile(uid),
                userService.getUserProfile(uid),
                AdminService.getUserActivity(uid),
            ]);
            profile = p;
            userAccount = u;
            activities = a;
        } catch (e) {
            console.error("Error loading user data:", e);
            error = "فشل تحميل بيانات المستخدم";
        } finally {
            loading = false;
        }
    }

    function startEditing() {
        if (!profile) return;
        editForm = { ...profile };
        isEditing = true;
    }

    function cancelEditing() {
        isEditing = false;
        editForm = {};
    }

    async function saveProfile() {
        if (!uid || !editForm) return;
        saving = true;
        try {
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

    function formatAction(action: string) {
        const map: Record<string, string> = {
            login: "تسجيل دخول",
            update_profile: "تحديث الملف الشخصي",
            view_profile: "عرض ملف شخصي",
            like_profile: "إعجاب بملف",
            match: "تطابق جديد",
        };
        return map[action] || action;
    }

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
        if (!uid) return;
        try {
            await AdminService.deleteUserAccount(uid);
            toastComponent.show("تم حذف المستخدم بنجاح", "success", 2000);
            setTimeout(() => {
                window.location.href = "/app/admin/users";
            }, 2000);
        } catch (e) {
            console.error("Error deleting user:", e);
            toastComponent.show("حدث خطأ أثناء حذف المستخدم", "error");
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
    <div class="flex justify-center py-12">
        <svg
            class="animate-spin h-8 w-8 text-indigo-600"
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
                        class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-500"
                    >
                        <span
                            >{profile.displayName
                                ? profile.displayName[0].toUpperCase()
                                : "U"}</span
                        >
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 mb-1">
                        {profile.displayName}
                    </h2>
                    <p class="text-sm text-gray-500 mb-3">
                        {userAccount?.email || "غير متوفر"}
                    </p>
                    <div class="flex justify-center gap-2">
                        <span
                            class={`px-3 py-1 rounded-full text-sm font-medium ${userAccount?.role === "admin" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"}`}
                        >
                            {userAccount?.role === "admin" ? "مشرف" : "مستخدم"}
                        </span>
                        <span
                            class={`px-3 py-1 rounded-full text-sm font-medium ${profile.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                            {profile.isActive ? "نشط" : "غير نشط"}
                        </span>
                    </div>
                </div>

                <div class="space-y-3 border-t border-gray-100 pt-6">
                    {#if !isEditing}
                        <button
                            on:click={startEditing}
                            class="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        >
                            تعديل البيانات
                        </button>
                    {/if}
                    <button
                        on:click={confirmToggleStatus}
                        class="w-full py-2 px-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors font-medium"
                    >
                        تغيير الحالة (تفعيل/تعطيل)
                    </button>
                    <button
                        on:click={confirmToggleRole}
                        class="w-full py-2 px-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                    >
                        تغيير الدور (مشرف/مستخدم)
                    </button>
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
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    {#if activities.length === 0}
                        <p class="text-gray-500 text-center py-4">
                            لا يوجد نشاط مسجل
                        </p>
                    {:else}
                        {#each activities as act}
                            <div
                                class="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0"
                            >
                                <div
                                    class="w-2 h-2 mt-2 rounded-full bg-gray-300"
                                ></div>
                                <div>
                                    <p
                                        class="text-sm font-medium text-gray-900"
                                    >
                                        {formatAction(act.action)}
                                    </p>
                                    <p class="text-xs text-gray-500">
                                        {new Date(act.timestamp).toLocaleString(
                                            "ar-SA",
                                        )}
                                    </p>
                                    {#if act.details}
                                        <p class="text-xs text-gray-400 mt-1">
                                            {JSON.stringify(act.details)}
                                        </p>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>

        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Profile Details -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <div
                    class="flex justify-between items-center mb-6 border-b border-gray-100 pb-2"
                >
                    <h3 class="font-bold text-gray-900 text-lg">
                        معلومات الملف الشخصي
                    </h3>
                    {#if isEditing}
                        <div class="flex gap-2">
                            <button
                                on:click={cancelEditing}
                                class="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={saving}
                            >
                                إلغاء
                            </button>
                            <button
                                on:click={saveProfile}
                                class="px-4 py-1 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                                disabled={saving}
                            >
                                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </button>
                        </div>
                    {/if}
                </div>

                {#if isEditing}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >الاسم</label
                            >
                            <input
                                type="text"
                                bind:value={editForm.displayName}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >العمر</label
                            >
                            <input
                                type="number"
                                bind:value={editForm.age}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >الجنس</label
                            >
                            <select
                                bind:value={editForm.gender}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="male">ذكر</option>
                                <option value="female">أنثى</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >المدينة</label
                            >
                            <input
                                type="text"
                                bind:value={editForm.city}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >الدولة</label
                            >
                            <input
                                type="text"
                                bind:value={editForm.country}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >الحالة الاجتماعية</label
                            >
                            <select
                                bind:value={editForm.maritalStatus}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="single">أعزب/عزباء</option>
                                <option value="divorced">مطلق/مطلقة</option>
                                <option value="widowed">أرمل/أرملة</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >التعليم</label
                            >
                            <input
                                type="text"
                                bind:value={editForm.education}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >المهنة</label
                            >
                            <input
                                type="text"
                                bind:value={editForm.occupation}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1"
                                >الديانة</label
                            >
                            <input
                                type="text"
                                bind:value={editForm.religion}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div class="mt-6">
                        <label class="block text-sm text-gray-500 mb-1"
                            >نبذة شخصية</label
                        >
                        <textarea
                            bind:value={editForm.bio}
                            rows="4"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>
                {:else}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm text-gray-500 mb-1">العمر</p>
                            <p class="font-medium text-gray-900">
                                {profile.age || "-"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 mb-1">الجنس</p>
                            <p class="font-medium text-gray-900">
                                {profile.gender === "male" ? "ذكر" : "أنثى"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 mb-1">الموقع</p>
                            <p class="font-medium text-gray-900">
                                {profile.city || ""}, {profile.country || ""}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 mb-1">
                                الحالة الاجتماعية
                            </p>
                            <p class="font-medium text-gray-900">
                                {profile.maritalStatus || "-"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 mb-1">التعليم</p>
                            <p class="font-medium text-gray-900">
                                {profile.education || "-"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 mb-1">المهنة</p>
                            <p class="font-medium text-gray-900">
                                {profile.occupation || "-"}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 mb-1">الديانة</p>
                            <p class="font-medium text-gray-900">
                                {profile.religion || "-"}
                            </p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <p class="text-sm text-gray-500 mb-1">نبذة شخصية</p>
                        <p class="font-medium text-gray-900 leading-relaxed">
                            {profile.bio || "-"}
                        </p>
                    </div>
                {/if}
            </div>

            <!-- Photos -->
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h3
                    class="font-bold text-gray-900 mb-6 text-lg border-b border-gray-100 pb-2"
                >
                    الصور
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {#if profile.photos && profile.photos.length > 0}
                        {#each profile.photos as url}
                            <div
                                class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                            >
                                <img
                                    src={url}
                                    alt="User photo"
                                    class="w-full h-full object-cover"
                                />
                            </div>
                        {/each}
                    {:else}
                        <p class="text-gray-500 col-span-full text-center py-4">
                            لا توجد صور
                        </p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}
