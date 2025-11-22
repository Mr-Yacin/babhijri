<script lang="ts">
    import { onMount } from "svelte";

    export let slot: string;
    export let format:
        | "auto"
        | "fluid"
        | "rectangle"
        | "vertical"
        | "horizontal" = "horizontal";
    export let className: string = "";

    // Storage key for dismissed state
    const storageKey = `ad-dismissed-${slot}`;

    let isDismissed = false;
    let isVisible = true;
    let publisherId = "";

    onMount(() => {
        // Get publisher ID from environment
        publisherId = import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || "";

        // Check if ad was previously dismissed
        try {
            const dismissed = localStorage.getItem(storageKey);
            if (dismissed === "true") {
                isDismissed = true;
                isVisible = false;
            }
        } catch (error) {
            console.error("[DismissableAd] Error reading localStorage:", error);
        }

        console.log(
            "[DismissableAd] Mounted - Slot:",
            slot,
            "Dismissed:",
            isDismissed,
        );

        // Initialize AdSense for the ad unit if not dismissed
        if (!isDismissed && typeof window !== "undefined") {
            try {
                (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle.push({});
                console.log("[DismissableAd] Ad initialized - Slot:", slot);
            } catch (error) {
                console.error("[DismissableAd] Error initializing ad:", error);
            }
        }
    });

    function handleDismiss() {
        console.log("[DismissableAd] Dismissing ad - Slot:", slot);

        // Animate out
        isVisible = false;

        // Save to localStorage
        try {
            localStorage.setItem(storageKey, "true");
        } catch (error) {
            console.error(
                "[DismissableAd] Error saving to localStorage:",
                error,
            );
        }

        // Set dismissed state after animation
        setTimeout(() => {
            isDismissed = true;
        }, 300);
    }
</script>

{#if !isDismissed}
    <div
        class="dismissable-ad-container {className}"
        class:slide-out={!isVisible}
    >
        <button
            class="dismiss-button"
            on:click={handleDismiss}
            aria-label="إغلاق الإعلان"
            title="إغلاق الإعلان"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-5 h-5"
            >
                <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                />
            </svg>
        </button>

        <div class="ad-content">
            <ins
                class="adsbygoogle"
                style="display:block"
                data-ad-client={publisherId}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            ></ins>
        </div>
    </div>
{/if}

<style>
    .dismissable-ad-container {
        position: relative;
        background: white;
        border-top: 1px solid #e5e7eb;
        border-bottom: 1px solid #e5e7eb;
        transition:
            transform 0.3s ease-out,
            opacity 0.3s ease-out;
        transform: translateY(0);
        opacity: 1;
    }

    .dismissable-ad-container.slide-out {
        transform: translateY(100%);
        opacity: 0;
    }

    .dismiss-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 10;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        color: white;
        border: none;
        border-radius: 9999px;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .dismiss-button:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
    }

    .dismiss-button:active {
        transform: scale(0.95);
    }

    .ad-content {
        padding: 0.5rem;
        min-height: 50px;
    }

    .adsbygoogle {
        min-height: 50px;
    }

    /* Graceful collapse when ads fail to load or are blocked */
    :global(.adsbygoogle[data-ad-status="unfilled"]) {
        display: none !important;
    }

    @media (max-width: 768px) {
        .dismiss-button {
            width: 2.5rem;
            height: 2.5rem;
        }
    }
</style>
