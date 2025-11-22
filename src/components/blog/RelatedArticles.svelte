<script lang="ts">
    export let currentPost: any;
    export let allPosts: any[];

    // Find related posts based on category or tags
    $: relatedPosts = allPosts
        .filter((post) => post.slug !== currentPost.slug) // Exclude current post
        .map((post) => {
            let score = 0;
            // Match category
            if (post.data.category === currentPost.data.category) score += 3;
            // Match tags
            const commonTags = post.data.tags.filter((tag: string) =>
                currentPost.data.tags.includes(tag),
            );
            score += commonTags.length;
            return { ...post, score };
        })
        .sort((a, b) => b.score - a.score) // Sort by relevance
        .slice(0, 3); // Take top 3
</script>

{#if relatedPosts.length > 0}
    <section class="py-12 bg-gray-50 border-t border-gray-200">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between mb-8">
                <h3 class="text-2xl font-bold text-gray-900">مقالات ذات صلة</h3>
                <a
                    href="/blog"
                    class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                >
                    عرض الكل
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {#each relatedPosts as post}
                    <a
                        href={`/blog/${post.slug}`}
                        class="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                    >
                        <div class="aspect-video overflow-hidden relative">
                            {#if post.data.heroImage}
                                <img
                                    src={post.data.heroImage}
                                    alt={post.data.title}
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            {:else}
                                <div
                                    class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"
                                >
                                    <svg
                                        class="w-10 h-10"
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
                        </div>
                        <div class="p-4">
                            <span
                                class="text-xs font-medium text-teal-600 mb-2 block"
                            >
                                {post.data.category || "General"}
                            </span>
                            <h4
                                class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors"
                            >
                                {post.data.title}
                            </h4>
                            <time class="text-xs text-gray-500">
                                {new Date(post.data.pubDate).toLocaleDateString(
                                    "ar-EG",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    },
                                )}
                            </time>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </section>
{/if}
