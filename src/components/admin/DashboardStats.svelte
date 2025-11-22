<script lang="ts">
    import { onMount } from "svelte";
    import { db } from "../../lib/firebase";
    import { collection, getCountFromServer } from "firebase/firestore";

    let stats = {
        users: 0,
        profiles: 0,
    };
    let loading = true;

    onMount(async () => {
        try {
            const usersColl = collection(db, "users");
            const profilesColl = collection(db, "profiles");

            const usersSnapshot = await getCountFromServer(usersColl);
            const profilesSnapshot = await getCountFromServer(profilesColl);

            stats = {
                users: usersSnapshot.data().count,
                profiles: profilesSnapshot.data().count,
            };
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            loading = false;
        }
    });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <!-- Total Users -->
    <div
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
        <div class="flex items-center justify-between mb-4">
            <div>
                <p
                    class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                    إجمالي المستخدمين
                </p>
                {#if loading}
                    <div
                        class="h-10 w-20 bg-gray-100 rounded animate-pulse mt-2"
                    ></div>
                {:else}
                    <p class="text-4xl font-bold text-gray-900 mt-1">
                        {stats.users}
                    </p>
                {/if}
            </div>
            <div
                class="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center"
            >
                <span class="text-3xl">👥</span>
            </div>
        </div>
        <a
            href="/app/admin/users"
            class="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
        >
            عرض جميع المستخدمين ←
        </a>
    </div>

    <!-- Total Profiles -->
    <div
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
        <div class="flex items-center justify-between mb-4">
            <div>
                <p
                    class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                    الملفات الشخصية
                </p>
                {#if loading}
                    <div
                        class="h-10 w-20 bg-gray-100 rounded animate-pulse mt-2"
                    ></div>
                {:else}
                    <p class="text-4xl font-bold text-gray-900 mt-1">
                        {stats.profiles}
                    </p>
                {/if}
            </div>
            <div
                class="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center"
            >
                <span class="text-3xl">❤️</span>
            </div>
        </div>
        <a
            href="/app/admin/profiles"
            class="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
        >
            إدارة الملفات ←
        </a>
    </div>

    <!-- System Status -->
    <div
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
        <div class="flex items-center justify-between mb-4">
            <div>
                <p
                    class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                    حالة النظام
                </p>
                <p
                    class="text-4xl font-bold text-green-600 mt-1 flex items-center gap-2"
                >
                    <span
                        class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                    ></span>
                    متصل
                </p>
            </div>
            <div
                class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center"
            >
                <span class="text-3xl">✓</span>
            </div>
        </div>
        <p class="text-sm text-gray-500">جميع الأنظمة تعمل بشكل طبيعي</p>
    </div>
</div>
