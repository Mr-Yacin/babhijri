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
    export let responsive: boolean = true;

    // Initialize publisher ID immediately
    const publisherId = import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || "";

    onMount(() => {
        console.log("[ClientAdUnit] Mounted - Slot:", slot);

        // Initialize AdSense for the ad unit
        if (typeof window !== "undefined") {
            try {
                (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle.push({});
                console.log("[ClientAdUnit] Ad initialized - Slot:", slot);
            } catch (error) {
                console.error("[ClientAdUnit] Error initializing ad:", error);
            }
        }
    });
</script>

<div class="client-ad-container {className}">
    <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
    ></ins>
</div>

<style>
    .client-ad-container {
        width: 100%;
        min-height: 50px;
    }

    .adsbygoogle {
        display: block;
        min-height: 50px;
    }

    /* Graceful collapse when ads fail to load or are blocked */
    :global(.adsbygoogle[data-ad-status="unfilled"]) {
        display: none !important;
    }
</style>
