<script lang="ts">
    import { authStore } from "../../lib/stores/auth";
    import ClientAdUnit from "./ClientAdUnit.svelte";
    import { ANALYTICS_CONFIG } from "../../config";

    let isLoggedIn = false;
    let loading = true;

    authStore.subscribe((state) => {
        isLoggedIn = state.isLoggedIn;
        loading = state.loading;
    });
</script>

{#if !loading && isLoggedIn}
    <div class="mt-8 app-middle-banner">
        <ClientAdUnit
            slot={ANALYTICS_CONFIG.adsense.slots.blogMiddle}
            format="horizontal"
            responsive={true}
            className="w-full"
        />
    </div>
{/if}
