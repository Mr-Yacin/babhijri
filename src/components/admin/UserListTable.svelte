<script lang="ts">
    import type { UserListItem } from "../../lib/types/user";
    export let users: UserListItem[] = [];

    // Emit events for actions
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    function viewUser(uid: string) {
        dispatch("view", { uid });
        // navigate to user detail page
        window.location.href = `/app/admin/users/${uid}`;
    }

    function toggleActive(uid: string, isActive: boolean) {
        // Call admin service to toggle status
        import("../../lib/services/admin").then(({ AdminService }) => {
            AdminService.toggleUserStatus(uid, !isActive)
                .then(() => {
                    // Refresh page or emit event
                    dispatch("refresh");
                })
                .catch((err) => console.error(err));
        });
    }

    function deleteUser(uid: string) {
        if (confirm("هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع.")) {
            import("../../lib/services/admin").then(({ AdminService }) => {
                AdminService.deleteUserAccount(uid)
                    .then(() => {
                        dispatch("refresh");
                    })
                    .catch((err) => console.error(err));
            });
        }
    }
</script>

<!-- Desktop View -->
<div class="hidden md:block overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200">
        <thead>
            <tr class="bg-gray-100">
                <th class="px-4 py-2 text-right">الاسم</th>
                <th class="px-4 py-2 text-right">البريد الإلكتروني</th>
                <th class="px-4 py-2 text-right">الدور</th>
                <th class="px-4 py-2 text-right">الحالة</th>
                <th class="px-4 py-2 text-right">الإجراءات</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user}
                <tr class="border-t hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-2 font-medium">{user.displayName}</td>
                    <td class="px-4 py-2 text-gray-600">{user.email}</td>
                    <td class="px-4 py-2 text-center">
                        {#if user.role === "admin"}
                            <span
                                class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium"
                                >مشرف</span
                            >
                        {:else}
                            <span
                                class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium"
                                >مستخدم</span
                            >
                        {/if}
                    </td>
                    <td class="px-4 py-2 text-center">
                        {#if user.isActive}
                            <span
                                class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"
                                >نشط</span
                            >
                        {:else}
                            <span
                                class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium"
                                >غير نشط</span
                            >
                        {/if}
                    </td>
                    <td class="px-4 py-2 flex space-x-2 justify-end gap-2">
                        <button
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            on:click={() => viewUser(user.uid)}
                        >
                            عرض
                        </button>
                        <button
                            class="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                            on:click={() =>
                                toggleActive(user.uid, user.isActive)}
                        >
                            {user.isActive ? "تعطيل" : "تفعيل"}
                        </button>
                        <button
                            class="text-red-600 hover:text-red-800 text-sm font-medium"
                            on:click={() => deleteUser(user.uid)}
                        >
                            حذف
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- Mobile View -->
<div class="md:hidden space-y-4">
    {#each users as user}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-bold text-gray-900">{user.displayName}</h3>
                    <p class="text-sm text-gray-500">{user.email}</p>
                </div>
                <div class="flex flex-col gap-1 items-end">
                    {#if user.role === "admin"}
                        <span
                            class="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs"
                            >مشرف</span
                        >
                    {:else}
                        <span
                            class="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs"
                            >مستخدم</span
                        >
                    {/if}

                    {#if user.isActive}
                        <span
                            class="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs"
                            >نشط</span
                        >
                    {:else}
                        <span
                            class="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs"
                            >غير نشط</span
                        >
                    {/if}
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                    class="text-blue-600 font-medium text-sm"
                    on:click={() => viewUser(user.uid)}
                >
                    عرض التفاصيل
                </button>
                <button
                    class="text-yellow-600 font-medium text-sm"
                    on:click={() => toggleActive(user.uid, user.isActive)}
                >
                    {user.isActive ? "تعطيل" : "تفعيل"}
                </button>
                <button
                    class="text-red-600 font-medium text-sm"
                    on:click={() => deleteUser(user.uid)}
                >
                    حذف
                </button>
            </div>
        </div>
    {/each}
</div>
