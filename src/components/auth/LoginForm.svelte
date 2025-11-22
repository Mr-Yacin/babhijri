<script lang="ts">
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { getFirebaseAuth } from "../../lib/firebase";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function handleLogin() {
        error = "";
        loading = true;
        try {
            const auth = getFirebaseAuth();
            if (!auth) {
                error = "خطأ في تهيئة المصادقة";
                loading = false;
                return;
            }
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Get the ID token
            const idToken = await userCredential.user.getIdToken();
            
            // Create session cookie via API
            const response = await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken })
            });

            if (!response.ok) {
                throw new Error('Failed to create session');
            }

            // Redirect to app
            window.location.href = "/app";
        } catch (e: any) {
            console.error(e);
            switch (e.code) {
                case "auth/invalid-credential":
                    error = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
                    break;
                case "auth/user-not-found":
                    error = "المستخدم غير موجود";
                    break;
                case "auth/wrong-password":
                    error = "كلمة المرور غير صحيحة";
                    break;
                default:
                    error = "حدث خطأ أثناء تسجيل الدخول: " + e.message;
            }
        } finally {
            loading = false;
        }
    }
</script>

<form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
    {#if error}
        <div
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
            role="alert"
        >
            {error}
        </div>
    {/if}

    <div class="rounded-md shadow-sm -space-y-px">
        <div class="mb-4">
            <label for="email-address" class="sr-only">البريد الإلكتروني</label>
            <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                bind:value={email}
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="البريد الإلكتروني"
            />
        </div>
        <div>
            <label for="password" class="sr-only">كلمة المرور</label>
            <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                bind:value={password}
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
            />
        </div>
    </div>

    <div class="flex items-center justify-between">
        <div class="flex items-center">
            <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="mr-2 block text-sm text-gray-900">
                تذكرني
            </label>
        </div>

        <div class="text-sm">
            <a href="#" class="font-medium text-teal-600 hover:text-teal-500">
                نسيت كلمة المرور؟
            </a>
        </div>
    </div>

    <div>
        <button
            type="submit"
            disabled={loading}
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {#if loading}
                جاري التحميل...
            {:else}
                تسجيل الدخول
            {/if}
        </button>
    </div>

    <div class="text-center text-sm text-gray-600">
        ليس لديك حساب؟
        <a
            href="/app/signup"
            class="font-medium text-teal-600 hover:text-teal-500"
        >
            سجل الآن
        </a>
    </div>
</form>
