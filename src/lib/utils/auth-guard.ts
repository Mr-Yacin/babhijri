import { authStore } from '../stores/auth';
import { userService } from '../services/user';
import { get } from 'svelte/store';

/**
 * Checks if the current user has admin privileges.
 * If not, redirects to the dashboard.
 * @returns Promise<boolean> true if admin, false if redirected
 */
export async function requireAdmin(): Promise<boolean> {
    return new Promise((resolve) => {
        const unsubscribe = authStore.subscribe(async (state) => {
            if (state.loading) return;

            if (!state.user) {
                window.location.href = '/login';
                resolve(false);
                unsubscribe();
                return;
            }

            try {
                const profile = await userService.getUserProfile(state.user.uid);
                if (profile?.role !== 'admin') {
                    console.warn('Unauthorized access attempt to admin area');
                    window.location.href = '/app/dashboard';
                    resolve(false);
                } else {
                    resolve(true);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                window.location.href = '/app/dashboard';
                resolve(false);
            }
            unsubscribe();
        });
    });
}
