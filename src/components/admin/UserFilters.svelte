<script lang="ts">
    import type { AdminFilters } from "../../lib/types/user";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let search = "";
    let role: "user" | "admin" | "all" = "all";
    let status: "active" | "inactive" | "all" = "all";
    let verified: "verified" | "unverified" | "all" = "all";

    function apply() {
        const filters: AdminFilters = {};
        if (search.trim()) filters.search = search.trim();
        if (role !== "all") filters.role = role;
        if (status !== "all") filters.status = status;
        if (verified !== "all") filters.verified = verified;
        dispatch("apply", filters);
    }

    function reset() {
        search = "";
        role = "all";
        status = "all";
        verified = "all";
        dispatch("apply", {});
    }
</script>

<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
            type="text"
            placeholder="بحث..."
            bind:value={search}
            class="border rounded px-3 py-2"
        />
        <select bind:value={role} class="border rounded px-3 py-2">
            <option value="all">كل الأدوار</option>
            <option value="user">مستخدم</option>
            <option value="admin">مشرف</option>
        </select>
        <select bind:value={status} class="border rounded px-3 py-2">
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
        </select>
        <select bind:value={verified} class="border rounded px-3 py-2">
            <option value="all">كل التحقق</option>
            <option value="verified">موثق</option>
            <option value="unverified">غير موثق</option>
        </select>
    </div>
    <div class="mt-4 flex space-x-2">
        <button
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            on:click={apply}>تطبيق</button
        >
        <button
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            on:click={reset}>إعادة تعيين</button
        >
    </div>
</div>
