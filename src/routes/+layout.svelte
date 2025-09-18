<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import Navigation from "$lib/components/Navigation.svelte";
    import "../app.css";
    import { onMount } from "svelte";
    import { journalStore } from "$lib/stores/journal";
    import { page } from '$app/stores';

    // Defer journal data init until user authenticated (only once per session)
    import { authStore } from "$lib/stores/auth";
    onMount(() => {
        const unsub = authStore.subscribe((a) => {
            if (a.user) {
                journalStore.init();
                unsub();
            }
        });
    });

    // Auth guard moved to +layout.ts for centralized handling.
    // (Removed prior reactive block that caused a 500 during dev.)

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
>
    <Navigation />
    <main>
        {@render children?.()}
    </main>
</div>
