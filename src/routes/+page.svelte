<script lang="ts">
    import { darkMode } from "$lib/stores/darkMode";
    import { saveJournalEntry } from "$lib/stores/journal";
    import { language } from "$lib/stores/language";
    import { t } from "$lib/utils/i18n";
    import { formatDate } from "$lib/utils/i18n";
    import { onMount } from "svelte";
    import { authStore } from '$lib/stores/auth';
    import Spinner from '$lib/components/Spinner.svelte';

    $: currentDate = formatDate(new Date(), $language);

    // Energy levels for each time period
    let morningEnergy = 0;
    let afternoonEnergy = 0;
    let eveningEnergy = 0;

    // Journal responses
    let morningFocus = "";
    let afternoonMoment = "";
    let eveningEmotion = "";
    let eveningAuthentic = "";
    let eveningActing = "";
    let eveningAdmiration = "";

    let isSaving = false;
    let saveMessage = "";

    function selectEnergy(
        period: "morning" | "afternoon" | "evening",
        value: number,
    ) {
        if (period === "morning") morningEnergy = value;
        if (period === "afternoon") afternoonEnergy = value;
        if (period === "evening") eveningEnergy = value;
    }

    let screen: 'welcome' | 'form' | 'thanks' = 'welcome';
    const userName = 'Julien';

    function startEntry() {
        screen = 'form';
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('journalScreen', 'form');
        }
    }

    function resetEntry() {
        // Clear form fields
        morningEnergy = afternoonEnergy = eveningEnergy = 0;
        morningFocus = '';
        afternoonMoment = '';
        eveningEmotion = '';
        eveningAuthentic = '';
        eveningActing = '';
        eveningAdmiration = '';
        saveMessage = '';
        screen = 'welcome';
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('journalScreen', 'welcome');
        }
    }

    async function handleSave() {
        isSaving = true;
        saveMessage = "";

        const entry = {
            date: currentDate,
            morningEnergy,
            afternoonEnergy,
            eveningEnergy,
            morningFocus,
            afternoonMoment,
            eveningEmotion,
            eveningAuthentic,
            eveningActing,
            eveningAdmiration,
        };

        const result = await saveJournalEntry(entry);

        if (result.success) {
            saveMessage = $t('journal.save.success');
            // Move to thanks screen shortly after save
            setTimeout(() => {
                screen = 'thanks';
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('journalScreen', 'thanks');
                }
            }, 800);
        } else {
            saveMessage = $t('journal.save.error') + " " + result.error;
        }

        isSaving = false;

        setTimeout(() => {
            saveMessage = "";
        }, 3000);
    }

    // Initialize dark mode on mount
    onMount(() => {
        if ($darkMode) {
            document.documentElement.classList.add("dark");
        }
        const stored = typeof window !== 'undefined' ? sessionStorage.getItem('journalScreen') : null;
        if (stored === 'form') {
            screen = 'form';
        } else if (stored === 'thanks') {
            screen = 'thanks';
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', persistState);
        }
    });

    function persistState() {
        if (typeof window === 'undefined') return;
        sessionStorage.setItem('journalScreen', screen);
    }
</script>

