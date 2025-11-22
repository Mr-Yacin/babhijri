<script lang="ts">
    import { slide, fly, fade } from "svelte/transition";
    import { authStore } from "../../lib/stores/auth";
    import { auth } from "../../lib/firebase";
    import { signOut } from "firebase/auth";
    import { userService } from "../../lib/services/user";
    import type { UserProfile } from "../../lib/types/user";

    interface NavLink {
        name: string;
        href: string;
        translation: string;
    }

    let { navLinks } = $props<{ navLinks: NavLink[] }>();

    let isOpen = $state(false);
    let userProfile: UserProfile | null = $state(null);

    // Subscribe to auth store to fetch profile when user logs in
    $effect(() => {
        if ($authStore.user) {
            userService.getUserProfile($authStore.user.uid).then((profile) => {
                userProfile = profile;
            });
        } else {
            userProfile = null;
        }
    });

    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }

    function closeMenu() {
        isOpen = false;
        document.body.style.overflow = "";
    }

    async function handleLogout() {
        try {
            await signOut(auth);
            closeMenu();
            window.location.href = "/";
        } catch (error) {
            console.error("Error signing out:", error);
        }
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

<button
    onclick={toggleMenu}
    class="md:hidden text-gray-600 hover:text-teal-600 transition-colors p-2"
    aria-label="Open menu"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
    </svg>
</button>

{#if isOpen}
    <!-- Backdrop -->
    <div
        class="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={closeMenu}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === "Enter" && closeMenu()}
        aria-label="Close menu overlay"
    ></div>

    <!-- Drawer -->
    <div
        class="fixed inset-y-0 right-0 w-[280px] bg-white z-50 md:hidden shadow-2xl overflow-y-auto"
        transition:fly={{ x: 280, duration: 300 }}
    >
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div
                class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50"
            >
                <span class="font-bold text-teal-700 text-lg">القائمة</span>
                <button
                    onclick={closeMenu}
                    class="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200"
                    aria-label="Close menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <!-- User Info (if logged in) -->
            {#if $authStore.isLoggedIn && $authStore.user}
                <div class="p-4 border-b border-gray-100 bg-teal-50/50">
                    <div class="flex items-center gap-3 mb-3">
                        <div
                            class="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm"
                        >
                            {getUserInitials($authStore.user)}
                        </div>
                        <div class="overflow-hidden">
                            <p class="font-semibold text-gray-900 truncate">
                                {getDisplayName($authStore.user)}
                            </p>
                            <p class="text-xs text-gray-500 truncate">
                                {$authStore.user.email}
                            </p>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Navigation Links -->
            <nav class="flex-1 p-4 space-y-1">
                {#each navLinks as link}
                    <a
                        href={link.href}
                        onclick={closeMenu}
                        class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors font-medium"
                    >
                        {link.translation}
                    </a>
                {/each}

                <div class="my-4 border-t border-gray-100"></div>

                <!-- Auth Links -->
                {#if $authStore.loading}
                    <div class="px-4 py-3">
                        <div
                            class="h-6 w-24 bg-gray-200 rounded animate-pulse"
                        ></div>
                    </div>
                {:else if $authStore.isLoggedIn}
                    {#if userProfile?.role === "admin"}
                        <a
                            href="/app/admin"
                            onclick={closeMenu}
                            class="flex items-center gap-3 px-4 py-3 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-medium mb-2"
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
                            لوحة الإدارة
                        </a>
                    {/if}

                    <a
                        href="/app/dashboard"
                        onclick={closeMenu}
                        class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors"
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
                        لوحة التحكم
                    </a>
                    <a
                        href="/app/profile"
                        onclick={closeMenu}
                        class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors"
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
                        الملف الشخصي
                    </a>
                    <a
                        href="/app/messages"
                        onclick={closeMenu}
                        class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors"
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
                        الرسائل
                    </a>
                    <a
                        href="/app/settings"
                        onclick={closeMenu}
                        class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors"
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
                        الإعدادات
                    </a>

                    <button
                        onclick={handleLogout}
                        class="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
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
                        تسجيل الخروج
                    </button>
                {:else}
                    <a
                        href="/app/login"
                        onclick={closeMenu}
                        class="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-bold shadow-md mt-4"
                    >
                        تسجيل الدخول
                    </a>
                {/if}
            </nav>

            <!-- Footer Info -->
            <div
                class="p-4 border-t border-gray-100 text-center text-xs text-gray-400"
            >
                <p>© 2024 BabHijra</p>
            </div>
        </div>
    </div>
{/if}
