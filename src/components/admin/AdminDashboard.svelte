<script lang="ts">
    import { onMount } from "svelte";
    import { AdminService } from "../../lib/services/admin";
    import type { AdminStats } from "../../lib/types/user";
    import UserStatsCard from "./UserStatsCard.svelte";

    let stats: AdminStats | null = null;
    let loading = true;

    onMount(async () => {
        try {
            stats = await AdminService.getAdminStats();
        } catch (e) {
            console.error("Failed to load admin stats", e);
        } finally {
            loading = false;
        }
    });
</script>

{#if loading}
    <div class="flex justify-center items-center py-12">
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
{:else if stats}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserStatsCard
            title="إجمالي المستخدمين"
            value={stats.totalUsers}
            color="indigo"
        />
        <UserStatsCard
            title="المستخدمون النشطون"
            value={stats.activeUsers}
            color="green"
        />
        <UserStatsCard
            title="المستخدمون غير النشطين"
            value={stats.inactiveUsers}
            color="gray"
        />
        <UserStatsCard
            title="المستخدمون الموثقون"
            value={stats.verifiedUsers}
            color="blue"
        />
        <UserStatsCard
            title="المستخدمون الجدد هذا الأسبوع"
            value={stats.newUsersThisWeek}
            color="purple"
        />
        <UserStatsCard
            title="المستخدمون الجدد هذا الشهر"
            value={stats.newUsersThisMonth}
            color="purple"
        />
    </div>
{/if}

<section class="mt-8">
    <a
        href="/app/admin/users"
        class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
    >
        إدارة المستخدمين
    </a>
</section>
