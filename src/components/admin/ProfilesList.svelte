<script lang="ts">
    import { onMount } from "svelte";
    import type { DatingProfile } from "../../lib/types/user";
    import {
        getAllProfiles,
        deleteProfile,
        toggleProfileStatus,
    } from "../../lib/services/adminProfiles";

    let profiles: DatingProfile[] = [];
    let loading = true;
    let error = "";
    let searchQuery = "";
    let filterStatus: "all" | "active" | "inactive" = "all";

    onMount(async () => {
        await loadProfiles();
    });

    async function loadProfiles() {
        try {
            loading = true;
            profiles = await getAllProfiles();
            loading = false;
        } catch (err: any) {
            error = err.message || "فشل تحميل الملفات الشخصية";
            loading = false;
        }
    }

    async function handleDelete(uid: string, name: string) {
        if (
            !confirm(
                `هل أنت متأكد من حذف ملف ${name}؟ لا يمكن التراجع عن هذا الإجراء.`,
            )
        ) {
            return;
        }

        try {
            await deleteProfile(uid);
            profiles = profiles.filter((p) => p.uid !== uid);
        } catch (err: any) {
            alert("فشل حذف الملف: " + err.message);
        }
    }

    async function handleToggleStatus(uid: string, currentStatus: boolean) {
        try {
            await toggleProfileStatus(uid, !currentStatus);
            profiles = profiles.map((p) =>
                p.uid === uid ? { ...p, isActive: !currentStatus } : p,
            );
        } catch (err: any) {
            alert("فشل تغيير الحالة: " + err.message);
        }
    }

    function viewProfile(uid: string) {
        window.location.href = `/app/admin/profiles/${uid}`;
    }

    $: filteredProfiles = profiles.filter((profile) => {
        const matchesSearch =
            !searchQuery ||
            profile.displayName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            profile.location
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            profile.bio.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "active" && profile.isActive) ||
            (filterStatus === "inactive" && !profile.isActive);

        return matchesSearch && matchesStatus;
    });
</script>

<div class="space-y-6">
    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex flex-col sm:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="البحث بالاسم أو الموقع أو السيرة..."
                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
            </div>

            <!-- Status Filter -->
            <div>
                <select
                    bind:value={filterStatus}
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="all">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Stats Header -->
    <div
        class="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200"
    >
        <p class="text-sm text-teal-700">
            <span class="font-bold">{filteredProfiles.length}</span> ملف شخصي من
            أصل <span class="font-bold">{profiles.length}</span>
        </p>
    </div>

    <!-- Loading State -->
    {#if loading}
        <div class="text-center py-12">
            <div
                class="inline-block w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"
            ></div>
            <p class="text-gray-600 mt-4">جاري التحميل...</p>
        </div>
    {:else if error}
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p class="text-red-600">{error}</p>
            <button
                on:click={loadProfiles}
                class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
                إعادة المحاولة
            </button>
        </div>
    {:else if filteredProfiles.length === 0}
        <div
            class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"
        >
            <p class="text-gray-600">لا توجد ملفات شخصية</p>
        </div>
    {:else}
        <!-- Profiles Grid -->
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
            {#each filteredProfiles as profile (profile.uid)}
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                    <!-- Profile Image -->
                    <div class="relative h-48 bg-gray-100">
                        <img
                            src={profile.photos[0]}
                            alt={profile.displayName}
                            class="w-full h-full object-cover"
                        />
                        <div class="absolute top-2 left-2 flex gap-2">
                            {#if profile.verified}
                                <span
                                    class="px-2 py-1 bg-blue-500 text-white text-xs rounded-full"
                                >
                                    ✓ موثق
                                </span>
                            {/if}
                            <span
                                class={`px-2 py-1 text-xs rounded-full ${profile.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
                            >
                                {profile.isActive ? "نشط" : "غير نشط"}
                            </span>
                        </div>
                    </div>

                    <!-- Profile Info -->
                    <div class="p-4">
                        <h3 class="font-bold text-lg text-gray-900">
                            {profile.displayName}, {profile.age}
                        </h3>
                        <p class="text-sm text-gray-600">{profile.location}</p>
                        <p class="text-sm text-gray-500 mt-2 line-clamp-2">
                            {profile.bio}
                        </p>

                        <!-- Actions -->
                        <div class="mt-4 flex gap-2">
                            <button
                                on:click={() => viewProfile(profile.uid)}
                                class="flex-1 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                تعديل
                            </button>
                            <button
                                on:click={() =>
                                    handleToggleStatus(
                                        profile.uid,
                                        profile.isActive,
                                    )}
                                class="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                title={profile.isActive
                                    ? "إلغاء التنشيط"
                                    : "تنشيط"}
                            >
                                {profile.isActive ? "🔴" : "🟢"}
                            </button>
                            <button
                                on:click={() =>
                                    handleDelete(
                                        profile.uid,
                                        profile.displayName,
                                    )}
                                class="px-3 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                                title="حذف"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
