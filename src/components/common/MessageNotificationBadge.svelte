<script lang="ts">
    import { authStore } from "../../lib/stores/auth";
    import { subscribeToUnreadCount } from "../../lib/services/notification";

    let unreadCount = $state(0);
    let unsubscribe: (() => void) | null = null;

    // Subscribe to unread count when user is logged in
    $effect(() => {
        if ($authStore.user) {
            // Clean up previous subscription if exists
            if (unsubscribe) {
                unsubscribe();
            }

            // Subscribe to real-time unread count
            unsubscribe = subscribeToUnreadCount($authStore.user.uid, (count) => {
                unreadCount = count;
            });
        } else {
            // Clean up subscription when logged out
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
            unreadCount = 0;
        }

        // Cleanup on component unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    });
</script>

{#if unreadCount > 0}
    <span 
        class="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse"
    >
        {unreadCount > 99 ? '99+' : unreadCount}
    </span>
{/if}

<style>
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.05);
        }
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>
