import { writable } from 'svelte/store';
import { auth } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface AuthState {
    user: User | null;
    loading: boolean;
    isLoggedIn: boolean;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        user: null,
        loading: true,
        isLoggedIn: false
    });

    return {
        subscribe,
        init: () => {
            console.log('Initializing Auth Store...');
            onAuthStateChanged(auth, (user) => {
                console.log('Auth State Changed:', user ? 'User logged in' : 'No user');
                set({
                    user,
                    loading: false,
                    isLoggedIn: !!user
                });
            });
        }
    };
}

export const authStore = createAuthStore();
