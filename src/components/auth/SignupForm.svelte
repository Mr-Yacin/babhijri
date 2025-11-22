<script lang="ts">
    import {
        createUserWithEmailAndPassword,
        updateProfile,
    } from "firebase/auth";
    import { getFirebaseAuth } from "../../lib/firebase";
    import { userService } from "../../lib/services/user";

    let name = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let error = "";
    let loading = false;

    async function handleSignup() {
        error = "";

        if (password !== confirmPassword) {
            error = "كلمات المرور غير متطابقة";
            return;
        }

        if (password.length < 6) {
            error = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
            return;
        }

        loading = true;
        try {
            const auth = getFirebaseAuth();
            if (!auth) {
                error = "خطأ في تهيئة المصادقة";
                loading = false;
                return;
            }
            
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            await updateProfile(userCredential.user, {
                displayName: name,
            });

            // Create user profile in Firestore
            await userService.createUserProfile(userCredential.user, {
                displayName: name,
            });

            // Get the ID token and create session
            const idToken = await userCredential.user.getIdToken();
            
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

            window.location.href = "/app";
        } catch (e: any) {
            console.error(e);
            switch (e.code) {
                case "auth/email-already-in-use":
                    error = "البريد الإلكتروني مستخدم بالفعل";
                    break;
                case "auth/invalid-email":
                    error = "البريد الإلكتروني غير صالح";
                    break;
                case "auth/weak-password":
                    error = "كلمة المرور ضعيفة جداً";
                    break;
                default:
                    error = "حدث خطأ أثناء التسجيل: " + e.message;
            }
        } finally {
            loading = false;
        }
    }
</script>

<form class="mt-8 space-y-6" on:submit|preventDefault={handleSignup}>
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
            <label for="name" class="sr-only">الاسم الكامل</label>
            <input
                id="name"
                name="name"
                type="text"
                required
                bind:value={name}
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="الاسم الكامل"
            />
        </div>
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
        <div class="mb-4">
            <label for="password" class="sr-only">كلمة المرور</label>
            <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                bind:value={password}
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
            />
        </div>
        <div>
            <label for="confirm-password" class="sr-only"
                >تأكيد كلمة المرور</label
            >
            <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autocomplete="new-password"
                required
                bind:value={confirmPassword}
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="تأكيد كلمة المرور"
            />
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
                إنشاء حساب
            {/if}
        </button>
    </div>

    <div class="text-center text-sm text-gray-600">
        لديك حساب بالفعل؟
        <a
            href="/app/login"
            class="font-medium text-teal-600 hover:text-teal-500"
        >
            سجل دخولك
        </a>
    </div>
</form>
