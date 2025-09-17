<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let isOpen = false;

    const dispatch = createEventDispatcher();

    function toggleMenu() {
        isOpen = !isOpen;
        dispatch('toggle', isOpen);
    }
</script>

<button
    class="flex flex-col justify-center items-center w-8 h-8 space-y-1 z-50 relative"
    on:click={toggleMenu}
    aria-label="Toggle menu"
>
    <span
        class="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 transition-all duration-300 {isOpen
            ? 'rotate-45 translate-y-1.5'
            : ''}"
    ></span>
    <span
        class="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 transition-all duration-300 {isOpen
            ? 'opacity-0'
            : ''}"
    ></span>
    <span
        class="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 transition-all duration-300 {isOpen
            ? '-rotate-45 -translate-y-1.5'
            : ''}"
    ></span>
</button>
