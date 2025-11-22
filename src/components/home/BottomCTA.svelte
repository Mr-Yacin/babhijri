<script lang="ts">
    import { authStore } from "../../lib/stores/auth";
    import { analytics } from "../../lib/utils/analytics";
    
    function handleCTAClick(buttonId: string, buttonText: string) {
        analytics.clickButton(buttonId, buttonText);
    }
</script>

<div class="container mx-auto px-4 relative z-10 text-center">
    <div class="max-w-4xl mx-auto">
        {#if $authStore.loading}
            <!-- Loading state -->
            <div class="py-8">
                <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
        {:else if $authStore.isLoggedIn}
            <!-- Logged in - Show personalized message -->
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span class="text-sm font-semibold">أنت متصل الآن</span>
            </div>
            
            <h2 class="text-3xl md:text-5xl font-bold mb-6">
                استمر في البحث عن شريك حياتك
            </h2>
            <p class="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
                تصفح الملفات الجديدة، أرسل الرسائل، وابدأ محادثات مع أشخاص مميزين.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a
                    href="/app"
                    on:click={() => handleCTAClick('bottom-browse-profiles-logged-in', 'تصفح الملفات')}
                    class="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-pink-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:from-amber-600 hover:to-pink-700 transition-all shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 flex items-center justify-center"
                >
                    <span>تصفح الملفات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                    </svg>
                </a>
                <a
                    href="/app/messages"
                    on:click={() => handleCTAClick('bottom-messages-logged-in', 'الرسائل')}
                    class="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-5 rounded-full font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center"
                >
                    <span>الرسائل</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                </a>
            </div>
            
            <div class="flex flex-wrap justify-center gap-6 text-sm">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>حسابك نشط</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>وصول كامل</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>تواصل بدون حدود</span>
                </div>
            </div>
        {:else}
            <!-- Not logged in - Show signup CTA -->
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span class="text-sm font-semibold">+127 عضو جديد هذا الأسبوع</span>
            </div>
            
            <h2 class="text-3xl md:text-5xl font-bold mb-6">
                جاهز للبدء في رحلتك؟
            </h2>
            <p class="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
                انضم إلى آلاف الأعضاء الذين وجدوا طريقهم نحو النجاح والحب من
                خلال منصتنا.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a
                    href="/app/signup"
                    on:click={() => handleCTAClick('bottom-signup', 'سجل مجاناً الآن')}
                    class="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-pink-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:from-amber-600 hover:to-pink-700 transition-all shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 flex items-center justify-center"
                >
                    <span>سجل مجاناً الآن</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                    </svg>
                </a>
                <a
                    href="/app/login"
                    on:click={() => handleCTAClick('bottom-login', 'تسجيل الدخول')}
                    class="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-5 rounded-full font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center"
                >
                    <span>تسجيل الدخول</span>
                </a>
            </div>
            
            <div class="flex flex-wrap justify-center gap-6 text-sm">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>مجاني 100%</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>بدون بطاقة ائتمان</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>خصوصية وأمان تام</span>
                </div>
            </div>
        {/if}
    </div>
</div>
