<script lang="ts">
    import { authStore } from "../../lib/stores/auth";
    import FeaturedProfiles from "./FeaturedProfiles.svelte";
</script>

<div class="text-center mb-16">
    <span class="text-pink-600 font-semibold tracking-wider uppercase text-sm">
        تعارف جاد
    </span>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
        أعضاء يبحثون عن شريك الحياة
    </h2>
    <p class="text-gray-600 max-w-2xl mx-auto mb-4">
        تصفح ملفات أعضاء جادين يبحثون عن الزواج والاستقرار.
        مجتمعنا يضم نخبة من العرب في أوروبا وأمريكا وكندا.
    </p>
    
    {#if !$authStore.isLoggedIn && !$authStore.loading}
        <div class="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            <span>سجل الدخول لرؤية التفاصيل الكاملة</span>
        </div>
    {:else if $authStore.isLoggedIn}
        <div class="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>انقر على أي ملف للمزيد من التفاصيل</span>
        </div>
    {/if}
</div>

<!-- Profiles Container -->
<div class="relative">
    {#if $authStore.loading}
        <!-- Loading state -->
        <div class="flex items-center justify-center py-20">
            <div class="text-center">
                <div class="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-gray-600">جاري التحميل...</p>
            </div>
        </div>
    {:else if !$authStore.isLoggedIn}
        <!-- Not logged in - Show blur overlay with CTA -->
        <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-4 pointer-events-auto border-4 border-pink-200">
                <div class="text-center">
                    <div class="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        اكتشف آلاف الملفات المميزة
                    </h3>
                    <p class="text-lg text-gray-600 mb-8">
                        سجل الآن مجاناً لتصفح الملفات الكاملة، إرسال الرسائل، والتواصل مع أشخاص مميزين
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/app/signup"
                            class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                        >
                            <span>ابدأ الآن مجاناً</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                            </svg>
                        </a>
                        <a
                            href="/app/login"
                            class="bg-white text-gray-800 border-2 border-gray-300 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
                        >
                            <span>لدي حساب بالفعل</span>
                        </a>
                    </div>
                    <p class="text-sm text-gray-500 mt-6">
                        ✓ التسجيل مجاني  ✓ بدون بطاقة ائتمان  ✓ خصوصية تامة
                    </p>
                </div>
            </div>
        </div>

        <!-- Blurred profiles in background -->
        <div class="blur-md select-none pointer-events-none" style="filter: blur(8px);">
            <FeaturedProfiles />
        </div>
    {:else}
        <!-- Logged in - Show profiles without blur -->
        <FeaturedProfiles />
        
        <!-- CTA to browse more -->
        <div class="mt-12 text-center">
            <a
                href="/app"
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                <span>تصفح جميع الملفات</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clip-rule="evenodd"
                    />
                </svg>
            </a>
        </div>
    {/if}
</div>
