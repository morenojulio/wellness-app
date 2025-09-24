<script lang="ts">
    import { darkMode } from "$lib/stores/darkMode";
    import { saveJournalEntry, updateJournalEntry, journalStore } from "$lib/stores/journal";
    import { language } from "$lib/stores/language";
    import { t } from "$lib/utils/i18n";
    import { formatDate } from "$lib/utils/i18n";
    import { onMount, onDestroy } from "svelte";
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

    // Energy button color classes (index 0 => value 1, ... index 9 => value 10)
    const selectedColorClasses: string[] = [
        'bg-red-700 text-white border-red-700',      // 1
        'bg-red-600 text-white border-red-600',      // 2
        'bg-red-500 text-white border-red-500',      // 3
        'bg-orange-600 text-white border-orange-600',// 4
        'bg-orange-500 text-white border-orange-500',// 5
        'bg-orange-400 text-gray-900 border-orange-400', // 6
        'bg-orange-300 text-gray-900 border-orange-300', // 7
        'bg-orange-200 text-gray-900 border-orange-200', // 8
        'bg-orange-100 text-gray-900 border-orange-200', // 9
        'bg-green-600 text-white border-green-600'   // 10
    ];

    const hoverColorClasses: string[] = [
        'hover:bg-red-700 hover:text-white hover:border-red-700',      // 1
        'hover:bg-red-600 hover:text-white hover:border-red-600',      // 2
        'hover:bg-red-500 hover:text-white hover:border-red-500',      // 3
        'hover:bg-orange-600 hover:text-white hover:border-orange-600',// 4
        'hover:bg-orange-500 hover:text-white hover:border-orange-500',// 5
        'hover:bg-orange-400 hover:text-gray-900 hover:border-orange-400', // 6
        'hover:bg-orange-300 hover:text-gray-900 hover:border-orange-300', // 7
        'hover:bg-orange-200 hover:text-gray-900 hover:border-orange-200', // 8
        'hover:bg-orange-100 hover:text-gray-900 hover:border-orange-200', // 9
        'hover:bg-green-600 hover:text-white hover:border-green-600'   // 10
    ];

    function energyButtonClass(currentValue: number, index: number) {
        const base = 'w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200';
        const unselected = 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500';
        return `${base} ${hoverColorClasses[index]} ${currentValue === index + 1 ? selectedColorClasses[index] : unselected}`;
    }

    let isSaving = false;
    let saveMessage = "";
    let showCancelModal = false;

    function selectEnergy(
        period: "morning" | "afternoon" | "evening",
        value: number,
    ) {
        if (period === "morning") morningEnergy = value;
        if (period === "afternoon") afternoonEnergy = value;
        if (period === "evening") eveningEnergy = value;
    }

    // Screen state: welcome -> period (single section) -> thanks
    let screen: 'welcome' | 'period' | 'thanks' = 'welcome';
    let currentPeriod: 'morning' | 'afternoon' | 'evening' | null = null;
    const userName = 'Julien';

    import { timeSettings } from '$lib/stores/timeSettings';
    // Dynamic unlock times: each period unlocks at user-configured time and remains available afterwards (no sequential dependency)
    let now = new Date();
    let timer: any;

    function parseHM(hm: string) {
        const [h,m] = hm.split(':').map(Number);
        return { h: h ?? 0, m: m ?? 0 };
    }

    function unlockDateFor(period: 'morning' | 'afternoon' | 'evening') {
        const settings = $timeSettings.settings;
        const map = {
            morning: settings.morningUnlock,
            afternoon: settings.afternoonUnlock,
            evening: settings.eveningUnlock,
        } as const;
        const { h, m } = parseHM(map[period]);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
    }

    function formatUnlock(period: 'morning' | 'afternoon' | 'evening') {
        const d = unlockDateFor(period);
        const m = d.getMinutes().toString().padStart(2,'0');
        if ($language === 'es') { // 24-hour style for Spanish
            const h24 = d.getHours().toString().padStart(2,'0');
            return `${h24}:${m}`;
        } else { // 12-hour with AM/PM for English (default)
            let h = d.getHours();
            const suffix = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            if (h === 0) h = 12;
            return `${h}:${m} ${suffix}`;
        }
    }

    function minutesUntil(period: 'morning' | 'afternoon' | 'evening') {
        if (isUnlocked(period)) return 0;
        const diffMs = unlockDateFor(period).getTime() - now.getTime();
        return Math.max(0, Math.ceil(diffMs / 60000));
    }

    function remainingMinutesLabel(period: 'morning' | 'afternoon' | 'evening') {
        const mins = minutesUntil(period);
        if (mins <= 0) return '';
        if (mins >= 60) {
            const hours = Math.floor(mins / 60);
            if ($language === 'es') {
                return hours === 1 ? 'Abre en 1 h' : `Abre en ${hours} h`;
            }
            return hours === 1 ? 'Opens in 1h' : `Opens in ${hours}h`;
        }
        if ($language === 'es') {
            return mins === 1 ? 'Abre en 1 min' : `Abre en ${mins} min`;
        }
        return mins === 1 ? 'Opens in 1 min' : `Opens in ${mins} min`;
    }

    function isUnlocked(period: 'morning' | 'afternoon' | 'evening') {
        return now >= unlockDateFor(period);
    }

    function canAccessPeriod(period: 'morning' | 'afternoon' | 'evening') {
        return isUnlocked(period);
    }

    onMount(() => {
        timer = setInterval(() => { now = new Date(); }, 30000); // refresh every 30s
    });

    onDestroy(() => { if (timer) clearInterval(timer); });

    // cleanup
    if (typeof window !== 'undefined') {
        addEventListener('beforeunload', () => { if (timer) clearInterval(timer); });
    }

    // Derive today's entry if already saved (to allow incremental updates)
    import { journalStore as _js } from '$lib/stores/journal'; // alias already imported above but ensures reactive $journalStore
    $: todaysEntry = $journalStore.entries.find(e => e.date === currentDate);

    function loadTodayValues() {
        if (todaysEntry) {
            morningEnergy = todaysEntry.morningEnergy || 0;
            afternoonEnergy = todaysEntry.afternoonEnergy || 0;
            eveningEnergy = todaysEntry.eveningEnergy || 0;
            morningFocus = todaysEntry.morningFocus || '';
            afternoonMoment = todaysEntry.afternoonMoment || '';
            eveningEmotion = todaysEntry.eveningEmotion || '';
            eveningAuthentic = todaysEntry.eveningAuthentic || '';
            eveningActing = todaysEntry.eveningActing || '';
            eveningAdmiration = todaysEntry.eveningAdmiration || '';
        }
    }

    // Completion heuristics per period
    $: morningDone = !!todaysEntry && (todaysEntry.morningEnergy > 0 || (todaysEntry.morningFocus?.trim().length ?? 0) > 0);
    $: afternoonDone = !!todaysEntry && (todaysEntry.afternoonEnergy > 0 || (todaysEntry.afternoonMoment?.trim().length ?? 0) > 0);
    $: eveningDone = !!todaysEntry && (
        todaysEntry.eveningEnergy > 0 ||
        (todaysEntry.eveningEmotion?.trim().length ?? 0) > 0 ||
        (todaysEntry.eveningAuthentic?.trim().length ?? 0) > 0 ||
        (todaysEntry.eveningActing?.trim().length ?? 0) > 0 ||
        (todaysEntry.eveningAdmiration?.trim().length ?? 0) > 0
    );

    function openPeriod(period: 'morning' | 'afternoon' | 'evening') {
        if (!canAccessPeriod(period)) return; // guard
        currentPeriod = period;
        screen = 'period';
        loadTodayValues();
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('journalScreen', `period:${period}`);
        }
    }

    function backToWelcome() {
        screen = 'welcome';
        currentPeriod = null;
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('journalScreen', 'welcome');
        }
    }

    function resetAllState() {
        morningEnergy = afternoonEnergy = eveningEnergy = 0;
        morningFocus = afternoonMoment = eveningEmotion = eveningAuthentic = eveningActing = eveningAdmiration = '';
    }

    async function handleSave() {
        if (!currentPeriod) return;
        isSaving = true;
        saveMessage = "";

        // Build full entry object snapshot
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

        let result;
        if (todaysEntry) {
            // Partial update only for changed period to reduce unnecessary writes
            const partial: any = {};
            if (currentPeriod === 'morning') {
                partial.morningEnergy = morningEnergy;
                partial.morningFocus = morningFocus;
            } else if (currentPeriod === 'afternoon') {
                partial.afternoonEnergy = afternoonEnergy;
                partial.afternoonMoment = afternoonMoment;
            } else if (currentPeriod === 'evening') {
                partial.eveningEnergy = eveningEnergy;
                partial.eveningEmotion = eveningEmotion;
                partial.eveningAuthentic = eveningAuthentic;
                partial.eveningActing = eveningActing;
                partial.eveningAdmiration = eveningAdmiration;
            }
            result = await updateJournalEntry(todaysEntry.id, partial);
        } else {
            result = await saveJournalEntry(entry);
        }

        if (result.success) {
            saveMessage = $t('journal.save.success');
            setTimeout(() => {
                // After saving one period, return to welcome so user sees remaining locks
                screen = 'welcome';
                currentPeriod = null;
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('journalScreen', 'welcome');
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

    // Initialize dark mode + restore session
    onMount(() => {
        if ($darkMode) {
            document.documentElement.classList.add("dark");
        }
        const stored = typeof window !== 'undefined' ? sessionStorage.getItem('journalScreen') : null;
        if (stored) {
            if (stored === 'welcome') {
                screen = 'welcome';
            } else if (stored.startsWith('period:')) {
                const p = stored.split(':')[1] as any;
                if (['morning','afternoon','evening'].includes(p) && canAccessPeriod(p)) {
                    openPeriod(p);
                } else {
                    screen = 'welcome';
                }
            }
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', persistState);
        }
    });

    function persistState() {
        if (typeof window === 'undefined') return;
        if (screen === 'period' && currentPeriod) {
            sessionStorage.setItem('journalScreen', `period:${currentPeriod}`);
        } else {
            sessionStorage.setItem('journalScreen', screen);
        }
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
            {#if $journalStore.isLoading}
                <!-- Skeleton shimmer while loading entries -->
                <div class="animate-pulse space-y-6">
                    <div class="h-8 w-2/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="h-4 w-1/2 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="grid gap-5 sm:grid-cols-3">
                        {#each Array(3) as _}
                            <div class="relative border-2 rounded-xl p-5 h-32 bg-gray-100 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600"></div>
                        {/each}
                    </div>
                </div>
            {:else}
            <div class="space-y-8 text-center">
                <h1 class="text-3xl font-bold text-slate-800 dark:text-gray-100">{$t('journal.title')}</h1>
                <p class="text-xl text-gray-700 dark:text-gray-300">{$t('journal.welcome.greeting')}, <span class="font-semibold">{userName}</span> 👋</p>
                <p class="text-gray-600 dark:text-gray-400">{$t('journal.welcome.intro')}</p>
                <div class="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    <strong>{$t('journal.date')}</strong> {currentDate}
                </div>

                <div class="grid gap-5 sm:grid-cols-3 text-left">
                    <!-- Morning Card -->
                    <div
                        class="group relative border-2 rounded-xl p-5 flex flex-col items-start text-left transition-all duration-200 focus:outline-none border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        role="button"
                        tabindex={canAccessPeriod('morning') && !morningDone ? 0 : -1}
                        aria-disabled={!canAccessPeriod('morning')}
                        on:click={() => { if(canAccessPeriod('morning') && !morningDone) openPeriod('morning'); }}
                        on:keydown={(e) => { if(e.key==='Enter' || e.key===' ') { e.preventDefault(); if(canAccessPeriod('morning') && !morningDone) openPeriod('morning'); } }}
                        title={(!canAccessPeriod('morning') && !morningDone) ? (remainingMinutesLabel('morning') || `${$t('settings.openAt')} ${formatUnlock('morning')}`) : ''}>
                        <span class="text-sm uppercase tracking-wide font-semibold text-orange-600 dark:text-orange-400">{$t('journal.morning.title')}</span>
                        <span class="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">{#if canAccessPeriod('morning')}
                                {#if morningDone}
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-[10px] font-semibold uppercase tracking-wide">{$t('journal.completed')}</span>
                                    <button type="button" class="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 hover:underline" on:click={() => openPeriod('morning')}>{$t('journal.edit')}</button>
                                {:else}
                                    {$t('journal.welcome.start')}
                                {/if}
                            {:else}
                                {`${$t('settings.openAt')} ${formatUnlock('morning')}`}
                            {/if}</span>
                        {#if morningDone}
                            <span class="absolute top-2 right-2 text-green-600 dark:text-green-400 text-xs font-semibold">✓</span>
                        {/if}
                        {#if !canAccessPeriod('morning')}
                            <span class="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300" title={remainingMinutesLabel('morning')} aria-label={remainingMinutesLabel('morning')}>
                                <span>{$t('settings.openAt')} {formatUnlock('morning')}</span>
                                {#if minutesUntil('morning') > 0}
                                    <span class="mt-0.5 opacity-80">({remainingMinutesLabel('morning')})</span>
                                {/if}
                            </span>
                        {/if}
                    </div>

                    <!-- Afternoon Card -->
                    <div
                        class="group relative border-2 rounded-xl p-5 flex flex-col items-start text-left transition-all duration-200 focus:outline-none border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        role="button"
                        tabindex={canAccessPeriod('afternoon') && !afternoonDone ? 0 : -1}
                        aria-disabled={!canAccessPeriod('afternoon')}
                        on:click={() => { if(canAccessPeriod('afternoon') && !afternoonDone) openPeriod('afternoon'); }}
                        on:keydown={(e) => { if(e.key==='Enter' || e.key===' ') { e.preventDefault(); if(canAccessPeriod('afternoon') && !afternoonDone) openPeriod('afternoon'); } }}
                        title={(!canAccessPeriod('afternoon') && !afternoonDone) ? (remainingMinutesLabel('afternoon') || `${$t('settings.openAt')} ${formatUnlock('afternoon')}`) : ''}>
                        <span class="text-sm uppercase tracking-wide font-semibold text-red-600 dark:text-red-400">{$t('journal.afternoon.title')}</span>
                        <span class="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">{#if canAccessPeriod('afternoon')}
                                {#if afternoonDone}
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-[10px] font-semibold uppercase tracking-wide">{$t('journal.completed')}</span>
                                    <button type="button" class="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 hover:underline" on:click={() => openPeriod('afternoon')}>{$t('journal.edit')}</button>
                                {:else}
                                    {$t('journal.welcome.start')}
                                {/if}
                            {:else}
                                {`${$t('settings.openAt')} ${formatUnlock('afternoon')}`}
                            {/if}</span>
                        {#if afternoonDone}
                            <span class="absolute top-2 right-2 text-green-600 dark:text-green-400 text-xs font-semibold">✓</span>
                        {/if}
                        {#if !canAccessPeriod('afternoon')}
                            <span class="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300" title={remainingMinutesLabel('afternoon')} aria-label={remainingMinutesLabel('afternoon')}>
                                <span>{$t('settings.openAt')} {formatUnlock('afternoon')}</span>
                                {#if minutesUntil('afternoon') > 0}
                                    <span class="mt-0.5 opacity-80">({remainingMinutesLabel('afternoon')})</span>
                                {/if}
                            </span>
                        {/if}
                    </div>

                    <!-- Evening Card -->
                    <div
                        class="group relative border-2 rounded-xl p-5 flex flex-col items-start text-left transition-all duration-200 focus:outline-none border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        role="button"
                        tabindex={canAccessPeriod('evening') && !eveningDone ? 0 : -1}
                        aria-disabled={!canAccessPeriod('evening')}
                        on:click={() => { if(canAccessPeriod('evening') && !eveningDone) openPeriod('evening'); }}
                        on:keydown={(e) => { if(e.key==='Enter' || e.key===' ') { e.preventDefault(); if(canAccessPeriod('evening') && !eveningDone) openPeriod('evening'); } }}
                        title={(!canAccessPeriod('evening') && !eveningDone) ? (remainingMinutesLabel('evening') || `${$t('settings.openAt')} ${formatUnlock('evening')}`) : ''}>
                        <span class="text-sm uppercase tracking-wide font-semibold text-purple-600 dark:text-purple-400">{$t('journal.evening.title')}</span>
                        <span class="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">{#if canAccessPeriod('evening')}
                                {#if eveningDone}
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-[10px] font-semibold uppercase tracking-wide">{$t('journal.completed')}</span>
                                    <button type="button" class="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 hover:underline" on:click={() => openPeriod('evening')}>{$t('journal.edit')}</button>
                                {:else}
                                    {$t('journal.welcome.start')}
                                {/if}
                            {:else}
                                {`${$t('settings.openAt')} ${formatUnlock('evening')}`}
                            {/if}</span>
                        {#if eveningDone}
                            <span class="absolute top-2 right-2 text-green-600 dark:text-green-400 text-xs font-semibold">✓</span>
                        {/if}
                        {#if !canAccessPeriod('evening')}
                            <span class="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300" title={remainingMinutesLabel('evening')} aria-label={remainingMinutesLabel('evening')}>
                                <span>{$t('settings.openAt')} {formatUnlock('evening')}</span>
                                {#if minutesUntil('evening') > 0}
                                    <span class="mt-0.5 opacity-80">({remainingMinutesLabel('evening')})</span>
                                {/if}
                            </span>
                        {/if}
                    </div>
                </div>
                </div>
            {/if}
        {:else if screen === 'thanks'}
            <div class="space-y-8 text-center">
                <h1 class="text-3xl font-bold text-slate-800 dark:text-gray-100">{$t('journal.title')}</h1>
                <p class="text-2xl text-gray-800 dark:text-gray-200">{$t('journal.thanks.message')}</p>
                <button on:click={backToWelcome} class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200">{$t('journal.thanks.back')}</button>
            </div>
        {:else}
            <!-- PERIOD FORM SCREEN -->
            <!-- Header -->
            <div class="mb-8 flex items-center justify-between">
                <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-gray-100 text-center flex-1">{$t('journal.title')}</h1>
                <button type="button" class="ml-4 px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200" on:click={backToWelcome}>← {$t('journal.save.cancel')}</button>
            </div>

            <!-- Date Section -->
            <div class="text-center text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium">
                <strong>{$t('journal.date')}</strong>
                {currentDate}
            </div>

            {#if currentPeriod === 'morning'}
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
                                    <button class={energyButtonClass(morningEnergy, i)} on:click={() => selectEnergy('morning', i + 1)}>{i + 1}</button>
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
            {/if}

            {#if currentPeriod === 'afternoon'}
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
                                    <button class={energyButtonClass(afternoonEnergy, i)} on:click={() => selectEnergy('afternoon', i + 1)}>{i + 1}</button>
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
            {/if}

            {#if currentPeriod === 'evening'}
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
                                    <button class={energyButtonClass(eveningEnergy, i)} on:click={() => selectEnergy('evening', i + 1)}>{i + 1}</button>
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
            {/if}

            <!-- Save / Cancel Buttons -->
            <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button on:click={handleSave} disabled={isSaving} class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:cursor-not-allowed min-w-[220px] order-1">
                    {#if isSaving}
                        {$t('journal.save.saving')}
                    {:else}
                        {$t('journal.save.button')}
                    {/if}
                </button>
                <button type="button" on:click={() => {
                        const hasData = morningEnergy || afternoonEnergy || eveningEnergy || morningFocus || afternoonMoment || eveningEmotion || eveningAuthentic || eveningActing || eveningAdmiration;
                        if (!hasData) {
                            backToWelcome();
                        } else {
                            showCancelModal = true;
                        }
                    }} class="px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-md transition-all duration-200 min-w-[220px] order-2">
                    {$t('journal.save.cancel')}
                </button>
                {#if saveMessage}
                    <div class="w-full text-center sm:w-auto mt-1 text-sm font-medium {saveMessage.includes('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">{saveMessage}</div>
                {/if}
            </div>

            {#if showCancelModal}
                <div class="fixed inset-0 z-40 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" role="button" tabindex="0" aria-label={$t('journal.save.cancel')} on:click={() => showCancelModal = false} on:keydown={(e)=>{ if(e.key==='Escape'|| e.key==='Enter' || e.key===' ') { e.preventDefault(); showCancelModal=false; } }}></div>
                    <div class="relative z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-5 border border-gray-200 dark:border-gray-700">
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{$t('journal.save.cancel')}</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{$t('journal.save.confirmCancel')}</p>
                        <div class="flex flex-col sm:flex-row gap-3 justify-end">
                            <button type="button" class="px-5 py-2 rounded-md font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors" on:click={() => showCancelModal = false}>{$t('results.entry.cancel')}</button>
                            <button type="button" class="px-5 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-700 text-white shadow transition-colors" on:click={() => { backToWelcome(); showCancelModal = false; }}>{$t('journal.save.cancel')}</button>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>
