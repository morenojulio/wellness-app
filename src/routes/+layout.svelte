<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import Navigation from "$lib/components/Navigation.svelte";
    import "../app.css";
    import { onMount } from 'svelte';
    import { journalStore } from '$lib/stores/journal';

    // Defer journal data init until user authenticated
    import { authStore } from '$lib/stores/auth';
    onMount(() => {
        const unsub = authStore.subscribe(a => {
            if (a.user) {
                journalStore.init();
                unsub();
            }
        });
    });

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
