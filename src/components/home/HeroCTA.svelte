<script lang="ts">
    import { authStore } from "../../lib/stores/auth";
    import { analytics } from "../../lib/utils/analytics";
    
    function handleCTAClick(buttonId: string, buttonText: string) {
        analytics.clickButton(buttonId, buttonText);
    }
</script>

<!-- Auth CTA Box - Changes based on login status -->
<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 mb-8 shadow-2xl">
    {#if $authStore.loading}
        <!-- Loading state -->
        <div class="text-center py-4">
            <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
    {:else if $authStore.isLoggedIn}
        <!-- Logged in - Show personalized CTAs -->
        <p class="text-2xl md:text-3xl font-bold text-white mb-6">
            👋 مرحباً بعودتك!
        </p>
        <p class="text-lg text-teal-100 mb-8">
            استمر في رحلتك للعثور على شريك حياتك المثالي
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
                href="/app"
                on:click={() => handleCTAClick('hero-browse-profiles-logged-in', 'تصفح الملفات الشخصية')}
                class="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/50 flex items-center justify-center transform hover:scale-105"
            >
                <span>تصفح الملفات الشخصية</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>
            </a>
            <a
                href="/app/dashboard"
                on:click={() => handleCTAClick('hero-dashboard-logged-in', 'لوحة التحكم')}
                class="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 px-10 py-5 rounded-full font-bold text-xl hover:bg-white/30 transition-all flex items-center justify-center"
            >
                <span>لوحة التحكم</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            </a>
        </div>
        <p class="text-sm text-teal-200 mt-6">
            ✓ حسابك نشط  ✓ ابدأ التصفح الآن  ✓ تواصل مع الأعضاء
        </p>
    {:else}
        <!-- Not logged in - Show signup CTAs -->
        <p class="text-2xl md:text-3xl font-bold text-white mb-6">
            🔒 سجل الآن لتصفح آلاف الملفات الشخصية
        </p>
        <p class="text-lg text-teal-100 mb-8">
            انضم مجاناً واكتشف أشخاص مميزين يبحثون عن شريك الحياة
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
                href="/app/signup"
                on:click={() => handleCTAClick('hero-signup', 'إنشاء حساب جديد')}
                class="w-full sm:w-auto bg-pink-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-pink-700 transition-all shadow-lg hover:shadow-pink-500/50 flex items-center justify-center transform hover:scale-105"
            >
                <span>إنشاء حساب جديد</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
            </a>
            <a
                href="/app/login"
                on:click={() => handleCTAClick('hero-login', 'تسجيل الدخول')}
                class="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 px-10 py-5 rounded-full font-bold text-xl hover:bg-white/30 transition-all flex items-center justify-center"
            >
                <span>تسجيل الدخول</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
            </a>
        </div>
        <p class="text-sm text-teal-200 mt-6">
            ✓ مجاني تماماً  ✓ آمن ومحمي  ✓ خصوصية كاملة
        </p>
    {/if}
</div>
