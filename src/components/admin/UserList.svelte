<script lang="ts">
    import { onMount } from "svelte";
    import { AdminService } from "../../lib/services/admin";
    import type { UserListItem, AdminFilters } from "../../lib/types/user";
    import UserListTable from "./UserListTable.svelte";
    import UserFilters from "./UserFilters.svelte";

    let users: UserListItem[] = [];
    let loading = true;
    let hasMore = false;
    let lastDoc: any = null;
    let filters: AdminFilters = {};

    async function loadUsers(reset = false) {
        loading = true;
        try {
            if (reset) {
                lastDoc = null;
                users = [];
            }
            const result = await AdminService.getAllUsers(filters, 20, lastDoc);
            users = [...users, ...result.users];
            lastDoc = result.lastDoc;
            hasMore = result.hasMore;
        } catch (e) {
            console.error("Failed to load users", e);
        } finally {
            loading = false;
        }
    }

    function applyFilters(event: CustomEvent<AdminFilters>) {
        filters = event.detail;
        loadUsers(true);
    }

    function loadMore() {
        if (hasMore && !loading) {
            loadUsers();
        }
    }

    function handleRefresh() {
        loadUsers(true);
    }

    onMount(() => loadUsers());
</script>

<UserFilters on:apply={applyFilters} />

{#if loading && users.length === 0}
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
{/if}

<UserListTable {users} on:refresh={handleRefresh} />

{#if hasMore}
    <div class="flex justify-center mt-6">
        <button
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            on:click={loadMore}
            disabled={loading}
        >
            {loading ? "جاري التحميل..." : "تحميل المزيد"}
        </button>
    </div>
{/if}
