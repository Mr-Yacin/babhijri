<script lang="ts">
    import { onMount } from "svelte";
    import type { DatingProfile } from "../../lib/types/user";
    import {
        getAllProfiles,
        deleteProfile,
        toggleProfileStatus,
    } from "../../lib/services/adminProfiles";
    import Modal from "../common/Modal.svelte";
    import Toast from "../common/Toast.svelte";

    let profiles: DatingProfile[] = [];
    let loading = true;
    let error = "";
    let searchQuery = "";
    let filterStatus: "all" | "active" | "inactive" = "all";
    let filterGender: "all" | "male" | "female" = "all";
    let viewMode: "grid" | "list" = "grid";

    // Selection state
    let selectedProfiles = new Set<string>();

    // Modal state
    let modalOpen = false;
    let modalTitle = "";
    let modalMessage = "";
    let modalVariant: "danger" | "warning" | "info" | "success" = "danger";
    let modalAction: (() => void) | null = null;
    let profileToDelete: { uid: string; name: string } | null = null;

    // Toast
    let toastComponent: Toast;

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

    function handleDelete(uid: string, name: string) {
        profileToDelete = { uid, name };
        modalTitle = "حذف الملف الشخصي";
        modalMessage = `هل أنت متأكد من حذف ملف "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`;
        modalVariant = "danger";
        modalAction = executeDelete;
        modalOpen = true;
    }

    async function executeDelete() {
        if (!profileToDelete) return;

        try {
            await deleteProfile(profileToDelete.uid);
            profiles = profiles.filter((p) => p.uid !== profileToDelete!.uid);
            selectedProfiles.delete(profileToDelete.uid);
            selectedProfiles = selectedProfiles; // trigger update
            toastComponent.show("تم حذف الملف الشخصي بنجاح", "success");
            profileToDelete = null;
        } catch (err: any) {
            toastComponent.show("فشل حذف الملف: " + err.message, "error");
        }
    }

    async function handleToggleStatus(uid: string, currentStatus: boolean) {
        try {
            await toggleProfileStatus(uid, !currentStatus);
            profiles = profiles.map((p) =>
                p.uid === uid ? { ...p, isActive: !currentStatus } : p,
            );
            toastComponent.show(
                currentStatus
                    ? "تم إلغاء تنشيط الملف الشخصي"
                    : "تم تنشيط الملف الشخصي",
                "success",
            );
        } catch (err: any) {
            toastComponent.show("فشل تغيير الحالة: " + err.message, "error");
        }
    }

    function viewProfile(uid: string) {
        window.location.href = `/app/admin/manage/${uid}`;
    }

    // Bulk Actions
    function toggleSelection(uid: string) {
        if (selectedProfiles.has(uid)) {
            selectedProfiles.delete(uid);
        } else {
            selectedProfiles.add(uid);
        }
        selectedProfiles = selectedProfiles; // trigger reactivity
    }

    function toggleSelectAll() {
        if (selectedProfiles.size === filteredProfiles.length) {
            selectedProfiles = new Set();
        } else {
            selectedProfiles = new Set(filteredProfiles.map((p) => p.uid));
        }
    }

    function confirmBulkDelete() {
        if (selectedProfiles.size === 0) return;
        modalTitle = "حذف متعدد";
        modalMessage = `هل أنت متأكد من حذف ${selectedProfiles.size} ملفات شخصية؟ لا يمكن التراجع عن هذا الإجراء.`;
        modalVariant = "danger";
        modalAction = executeBulkDelete;
        modalOpen = true;
    }

    async function executeBulkDelete() {
        try {
            const uids = Array.from(selectedProfiles);
            // Execute sequentially to avoid overwhelming Firestore or hitting limits
            // In a real app, use a batch or backend function
            for (const uid of uids) {
                await deleteProfile(uid);
            }

            profiles = profiles.filter((p) => !selectedProfiles.has(p.uid));
            selectedProfiles = new Set();
            toastComponent.show("تم حذف الملفات المحددة بنجاح", "success");
        } catch (err: any) {
            toastComponent.show(
                "حدث خطأ أثناء الحذف المتعدد: " + err.message,
                "error",
            );
            // Reload to ensure state is consistent
            await loadProfiles();
        }
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

        const matchesGender =
            filterGender === "all" || profile.gender === filterGender;

        return matchesSearch && matchesStatus && matchesGender;
    });

    $: maleCount = profiles.filter((p) => p.gender === "male").length;
    $: femaleCount = profiles.filter((p) => p.gender === "female").length;
