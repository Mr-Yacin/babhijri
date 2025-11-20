<script lang="ts">
    import type { UserListItem } from "../../lib/types/user";
    export let users: UserListItem[] = [];

    // Emit events for actions
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    function viewUser(uid: string) {
        dispatch("view", { uid });
        // navigate to user detail page
        window.location.href = `/app/admin/users/detail?uid=${uid}`;
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
            <tr class="border-t">
                <td class="px-4 py-2">{user.displayName}</td>
                <td class="px-4 py-2">{user.email}</td>
                <td class="px-4 py-2 text-center">
                    {#if user.role === "admin"}
                        <span
                            class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
                            >مشرف</span
                        >
                    {:else}
                        <span
                            class="bg-gray-100 text-gray-800 px-2 py-1 rounded"
                            >مستخدم</span
                        >
                    {/if}
                </td>
                <td class="px-4 py-2 text-center">
                    {#if user.isActive}
                        <span
                            class="bg-green-100 text-green-800 px-2 py-1 rounded"
                            >نشط</span
                        >
                    {:else}
                        <span class="bg-red-100 text-red-800 px-2 py-1 rounded"
                            >غير نشط</span
                        >
                    {/if}
                </td>
                <td class="px-4 py-2 flex space-x-2 justify-end">
                    <button
                        class="text-blue-600 hover:underline"
                        on:click={() => viewUser(user.uid)}
                    >
                        عرض
                    </button>
                    <button
                        class="text-yellow-600 hover:underline"
                        on:click={() => toggleActive(user.uid, user.isActive)}
                    >
                        {user.isActive ? "تعطيل" : "تفعيل"}
                    </button>
                    <button
                        class="text-red-600 hover:underline"
                        on:click={() => deleteUser(user.uid)}
                    >
                        حذف
                    </button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
