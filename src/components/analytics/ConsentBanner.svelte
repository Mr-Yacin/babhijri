<script lang="ts">
    import { onMount } from 'svelte';
    
    let showBanner = $state(false);
    let consentGiven = $state(false);
    
    onMount(() => {
        const consent = localStorage.getItem('analytics-consent');
        if (!consent) {
            showBanner = true;
        } else {
            consentGiven = consent === 'true';
        }
    });
    
    function acceptConsent() {
        localStorage.setItem('analytics-consent', 'true');
        showBanner = false;
        consentGiven = true;
        
        // Reload to initialize analytics
        window.location.reload();
    }
    
    function declineConsent() {
        localStorage.setItem('analytics-consent', 'false');
        showBanner = false;
    }
</script>

{#if showBanner}
    <div class="consent-banner">
        <div class="consent-content">
            <p class="consent-text">
                نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك وعرض إعلانات مخصصة. 
                باستخدامك للموقع، فإنك توافق على سياسة الخصوصية الخاصة بنا.
            </p>
            <div class="consent-actions">
                <button onclick={acceptConsent} class="btn-accept">
                    موافق
                </button>
                <button onclick={declineConsent} class="btn-decline">
                    رفض
                </button>
                <a href="/privacy" class="btn-learn-more">
                    معرفة المزيد
                </a>
            </div>
        </div>
    </div>
{/if}

<style>
    .consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        color: white;
        padding: 1.5rem;
        z-index: 9999;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .consent-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        text-align: center;
    }
    
    .consent-text {
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0;
        direction: rtl;
    }
    
    .consent-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    button, a {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-block;
    }
    
    .btn-accept {
        background: #14b8a6;
        color: white;
        border: none;
    }
    
    .btn-accept:hover {
        background: #0d9488;
    }
    
    .btn-decline {
        background: transparent;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .btn-decline:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .btn-learn-more {
        background: transparent;
        color: #14b8a6;
        border: 1px solid #14b8a6;
    }
    
    .btn-learn-more:hover {
        background: rgba(20, 184, 166, 0.1);
    }
    
    @media (min-width: 768px) {
        .consent-content {
            flex-direction: row;
            justify-content: space-between;
            text-align: right;
        }
        
        .consent-actions {
            flex-shrink: 0;
        }
    }
</style>
