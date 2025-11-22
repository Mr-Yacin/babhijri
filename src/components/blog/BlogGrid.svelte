<script lang="ts">
    import { fade, fly } from "svelte/transition";

    export let posts: any[] = [];

    let activeCategory = "All";
    let searchQuery = "";

    // Extract unique categories from posts
    $: categories = [
        "All",
        ...new Set(posts.map((post) => post.data.category || "General")),
    ];

    // Filter posts based on category and search query
    $: filteredPosts = posts.filter((post) => {
        const matchesCategory =
            activeCategory === "All" ||
            (post.data.category || "General") === activeCategory;
        const matchesSearch =
            post.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.data.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    function setCategory(category: string) {
        activeCategory = category;
    }
</script>

<div class="space-y-8">
    <!-- Filters & Search -->
    <div
        class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
    >
        <div class="flex flex-wrap gap-2 justify-center md:justify-start">
            {#each categories as category}
                <button
                    on:click={() => setCategory(category)}
                    class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 {activeCategory ===
                    category
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                >
                    {category}
                </button>
            {/each}
        </div>

        <div class="relative w-full md:w-64">
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="بحث في المقالات..."
                class="w-full pl-4 pr-10 py-2 rounded-full bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-right"
            />
            <svg
                class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    </div>

    <!-- Grid -->
    <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
        {#each filteredPosts as post (post.slug)}
            <article
                in:fly={{ y: 20, duration: 300 }}
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
                <a
                    href={`/blog/${post.slug}`}
                    class="block h-full flex flex-col"
                >
                    <div class="relative overflow-hidden h-48">
                        {#if post.data.heroImage}
                            <img
                                src={post.data.heroImage}
                                alt={post.data.title}
                                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                        {:else}
                            <div
                                class="w-full h-full bg-teal-50 flex items-center justify-center text-teal-200"
                            >
                                <svg
                                    class="w-12 h-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        {/if}
                        <div class="absolute top-3 right-3">
                            <span
                                class="bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                            >
                                {post.data.category || "General"}
                            </span>
                        </div>
                    </div>

                    <div class="p-6 flex-1 flex flex-col">
                        <div class="flex gap-2 mb-3 flex-wrap">
                            {#each post.data.tags.slice(0, 2) as tag}
                                <span
                                    class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium"
                                >
                                    #{tag}
                                </span>
                            {/each}
                        </div>

                        <h2
                            class="text-xl font-bold mb-3 text-gray-900 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors"
                        >
                            {post.data.title}
                        </h2>

                        <p
                            class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1"
                        >
                            {post.data.description}
                        </p>

                        <div
                            class="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto"
                        >
                            <span class="font-medium flex items-center gap-1">
                                <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                {post.data.author}
                            </span>
                            <time
                                datetime={post.data.pubDate}
                                class="flex items-center gap-1"
                            >
                                <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                {new Date(post.data.pubDate).toLocaleDateString(
                                    "ar-EG",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    },
                                )}
                            </time>
                        </div>
                    </div>
                </a>
            </article>
        {/each}
    </div>

    {#if filteredPosts.length === 0}
        <div
            class="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed"
            in:fade
        >
            <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4"
            >
                <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">
                لا توجد نتائج
            </h3>
            <p class="text-gray-500">
                جرب البحث بكلمات مختلفة أو تغيير التصنيف
            </p>
            <button
                on:click={() => {
                    searchQuery = "";
                    activeCategory = "All";
                }}
                class="mt-4 text-teal-600 font-medium hover:text-teal-700"
            >
                إعادة تعيين الفلاتر
            </button>
        </div>
    {/if}
</div>
