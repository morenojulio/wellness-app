<script lang="ts">
    import { page } from "$app/stores";
    import BurgerMenu from "./BurgerMenu.svelte";
    import { darkMode, toggleDarkMode } from "$lib/stores/darkMode";
    import { language } from "$lib/stores/language";
    import { t } from "$lib/utils/i18n";
    import { authStore } from '$lib/stores/auth';
    import { clickOutside } from '$lib/clickOutside';

    let isMenuOpen = false;
    let openEmailMenu: boolean = false;

    function handleMenuToggle(event: CustomEvent<boolean>) {
        isMenuOpen = event.detail;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    function goToAuth() {
        window.location.href = '/auth';
    }

    $: currentPath = $page.url.pathname;
</script>

<nav
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Logo/Title -->
            <div class="flex-shrink-0">
                <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {$t("nav.title")}
                </h1>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:block">
                {#if $authStore.user}
                    <div class="ml-8 mr-2 flex items-center gap-2">
                        <a
                            href="/"
                            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {currentPath ===
                            '/'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                        >
                            {$t("nav.journal")}
                        </a>
                        <a
                             href="/resultados"
                             class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {currentPath ===
                             '/resultados'
                                 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                                 : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                         >
                             {$t("nav.results")}
                         </a>
                         <a
                             href="/settings"
                             class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {currentPath ===
                             '/settings'
                                 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                                 : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                         >
                             {$t("nav.settings")}
                         </a>
                     </div>
                {/if}
            </div>

            <!-- Utility Buttons (Language, Dark Mode, Menu) + Auth/Profile aligned right -->
            <div class="flex items-center space-x-3">
                <!-- Language Switcher -->
                <button
                    on:click={() => language.toggle()}
                    class="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                    aria-label="Toggle language"
                >
                    {$language === "es" ? "🇺🇸 EN" : "🇪🇸 ES"}
                </button>

                <!-- Dark Mode Toggle -->
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
                    <BurgerMenu
                        bind:isOpen={isMenuOpen}
                        on:toggle={handleMenuToggle}
                    />
                </div>

                {#if $authStore.user}
                    <!-- Email dropdown trigger (now always visible) -->
                    <div class="relative" use:clickOutside on:outside={() => openEmailMenu = false} role="group" aria-label="User menu">
                        <button
                          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium max-w-[180px] whitespace-nowrap"
                          on:click={() => openEmailMenu = !openEmailMenu}
                          on:keydown={(e) => { if (e.key === 'Escape') { openEmailMenu = false; e.stopPropagation(); } }}
                          aria-haspopup="true"
                          aria-expanded={openEmailMenu}
                          aria-controls="user-menu-panel"
                        >
                          <span class="truncate">{$authStore.user.email}</span>
                          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
                        </button>
                        {#if openEmailMenu}
                          <div id="user-menu-panel" class="absolute right-0 mt-2 w-44 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg py-1 z-20">
                            <button
                              class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              on:click={() => { authStore.signOut(); openEmailMenu=false; }}
                            >{$t('auth.signOut')}</button>
                          </div>
                        {/if}
                    </div>
                {:else}
                    <button on:click={goToAuth} class="inline-flex px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition whitespace-nowrap">{$t('auth.signIn')}</button>
                {/if}
            </div>
        </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if isMenuOpen}
        <div class="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div class="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800">
                {#if $authStore.user}
                    <div class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{$authStore.user.email}</div>
                    <a
                        href="/"
                        on:click={closeMenu}
                        class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {currentPath === '/' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                    >
                        {$t("nav.journal")}
                    </a>
                    <a
                        href="/resultados"
                        on:click={closeMenu}
                        class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {currentPath === '/resultados' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                    >
                        {$t("nav.results")}
                    </a>
                    <a
                        href="/settings"
                        on:click={closeMenu}
                        class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {currentPath === '/settings' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                    >
                        {$t("nav.settings")}
                    </a>
                    <button
                        on:click={() => { authStore.signOut(); closeMenu(); }}
                        class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >{$t('auth.signOut')}</button>
                {:else}
                    <button
                        on:click={() => { goToAuth(); closeMenu(); }}
                        class="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                    >{$t('auth.signIn')}</button>
                {/if}
            </div>
        </div>
    {/if}
</nav>
