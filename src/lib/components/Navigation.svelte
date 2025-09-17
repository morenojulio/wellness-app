<script lang="ts">
    import { page } from '$app/stores';
    import BurgerMenu from './BurgerMenu.svelte';
    import { darkMode, toggleDarkMode } from '$lib/stores/darkMode';

    let isMenuOpen = false;

    function handleMenuToggle(event: CustomEvent<boolean>) {
        isMenuOpen = event.detail;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    $: currentPath = $page.url.pathname;
</script>

<nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Logo/Title -->
            <div class="flex-shrink-0">
                <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                    🌱 Diario Wellness
                </h1>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                    <a
                        href="/"
                        class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {currentPath === '/'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                    >
                        Diario
                    </a>
                    <a
                        href="/resultados"
                        class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {currentPath === '/resultados'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                    >
                        Resultados
                    </a>
                </div>
            </div>

            <!-- Dark Mode Toggle & Mobile Menu -->
            <div class="flex items-center space-x-3">
                <button
                    on:click={toggleDarkMode}
                    class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="Toggle dark mode"
                >
                    {#if $darkMode}
                        ☀️
                    {:else}
                        🌙
                    {/if}
                </button>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <BurgerMenu bind:isOpen={isMenuOpen} on:toggle={handleMenuToggle} />
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if isMenuOpen}
        <div class="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div class="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800">
                <a
                    href="/"
                    on:click={closeMenu}
                    class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {currentPath === '/'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    Diario
                </a>
                <a
                    href="/resultados"
                    on:click={closeMenu}
                    class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {currentPath === '/resultados'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    Resultados
                </a>
            </div>
        </div>
    {/if}
</nav>