</script>

<Modal
    bind:isOpen={modalOpen}
    title={modalTitle}
    message={modalMessage}
    variant={modalVariant}
    on:confirm={() => modalAction && modalAction()}
/>

<Toast bind:this={toastComponent} />

<div class="space-y-6">
    <!-- Stats Header -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
            class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
            <div>
                <p class="text-sm text-gray-500">إجمالي الملفات</p>
                <p class="text-2xl font-bold text-gray-900">
                    {profiles.length}
                </p>
            </div>
            <div
                class="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-xl"
            >
                👥
            </div>
        </div>
        <div
            class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
            <div>
                <p class="text-sm text-gray-500">الذكور</p>
                <p class="text-2xl font-bold text-gray-900">{maleCount}</p>
            </div>
            <div
                class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl"
            >
                👨
            </div>
        </div>
        <div
            class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
            <div>
                <p class="text-sm text-gray-500">الإناث</p>
                <p class="text-2xl font-bold text-gray-900">{femaleCount}</p>
            </div>
            <div
                class="w-10 h-10 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center text-xl"
            >
                👩
            </div>
        </div>
    </div>

    <!-- Filters & Actions -->
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div
            class="flex flex-col lg:flex-row gap-4 justify-between items-center"
        >
            <!-- Left: Filters -->
            <div
                class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1"
            >
                <div class="relative flex-1 min-w-[200px]">
                    <input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="بحث..."
                        class="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <span class="absolute right-3 top-2.5 text-gray-400"
                        >🔍</span
                    >
                </div>

                <select
                    bind:value={filterStatus}
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="all">كل الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                </select>

                <select
                    bind:value={filterGender}
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="all">كل الجنسين</option>
                    <option value="male">ذكور</option>
                    <option value="female">إناث</option>
                </select>
            </div>

            <!-- Right: Actions -->
            <div class="flex gap-3 w-full lg:w-auto justify-end">
                {#if selectedProfiles.size > 0}
                    <button
                        on:click={confirmBulkDelete}
                        class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 animate-fade-in"
                    >
                        <span>🗑️</span>
                        <span>حذف ({selectedProfiles.size})</span>
                    </button>
                {/if}

                <div class="flex bg-gray-100 rounded-lg p-1">
                    <button
                        on:click={() => (viewMode = "grid")}
                        class="p-2 rounded-md transition-all {viewMode ===
                        'grid'
                            ? 'bg-white shadow text-teal-600'
                            : 'text-gray-500 hover:text-gray-700'}"
                        title="عرض شبكي"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        </svg>
                    </button>
                    <button
                        on:click={() => (viewMode = "list")}
                        class="p-2 rounded-md transition-all {viewMode ===
                        'list'
                            ? 'bg-white shadow text-teal-600'
                            : 'text-gray-500 hover:text-gray-700'}"
                        title="عرض قائمة"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
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
            <p class="text-gray-600">لا توجد ملفات شخصية تطابق البحث</p>
        </div>
    {:else if viewMode === "grid"}
        <!-- Grid View -->
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
            {#each filteredProfiles as profile (profile.uid)}
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative"
                >
                    <!-- Selection Checkbox (Absolute) -->
                    <div class="absolute top-2 right-2 z-10">
                        <input
                            type="checkbox"
                            checked={selectedProfiles.has(profile.uid)}
                            on:change={() => toggleSelection(profile.uid)}
                            class="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 shadow-sm"
                        />
                    </div>

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
                                    class="px-2 py-1 bg-blue-500 text-white text-xs rounded-full shadow-sm"
                                    >✓</span
                                >
                            {/if}
                            <span
                                class={`px-2 py-1 text-xs rounded-full shadow-sm ${profile.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
                            >
                                {profile.isActive ? "نشط" : "خامل"}
                            </span>
                        </div>
                    </div>

                    <!-- Profile Info -->
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-1">
                            <h3
                                class="font-bold text-lg text-gray-900 truncate"
                                title={profile.displayName}
                            >
                                {profile.displayName}
                            </h3>
                            <span class="text-sm font-medium text-gray-500"
                                >{profile.age} سنة</span
                            >
                        </div>

                        <p
                            class="text-sm text-gray-600 mb-2 flex items-center gap-1"
                        >
                            <span>📍</span>
                            {profile.city || profile.location}
                        </p>

                        <p
                            class="text-sm text-gray-500 line-clamp-2 min-h-[2.5em]"
                        >
                            {profile.bio || "لا توجد نبذة"}
                        </p>

                        <!-- Actions -->
                        <div class="mt-4 flex gap-2">
                            <button
                                on:click={() => viewProfile(profile.uid)}
                                class="flex-1 px-3 py-2 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg hover:bg-teal-100 transition-colors"
                            >
                                تعديل
                            </button>
                            <button
                                on:click={() =>
                                    handleToggleStatus(
                                        profile.uid,
                                        profile.isActive,
                                    )}
                                class="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                title={profile.isActive ? "تعطيل" : "تفعيل"}
                            >
                                {profile.isActive ? "⏸️" : "▶️"}
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <!-- List View -->
        <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-right">
                    <thead
                        class="bg-gray-50 text-gray-700 font-medium border-b border-gray-200"
                    >
                        <tr>
                            <th class="p-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={selectedProfiles.size ===
                                        filteredProfiles.length &&
                                        filteredProfiles.length > 0}
                                    on:change={toggleSelectAll}
                                    class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                />
                            </th>
                            <th class="p-4">المستخدم</th>
                            <th class="p-4">الموقع</th>
                            <th class="p-4">الجنس</th>
                            <th class="p-4">الحالة</th>
                            <th class="p-4">تاريخ الانضمام</th>
                            <th class="p-4 text-left">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        {#each filteredProfiles as profile (profile.uid)}
                            <tr
                                class="hover:bg-gray-50/50 transition-colors {selectedProfiles.has(
                                    profile.uid,
                                )
                                    ? 'bg-teal-50/30'
                                    : ''}"
                            >
                                <td class="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedProfiles.has(
                                            profile.uid,
                                        )}
                                        on:change={() =>
                                            toggleSelection(profile.uid)}
                                        class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    />
                                </td>
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <img
                                            src={profile.photos[0]}
                                            alt=""
                                            class="w-10 h-10 rounded-full object-cover border border-gray-200"
                                        />
                                        <div>
                                            <div
                                                class="font-bold text-gray-900"
                                            >
                                                {profile.displayName}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {profile.age} سنة
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4 text-gray-600"
                                    >{profile.city || profile.location}</td
                                >
                                <td class="p-4">
                                    <span
                                        class={`px-2 py-1 rounded-full text-xs ${profile.gender === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}
                                    >
                                        {profile.gender === "male"
                                            ? "ذكر"
                                            : "أنثى"}
                                    </span>
                                </td>
                                <td class="p-4">
                                    <span
                                        class={`px-2 py-1 rounded-full text-xs ${profile.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                                    >
                                        {profile.isActive ? "نشط" : "خامل"}
                                    </span>
                                </td>
                                <td class="p-4 text-gray-500">
                                    {new Date(
                                        profile.createdAt.seconds * 1000,
                                    ).toLocaleDateString("ar-SA")}
                                </td>
                                <td class="p-4">
                                    <div class="flex justify-end gap-2">
                                        <button
                                            on:click={() =>
                                                viewProfile(profile.uid)}
                                            class="p-1.5 text-teal-600 hover:bg-teal-50 rounded transition-colors"
                                            title="تعديل"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            on:click={() =>
                                                handleDelete(
                                                    profile.uid,
                                                    profile.displayName,
                                                )}
                                            class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="حذف"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>
