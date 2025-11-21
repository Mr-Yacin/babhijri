<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let isOpen = false;
    export let title = "";
    export let message = "";
    export let confirmText = "تأكيد";
    export let cancelText = "إلغاء";
    export let type: "confirm" | "alert" = "confirm";
    export let variant: "danger" | "warning" | "info" | "success" = "info";

    const dispatch = createEventDispatcher();

    function handleConfirm() {
        dispatch("confirm");
        isOpen = false;
    }

    function handleCancel() {
        dispatch("cancel");
        isOpen = false;
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    }

    const variantColors = {
        danger: "bg-red-50 border-red-200",
        warning: "bg-yellow-50 border-yellow-200",
        info: "bg-blue-50 border-blue-200",
        success: "bg-green-50 border-green-200",
    };

    const iconColors = {
        danger: "text-red-600",
        warning: "text-yellow-600",
        info: "text-blue-600",
        success: "text-green-600",
    };

    const buttonColors = {
        danger: "bg-red-600 hover:bg-red-700",
        warning: "bg-yellow-600 hover:bg-yellow-700",
        info: "bg-blue-600 hover:bg-blue-700",
        success: "bg-green-600 hover:bg-green-700",
    };
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        on:click={handleBackdropClick}
        role="dialog"
        aria-modal="true"
    >
        <div
            class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-scale-in"
        >
            <!-- Header -->
            <div class={`px-6 py-4 border-b ${variantColors[variant]}`}>
                <div class="flex items-center gap-3">
                    {#if variant === "danger"}
                        <svg
                            class={`w-6 h-6 ${iconColors[variant]}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    {:else if variant === "warning"}
                        <svg
                            class={`w-6 h-6 ${iconColors[variant]}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    {:else if variant === "success"}
                        <svg
                            class={`w-6 h-6 ${iconColors[variant]}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    {:else}
                        <svg
                            class={`w-6 h-6 ${iconColors[variant]}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    {/if}
                    <h3 class="text-lg font-bold text-gray-900">{title}</h3>
                </div>
            </div>

            <!-- Content -->
            <div class="px-6 py-5">
                <p class="text-gray-700 leading-relaxed">{message}</p>
            </div>

            <!-- Actions -->
            <div
                class="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3 justify-end"
            >
                {#if type === "confirm"}
                    <button
                        on:click={handleCancel}
                        class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                {/if}
                <button
                    on:click={handleConfirm}
                    class={`px-5 py-2.5 text-white rounded-lg transition-colors font-medium ${buttonColors[variant]}`}
                >
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes scale-in {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .animate-scale-in {
        animation: scale-in 0.2s ease-out;
    }
</style>
