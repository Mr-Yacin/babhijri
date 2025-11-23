<script lang="ts">
    import { authStore } from "../../lib/stores/auth";
    import { auth } from "../../lib/firebase";
    import { signOut } from "firebase/auth";

    import { userService } from "../../lib/services/user";
    import { subscribeToUnreadCount } from "../../lib/services/notification";
    import type { UserProfile } from "../../lib/types/user";

    let isDropdownOpen = $state(false);
    let userProfile: UserProfile | null = $state(null);
    let unreadCount = $state(0);
    let unsubscribe: (() => void) | null = null;

    // Subscribe to auth store to fetch profile when user logs in
    $effect(() => {
        if ($authStore.user) {
            userService.getUserProfile($authStore.user.uid).then((profile) => {
                userProfile = profile;
            });

            // Subscribe to unread message count
            if (unsubscribe) {
                unsubscribe();
            }
            unsubscribe = subscribeToUnreadCount(
                $authStore.user.uid,
                (count) => {
                    unreadCount = count;
                },
            );
        } else {
            userProfile = null;
            unreadCount = 0;
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    });

    async function handleLogout() {
        try {
            // Clear session cookie first
            await fetch("/api/auth/session", {
                method: "DELETE",
            });

            // Then sign out from Firebase
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }

    function closeDropdown() {
        isDropdownOpen = false;
    }

    // Get user initials for avatar
    function getUserInitials(user: any): string {
        if (user?.displayName) {
            const names = user.displayName.split(" ");
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return user.displayName.substring(0, 2).toUpperCase();
        }
        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return "U";
    }

    // Get display name (shortened if needed)
    function getDisplayName(user: any): string {
        if (user?.displayName) {
            return user.displayName;
        }
        if (user?.email) {
            return user.email.split("@")[0];
        }
        return "مستخدم";
    }
</script>

{#if $authStore.loading}
    <div class="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
{:else if $authStore.isLoggedIn}
    <div class="relative">
        <!-- User Avatar Button -->
        <button
            onclick={toggleDropdown}
            class="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-full"
            aria-label="User menu"
        >
            <!-- Avatar Circle -->
            <div
                class="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md"
            >
                {getUserInitials($authStore.user)}
            </div>

            <!-- Dropdown Arrow -->
            <svg
                class="w-4 h-4 text-gray-500 transition-transform {isDropdownOpen
                    ? 'rotate-180'
                    : ''}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </button>

        <!-- Dropdown Menu -->
        {#if isDropdownOpen}
            <!-- Backdrop -->
            <button
                class="fixed inset-0 z-10"
                onclick={closeDropdown}
                aria-label="Close menu"
            ></button>

            <!-- Menu Content -->
            <div
                class="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20 animate-fadeIn"
            >
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-semibold text-gray-900 truncate">
                        {getDisplayName($authStore.user)}
                    </p>
                    <p class="text-xs text-gray-500 truncate mt-1">
                        {$authStore.user?.email}
                    </p>
                </div>

                <!-- Menu Items -->
                <div class="py-1">
                    {#if userProfile?.role === "admin"}
                        <a
                            href="/app/admin"
                            class="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors font-medium"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                            <span>لوحة الإدارة</span>
                        </a>
                    {/if}

                    <a
                        href="/app/dashboard"
                        class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        </svg>
                        <span>لوحة التحكم</span>
                    </a>

                    <a
                        href="/app/profile"
                        class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <span>الملف الشخصي</span>
                    </a>

                    <a
                        href="/app/messages"
                        class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors relative"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <span>الرسائل</span>
                        {#if unreadCount > 0}
                            <span
                                class="absolute top-2 left-3 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full"
                            >
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        {/if}
                    </a>

                    <a
                        href="/app/settings"
                        class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span>الإعدادات</span>
                    </a>
                </div>

                <!-- Logout -->
                <div class="border-t border-gray-100 pt-1">
                    <button
                        onclick={handleLogout}
                        class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </div>
        {/if}
    </div>
{:else}
    <a
        href="/app/login"
        class="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md"
    >
        تسجيل الدخول
    </a>
{/if}

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
    }
</style>
