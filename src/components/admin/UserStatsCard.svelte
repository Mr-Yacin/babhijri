<script lang="ts">
    export let title: string;
    export let value: number | string;
    export let icon: string = "";
    export let color: string = "indigo";

    const colors = {
        indigo: "bg-indigo-100 text-indigo-600",
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
        blue: "bg-blue-100 text-blue-600",
        yellow: "bg-yellow-100 text-yellow-600",
        purple: "bg-purple-100 text-purple-600",
        gray: "bg-gray-100 text-gray-600",
    };

    $: colorClass = colors[color as keyof typeof colors] || colors.indigo;
</script>

<div
    class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
>
    <div class="flex items-center justify-between mb-4">
        <div
            class={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}
        >
            {#if icon}
                {@html icon}
            {:else}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                </svg>
            {/if}
        </div>
    </div>
    <h3 class="text-gray-500 text-sm mb-1">{title}</h3>
    <p class="text-3xl font-bold text-gray-900">{value}</p>
</div>