<div class="p-2 sm:p-5">
    <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 transition-colors duration-300">
        {#if $authStore.loading}
            <div class="py-16">
                <Spinner size={40} label={$t('auth.loading') || 'Loading...'} />
            </div>
        {:else if !$authStore.user}
            <div class="py-16 text-center text-gray-600 dark:text-gray-300 text-sm">{$t('auth.loading') || 'Loading...'}</div>
        {:else if screen === 'welcome'}
            <div class="space-y-8 text-center">
                <h1 class="text-3xl font-bold text-slate-800 dark:text-gray-100">{$t('journal.title')}</h1>
                <p class="text-xl text-gray-700 dark:text-gray-300">{$t('journal.welcome.greeting')}, <span class="font-semibold">{userName}</span> 👋</p>
                <p class="text-gray-600 dark:text-gray-400">{$t('journal.welcome.intro')}</p>
                <div class="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    <strong>{$t('journal.date')}</strong> {currentDate}
                </div>
                <button on:click={startEntry} class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200">{$t('journal.welcome.start')}</button>
            </div>
        {:else if screen === 'thanks'}
            <div class="space-y-8 text-center">
                <h1 class="text-3xl font-bold text-slate-800 dark:text-gray-100">{$t('journal.title')}</h1>
                <p class="text-2xl text-gray-800 dark:text-gray-200">{$t('journal.thanks.message')}</p>
                <button on:click={resetEntry} class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200">{$t('journal.thanks.back')}</button>
            </div>
        {:else}
            <!-- FORM SCREEN -->
            <!-- Header -->
            <div class="mb-8">
                <h1
                    class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-gray-100 text-center border-b-2 border-blue-500 pb-3"
                >
                    {$t('journal.title')}
                </h1>
            </div>

            <!-- Date Section -->
            <div class="text-center text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium">
                <strong>{$t('journal.date')}</strong>
                {currentDate}
            </div>

            <!-- MORNING SECTION -->
            <div class="border-2 border-gray-200 dark:border-gray-600 border-l-orange-500 border-l-8 rounded-lg p-5 mb-8">
                <div class="text-xl font-bold text-orange-500 mb-4">
                    {$t('journal.morning.title')}
                </div>
                <div class="mb-6">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">
                        {$t('journal.morning.energyQuestion')}
                    </div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">
                        {$t('journal.morning.energyScale')}
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span>{$t('journal.morning.lowEnergy')}</span>
                            <span>{$t('journal.morning.highEnergy')}</span>
                        </div>
                        <div class="flex justify-between gap-1 sm:gap-2">
                            {#each Array(10) as _, i}
                                <button class="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 {morningEnergy === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500'}" on:click={() => selectEnergy('morning', i + 1)}>{i + 1}</button>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">{$t('journal.morning.focusQuestion')}</div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">{$t('journal.morning.focusHint')}</div>
                    <textarea class="w-full min-h-[80px] border border-gray-300 dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" bind:value={morningFocus} placeholder={$t('journal.morning.placeholder')}></textarea>
                </div>
            </div>

            <!-- AFTERNOON SECTION -->
            <div class="border-2 border-gray-200 dark:border-gray-600 border-l-red-500 border-l-8 rounded-lg p-5 mb-8">
                <div class="text-xl font-bold text-red-500 mb-4">{$t('journal.afternoon.title')}</div>
                <div class="mb-6">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">{$t('journal.afternoon.energyQuestion')}</div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">{$t('journal.afternoon.energyScale')}</div>
                    <div class="space-y-3">
                        <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span>{$t('journal.afternoon.lowEnergy')}</span>
                            <span>{$t('journal.afternoon.highEnergy')}</span>
                        </div>
                        <div class="flex justify-between gap-1 sm:gap-2">
                            {#each Array(10) as _, i}
                                <button class="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 {afternoonEnergy === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500'}" on:click={() => selectEnergy('afternoon', i + 1)}>{i + 1}</button>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">{$t('journal.afternoon.momentQuestion')}</div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">{$t('journal.afternoon.momentHint')}</div>
                    <textarea class="w-full min-h-[80px] border border-gray-300 dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" bind:value={afternoonMoment} placeholder={$t('journal.afternoon.placeholder')}></textarea>
                </div>
            </div>

            <!-- EVENING SECTION -->
            <div class="border-2 border-gray-200 dark:border-gray-600 border-l-purple-500 border-l-8 rounded-lg p-5 mb-8">
                <div class="text-xl font-bold text-purple-500 mb-4">{$t('journal.evening.title')}</div>
                <div class="mb-6">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">{$t('journal.evening.energyQuestion')}</div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">{$t('journal.evening.energyScale')}</div>
                    <div class="space-y-3">
                        <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span>{$t('journal.evening.lowEnergy')}</span>
                            <span>{$t('journal.evening.highEnergy')}</span>
                        </div>
                        <div class="flex justify-between gap-1 sm:gap-2">
                            {#each Array(10) as _, i}
                                <button class="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 {eveningEnergy === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500'}" on:click={() => selectEnergy('evening', i + 1)}>{i + 1}</button>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">{$t('journal.evening.emotionQuestion')}</div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">{$t('journal.evening.emotionHint')}</div>
                    <textarea class="w-full min-h-[80px] border border-gray-300 dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" bind:value={eveningEmotion} placeholder={$t('journal.evening.placeholder')}></textarea>
                </div>
                <div class="mb-6">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">{$t('journal.evening.authenticQuestion')}</div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">{$t('journal.evening.authenticHint')}</div>
                    <textarea class="w-full min-h-[100px] border border-gray-300 dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" bind:value={eveningAuthentic} placeholder={$t('journal.evening.placeholder')}></textarea>
                </div>
                <div class="mb-6">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">{$t('journal.evening.actingQuestion')}</div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">{$t('journal.evening.actingHint')}</div>
                    <textarea class="w-full min-h-[100px] border border-gray-300 dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" bind:value={eveningActing} placeholder={$t('journal.evening.placeholder')}></textarea>
                </div>
                <div class="mb-4">
                    <div class="font-bold text-slate-700 dark:text-gray-200 mb-2">{$t('journal.evening.admirationQuestion')}</div>
                    <div class="text-gray-600 dark:text-gray-400 italic text-sm mb-3">{$t('journal.evening.admirationHint')}</div>
                    <textarea class="w-full min-h-[100px] border border-gray-300 dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" bind:value={eveningAdmiration} placeholder={$t('journal.evening.placeholder')}></textarea>
                </div>
            </div>

            <!-- Save Button -->
            <div class="mt-8 text-center">
                <button on:click={handleSave} disabled={isSaving} class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:cursor-not-allowed">
                    {#if isSaving}
                        {$t('journal.save.saving')}
                    {:else}
                        {$t('journal.save.button')}
                    {/if}
                </button>
                {#if saveMessage}
                    <div class="mt-3 text-sm font-medium {saveMessage.includes('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">{saveMessage}</div>
                {/if}
            </div>
        {/if}
    </div>
</div>
