<script lang="ts">
    export let message = "";
    export let type: "success" | "error" | "info" | "warning" = "info";
    export let duration = 3000;
    export let isVisible = false;

    let timeoutId: number;

    $: if (isVisible && duration > 0) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            isVisible = false;
        }, duration) as unknown as number;
    }

    export function show(
        msg: string,
        toastType: typeof type = "info",
        toastDuration = 3000,
    ) {
        message = msg;
        type = toastType;
        duration = toastDuration;
        isVisible = true;
    }

    const typeStyles = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-white",
        info: "bg-blue-500 text-white",
    };

    const icons = {
        success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
        warning:
            "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    };
</script>

{#if isVisible}
    <div
        class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down"
    >
        <div
            class={`${typeStyles[type]} px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}
        >
            <svg
                class="w-6 h-6 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d={icons[type]}
                />
            </svg>
            <p class="font-medium flex-1">{message}</p>
            <button
                on:click={() => (isVisible = false)}
                class="hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    </div>
{/if}

<style>
    @keyframes slide-down {
        from {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }

    .animate-slide-down {
        animation: slide-down 0.3s ease-out;
    }
</style>
