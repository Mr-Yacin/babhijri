<script lang="ts">
    import ProfileCard from "./ProfileCard.svelte";

    // Mock Data
    const PROFILES = [
        {
            id: 1,
            name: "سارة",
            age: 26,
            location: "برلين، ألمانيا",
            bio: "مهندسة برمجيات، أحب السفر والقراءة. أبحث عن شريك طموح.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            verified: true,
        },
        {
            id: 2,
            name: "عمر",
            age: 30,
            location: "لندن، بريطانيا",
            bio: "طبيب أسنان، مقيم في لندن منذ 5 سنوات. أبحث عن الاستقرار.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            verified: true,
        },
        {
            id: 3,
            name: "ليلى",
            age: 24,
            location: "تورنتو، كندا",
            bio: "طالبة ماجستير، أحب الفن والموسيقى.",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            verified: false,
        },
        {
            id: 4,
            name: "يوسف",
            age: 28,
            location: "باريس، فرنسا",
            bio: "شيف في مطعم فرنسي. أبحث عن شريكة تشاركني شغف الطبخ.",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            verified: true,
        },
    ];

    let filter = "all";
</script>

<div class="mb-8 flex gap-4 overflow-x-auto pb-2">
    <button
        class="px-4 py-2 rounded-full bg-teal-600 text-white font-medium whitespace-nowrap"
        on:click={() => (filter = "all")}
    >
        الكل
    </button>
    <button
        class="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 whitespace-nowrap"
    >
        أوروبا
    </button>
    <button
        class="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 whitespace-nowrap"
    >
        أمريكا الشمالية
    </button>
</div>

<div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
>
    {#each PROFILES as profile (profile.id)}
        <ProfileCard {...profile} />
    {/each}
</div>
