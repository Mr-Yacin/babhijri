<script lang="ts">
    import { onMount } from "svelte";
    import { AdminService } from "../../lib/services/admin";
    import type { UserListItem, AdminFilters } from "../../lib/types/user";
    import Modal from "../common/Modal.svelte";
    import Toast from "../common/Toast.svelte";

    let users: UserListItem[] = [];
    let loading = true;
    let hasMore = false;
    let lastDoc: any = null;

    // Filters state
    let searchQuery = "";
    let filterRole: "all" | "admin" | "user" = "all";
    let filterStatus: "all" | "active" | "inactive" = "all";
    let filterVerified: "all" | "verified" | "unverified" = "all";

    // View state
    let viewMode: "grid" | "list" = "grid";
    let selectedUsers = new Set<string>();

    // Modal state
    let modalOpen = false;
    let modalTitle = "";
    let modalMessage = "";
    let modalVariant: "danger" | "warning" | "info" | "success" = "danger";
    let modalAction: (() => void) | null = null;
    let userToDelete: string | null = null;

    // Toast
    let toastComponent: Toast;

    async function loadUsers(reset = false) {
        loading = true;
        try {
            if (reset) {
                lastDoc = null;
                users = [];
                selectedUsers = new Set();
            }

            const filters: AdminFilters = {
                search: searchQuery,
                role: filterRole === "all" ? undefined : filterRole,
                status: filterStatus === "all" ? undefined : filterStatus,
                verified: filterVerified === "all" ? undefined : filterVerified,
            };

            const result = await AdminService.getAllUsers(filters, 20, lastDoc);
            users = [...users, ...result.users];
            lastDoc = result.lastDoc;
            hasMore = result.hasMore;
        } catch (e: any) {
            console.error("Failed to load users", e);
            toastComponent?.show("فشل تحميل المستخدمين: " + e.message, "error");
        } finally {
            loading = false;
        }
    }

    function handleSearch() {
        loadUsers(true);
    }

    function loadMore() {
        if (hasMore && !loading) {
            loadUsers();
        }
    }

    function handleDelete(uid: string, name: string) {
        userToDelete = uid;
        modalTitle = "حذف المستخدم";
        modalMessage = `هل أنت متأكد من حذف المستخدم "${name}"؟ سيتم حذف جميع البيانات نهائياً ولا يمكن التراجع.`;
        modalVariant = "danger";
        modalAction = executeDelete;
        modalOpen = true;
    }

    async function executeDelete() {
        if (!userToDelete) return;

        try {
            await AdminService.deleteUserAccount(userToDelete);
            toastComponent.show("تم حذف المستخدم بنجاح", "success");
            users = users.filter((u) => u.uid !== userToDelete);
            selectedUsers.delete(userToDelete!);
            selectedUsers = selectedUsers; // trigger reactivity
            userToDelete = null;
        } catch (e: any) {
            console.error("Error deleting user:", e);
            toastComponent.show(
                "حدث خطأ أثناء حذف المستخدم: " + e.message,
                "error",
            );
        }
    }

    // Bulk Actions
    function toggleSelection(uid: string) {
        if (selectedUsers.has(uid)) {
            selectedUsers.delete(uid);
        } else {
            selectedUsers.add(uid);
        }
        selectedUsers = selectedUsers;
    }

    function toggleSelectAll() {
        if (selectedUsers.size === users.length && users.length > 0) {
            selectedUsers = new Set();
        } else {
            selectedUsers = new Set(users.map((u) => u.uid));
        }
    }

    function confirmBulkDelete() {
        if (selectedUsers.size === 0) return;
        modalTitle = "حذف متعدد";
        modalMessage = `هل أنت متأكد من حذف ${selectedUsers.size} مستخدمين؟ لا يمكن التراجع عن هذا الإجراء.`;
        modalVariant = "danger";
        modalAction = executeBulkDelete;
        modalOpen = true;
    }

    async function executeBulkDelete() {
        try {
            const uids = Array.from(selectedUsers);
            for (const uid of uids) {
                await AdminService.deleteUserAccount(uid);
            }
            users = users.filter((u) => !selectedUsers.has(u.uid));
            selectedUsers = new Set();
            toastComponent.show("تم حذف المستخدمين المحددين بنجاح", "success");
        } catch (e: any) {
            toastComponent.show(
                "حدث خطأ أثناء الحذف المتعدد: " + e.message,
                "error",
            );
            loadUsers(true);
        }
    }

    function viewUser(uid: string) {
        window.location.href = `/app/admin/manage/${uid}`;
    }

    onMount(() => loadUsers());

    // Stats (Calculated from loaded users for now, ideally should come from backend stats)
    $: activeCount = users.filter((u) => u.isActive).length;
    $: verifiedCount = users.filter((u) => u.verified).length;
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
                <p class="text-sm text-gray-500">إجمالي المستخدمين</p>
                <p class="text-2xl font-bold text-gray-900">
                    {users.length}{hasMore ? "+" : ""}
                </p>
            </div>
            <div
                class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl"
            >
                👥
            </div>
        </div>
        <div
            class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
            <div>
                <p class="text-sm text-gray-500">نشط</p>
                <p class="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
            <div
                class="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl"
            >
                🟢
            </div>
        </div>
        <div
            class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
            <div>
                <p class="text-sm text-gray-500">موثق</p>
                <p class="text-2xl font-bold text-gray-900">{verifiedCount}</p>
            </div>
            <div
                class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl"
            >
                ✓
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
                class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1 flex-wrap"
            >
                <div class="relative flex-1 min-w-[200px]">
                    <input
                        type="text"
                        bind:value={searchQuery}
                        on:change={handleSearch}
                        placeholder="بحث بالاسم أو البريد..."
                        class="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <span class="absolute right-3 top-2.5 text-gray-400"
                        >🔍</span
                    >
                </div>

                <select
                    bind:value={filterRole}
                    on:change={() => loadUsers(true)}
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="all">كل الأدوار</option>
                    <option value="admin">مسؤول</option>
                    <option value="user">مستخدم</option>
                </select>

                <select
                    bind:value={filterStatus}
                    on:change={() => loadUsers(true)}
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="all">كل الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                </select>

                <select
                    bind:value={filterVerified}
                    on:change={() => loadUsers(true)}
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="all">الكل</option>
                    <option value="verified">موثق</option>
                    <option value="unverified">غير موثق</option>
                </select>
            </div>

            <!-- Right: Actions -->
            <div class="flex gap-3 w-full lg:w-auto justify-end">
                {#if selectedUsers.size > 0}
                    <button
                        on:click={confirmBulkDelete}
                        class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 animate-fade-in"
                    >
                        <span>🗑️</span>
                        <span>حذف ({selectedUsers.size})</span>
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
    {#if loading && users.length === 0}
        <div class="text-center py-12">
            <div
                class="inline-block w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"
            ></div>
            <p class="text-gray-600 mt-4">جاري التحميل...</p>
        </div>
    {:else if users.length === 0}
        <div
            class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"
        >
            <p class="text-gray-600">لا يوجد مستخدمين يطابقون البحث</p>
        </div>
    {:else}
        {#if viewMode === "grid"}
            <!-- Grid View -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
                {#each users as user (user.uid)}
                    <div
                        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative"
                    >
                        <!-- Selection Checkbox -->
                        <div class="absolute top-2 right-2 z-10">
                            <input
                                type="checkbox"
                                checked={selectedUsers.has(user.uid)}
                                on:change={() => toggleSelection(user.uid)}
                                class="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 shadow-sm"
                            />
                        </div>

                        <!-- User Info -->
                        <div class="p-6 flex flex-col items-center text-center">
                            <div class="relative mb-4">
                                <img
                                    src={user.photoURL ||
                                        `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                                    alt={user.displayName}
                                    class="w-20 h-20 rounded-full object-cover border-4 border-gray-50"
                                />
                                {#if user.verified}
                                    <span
                                        class="absolute bottom-0 right-0 bg-blue-500 text-white text-xs p-1 rounded-full border-2 border-white"
                                        title="موثق">✓</span
                                    >
                                {/if}
                            </div>

                            <h3
                                class="font-bold text-lg text-gray-900 mb-1 truncate w-full"
                                title={user.displayName}
                            >
                                {user.displayName}
                            </h3>
                            <p
                                class="text-sm text-gray-500 mb-3 truncate w-full"
                                title={user.email}
                            >
                                {user.email}
                            </p>

                            <div class="flex gap-2 mb-4">
                                <span
                                    class={`px-2 py-1 text-xs rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
                                >
                                    {user.role === "admin" ? "مسؤول" : "مستخدم"}
                                </span>
                                <span
                                    class={`px-2 py-1 text-xs rounded-full ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                >
                                    {user.isActive ? "نشط" : "غير نشط"}
                                </span>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-2 w-full">
                                <button
                                    on:click={() => viewUser(user.uid)}
                                    class="flex-1 px-3 py-2 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg hover:bg-teal-100 transition-colors"
                                >
                                    إدارة
                                </button>
                                <button
                                    on:click={() =>
                                        handleDelete(
                                            user.uid,
                                            user.displayName,
                                        )}
                                    class="px-3 py-2 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    title="حذف"
                                >
                                    🗑️
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
                                        checked={selectedUsers.size ===
                                            users.length && users.length > 0}
                                        on:change={toggleSelectAll}
                                        class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    />
                                </th>
                                <th class="p-4">المستخدم</th>
                                <th class="p-4">البريد الإلكتروني</th>
                                <th class="p-4">الدور</th>
                                <th class="p-4">الحالة</th>
                                <th class="p-4">تاريخ التسجيل</th>
                                <th class="p-4 text-left">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each users as user (user.uid)}
                                <tr
                                    class="hover:bg-gray-50/50 transition-colors {selectedUsers.has(
                                        user.uid,
                                    )
                                        ? 'bg-teal-50/30'
                                        : ''}"
                                >
                                    <td class="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.has(
                                                user.uid,
                                            )}
                                            on:change={() =>
                                                toggleSelection(user.uid)}
                                            class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                        />
                                    </td>
                                    <td class="p-4">
                                        <div class="flex items-center gap-3">
                                            <img
                                                src={user.photoURL ||
                                                    `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                                                alt=""
                                                class="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                            <div>
                                                <div
                                                    class="font-bold text-gray-900 flex items-center gap-1"
                                                >
                                                    {user.displayName}
                                                    {#if user.verified}
                                                        <span
                                                            class="text-blue-500 text-[10px]"
                                                            >✓</span
                                                        >
                                                    {/if}
                                                </div>
                                                <div
                                                    class="text-xs text-gray-500 font-mono"
                                                >
                                                    {user.uid.substring(
                                                        0,
                                                        8,
                                                    )}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-4 text-gray-600"
                                        >{user.email}</td
                                    >
                                    <td class="p-4">
                                        <span
                                            class={`px-2 py-1 rounded-full text-xs ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
                                        >
                                            {user.role === "admin"
                                                ? "مسؤول"
                                                : "مستخدم"}
                                        </span>
                                    </td>
                                    <td class="p-4">
                                        <span
                                            class={`px-2 py-1 rounded-full text-xs ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {user.isActive ? "نشط" : "غير نشط"}
                                        </span>
                                    </td>
                                    <td class="p-4 text-gray-500">
                                        {new Date(
                                            user.createdAt,
                                        ).toLocaleDateString("ar-SA")}
                                    </td>
                                    <td class="p-4">
                                        <div class="flex justify-end gap-2">
                                            <button
                                                on:click={() =>
                                                    viewUser(user.uid)}
                                                class="p-1.5 text-teal-600 hover:bg-teal-50 rounded transition-colors"
                                                title="إدارة"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                on:click={() =>
                                                    handleDelete(
                                                        user.uid,
                                                        user.displayName,
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

        {#if hasMore}
            <div class="flex justify-center mt-6">
                <button
                    class="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 shadow-sm font-medium transition-colors"
                    on:click={loadMore}
                    disabled={loading}
                >
                    {loading ? "جاري التحميل..." : "تحميل المزيد"}
                </button>
            </div>
        {/if}
    {/if}
</div>
