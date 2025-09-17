<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import Navigation from "$lib/components/Navigation.svelte";
    import "../app.css";

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
