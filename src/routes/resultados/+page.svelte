<script lang="ts">
    import { onMount } from "svelte";
    import { journalStore, updateJournalEntry, deleteJournalEntry } from "$lib/stores/journal";
    import { authStore } from '$lib/stores/auth';
    import { language } from "$lib/stores/language";
    import { t } from "$lib/utils/i18n";
    import { formatDate } from "$lib/utils/i18n";
    import { clickOutside } from '$lib/clickOutside';
    import { menuA11y } from '$lib/menuA11y';
    import Spinner from '$lib/components/Spinner.svelte';

    // Journal store now initialized globally in +layout.svelte
    onMount(() => {
        // Additional per-page setup could go here
    });

    $: user = $authStore.user;

    // State
    let editingId: string | null = null;
    let editData: any = {};
    let saving = false;
    let deletingId: string | null = null;
    let openMenuId: string | null = null;
    let showDeleteModal = false;
    let deleteEntryId: string | null = null;


    function toggleMenu(id: string) {
        openMenuId = openMenuId === id ? null : id;
    }

    function startEdit(entry: any) {
        editingId = entry.id;
        editData = { ...entry };
        openMenuId = null;
    }

    function cancelEdit() {
        editingId = null;
        editData = {};
        openMenuId = null;
    }

    async function saveEdit() {
        if (!editingId) return;
        saving = true;
        const { id, timestamp, ...data } = editData; // exclude id & timestamp
        await updateJournalEntry(editingId, data);
        saving = false;
        editingId = null;
        openMenuId = null;
    }

    function requestDelete(entry: any) {
        deleteEntryId = entry.id;
        showDeleteModal = true;
        openMenuId = null;
    }

    async function performDelete() {
        if (!deleteEntryId) return;
        deletingId = deleteEntryId;
        await deleteJournalEntry(deleteEntryId);
        deletingId = null;
        deleteEntryId = null;
        showDeleteModal = false;
    }

    function cancelDelete() {
        showDeleteModal = false;
        deleteEntryId = null;
    }

    function formatTimestamp(timestamp: any) {
        if (timestamp && timestamp.toDate) {
            return formatDate(timestamp.toDate(), $language);
        }
        return $language === 'es' ? "Fecha no disponible" : "Date not available";
    }

    function getEnergyColor(energy: number) {
        if (energy >= 8) return "text-green-600 dark:text-green-400";
        if (energy >= 6) return "text-yellow-600 dark:text-yellow-400";
        if (energy >= 4) return "text-orange-600 dark:text-orange-400";
        return "text-red-600 dark:text-red-400";
    }

    function getEnergyBg(energy: number) {
        if (energy >= 8) return "bg-green-100 dark:bg-green-900";
        if (energy >= 6) return "bg-yellow-100 dark:bg-yellow-900";
        if (energy >= 4) return "bg-orange-100 dark:bg-orange-900";
        return "bg-red-100 dark:bg-red-900";
    }
</script>

<div class="p-2 sm:p-5">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-gray-100 text-center border-b-2 border-blue-500 pb-3">
                {$t('results.title')}
            </h1>
            <p class="text-center text-gray-600 dark:text-gray-300 mt-4">
                {$t('results.subtitle')}
            </p>
        </div>

        {#if $authStore.loading}
            <div class="py-16">
                <Spinner size={40} label={$t('auth.loading') || 'Loading...'} />
            </div>
        {:else if !user}
            <div class="py-16 text-center text-gray-600 dark:text-gray-300 text-sm">{$t('auth.loading') || 'Loading...'}</div>
        {:else if $journalStore.isLoading}
            <div class="text-center py-12">
                <Spinner size={32} label={$t('results.loading')} />
            </div>
        {:else if $journalStore.error}
            <div class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                <strong>{$t('results.error')}</strong> {$journalStore.error}
            </div>
        {:else if $journalStore.entries.length === 0}
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📝</div>
                <h2 class="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                    {$t('results.noEntries.title')}
                </h2>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                    {$t('results.noEntries.subtitle')}
                </p>
                <a
                    href="/"
                    class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
                >
                    {$t('results.noEntries.button')}
                </a>
            </div>
        {:else}
            <!-- Entries List -->
            <div class="space-y-6">
                {#each $journalStore.entries as entry (entry.id)}
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <!-- Entry Header -->
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {formatTimestamp(entry.timestamp)}
                            </h2>

                            <div class="flex items-center gap-4 flex-wrap relative">
                                <!-- Energy Levels Summary -->
                                <div class="flex space-x-4 text-sm">
                                    <div class="flex items-center space-x-1">
                                        <span class="text-orange-500">🌅</span>
                                        {#if editingId === entry.id}
                                            <input type="number" min="1" max="10" bind:value={editData.morningEnergy} class="w-16 px-1 py-0.5 border rounded text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700" />
                                        {:else}
                                            <span class="px-2 py-1 rounded-full {getEnergyBg(entry.morningEnergy)} {getEnergyColor(entry.morningEnergy)} font-medium">
                                                {entry.morningEnergy}/10
                                            </span>
                                        {/if}
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <span class="text-red-500">☀️</span>
                                        {#if editingId === entry.id}
                                            <input type="number" min="1" max="10" bind:value={editData.afternoonEnergy} class="w-16 px-1 py-0.5 border rounded text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700" />
                                        {:else}
                                            <span class="px-2 py-1 rounded-full {getEnergyBg(entry.afternoonEnergy)} {getEnergyColor(entry.afternoonEnergy)} font-medium">
                                                {entry.afternoonEnergy}/10
                                            </span>
                                        {/if}
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <span class="text-purple-500">🌙</span>
                                        {#if editingId === entry.id}
                                            <input type="number" min="1" max="10" bind:value={editData.eveningEnergy} class="w-16 px-1 py-0.5 border rounded text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700" />
                                        {:else}
                                            <span class="px-2 py-1 rounded-full {getEnergyBg(entry.eveningEnergy)} {getEnergyColor(entry.eveningEnergy)} font-medium">
                                                {entry.eveningEnergy}/10
                                            </span>
                                        {/if}
                                    </div>
                                </div>

                                 <!-- Kebab Menu (focus + a11y wrapper) -->
                                 <div class="relative ml-auto" use:clickOutside on:outside={() => openMenuId === entry.id && (openMenuId = null)} use:menuA11y>
                                     <button data-menu-trigger class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition text-gray-600 dark:text-gray-200" aria-haspopup="menu" aria-expanded={openMenuId === entry.id} aria-controls={`entry-menu-${entry.id}`} aria-label="entry menu" on:click={() => toggleMenu(entry.id)}>
                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                             <path d="M10 6a1.25 1.25 0 110-2.5A1.25 1.25 0 0110 6zm0 3.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0 3.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
                                         </svg>
                                     </button>
                                     {#if openMenuId === entry.id}
                                         <div id={`entry-menu-${entry.id}`} role="menu" class="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-20 py-1 text-sm text-gray-700 dark:text-gray-100">
                                             {#if editingId === entry.id}
                                                 <button tabindex="-1" role="menuitem" on:click={saveEdit} class="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 disabled:opacity-50" disabled={saving}>
                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-green-600 dark:text-green-400">
                                                         <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                                                     </svg>
                                                     {saving ? '...' : $t('results.entry.save')}
                                                 </button>
                                                 <button tabindex="-1" role="menuitem" on:click={cancelEdit} class="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800">
                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-gray-500 dark:text-gray-400">
                                                         <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                     </svg>
                                                     {$t('results.entry.cancel')}
                                                 </button>
                                             {:else}
                                                 <button tabindex="-1" role="menuitem" on:click={() => startEdit(entry)} class="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800">
                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-blue-600 dark:text-blue-400">
                                                         <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                                                         <path fill-rule="evenodd" d="M11.379 5.793L4 13.172V16h2.828l7.379-7.379-2.828-2.828zM3 12.172L12.172 3l4.243 4.243a1 1 0 010 1.414l-8.586 8.586A1 1 0 017.172 18H3a1 1 0 01-1-1v-4.172a1 1 0 01.293-.707z" clip-rule="evenodd" />
                                                     </svg>
                                                     {$t('results.entry.edit')}
                                                 </button>
                                                 <button tabindex="-1" role="menuitem" on:click={() => requestDelete(entry)} class="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800/40 focus:outline-none focus:bg-red-50 dark:focus:bg-red-800/40 disabled:opacity-50" disabled={deletingId === entry.id}>
                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                                                         <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                                     </svg>
                                                     {deletingId === entry.id ? '...' : $t('results.entry.delete')}
                                                 </button>
                                             {/if}
                                         </div>
                                     {/if}
                                 </div>
                            </div>
                        </div>

                        <!-- Entry Content -->
                        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <!-- Morning Section -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-orange-500 border-b border-orange-200 dark:border-orange-800 pb-1">
                                    {$t('journal.morning.title')}
                                </h3>
                                {#if editingId === entry.id}
                                    <div>
                                        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.morningFocus')}</h4>
                                        <textarea bind:value={editData.morningFocus} rows={3} class="w-full text-sm p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"></textarea>
                                    </div>
                                {:else if entry.morningFocus}
                                    <div>
                                        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.morningFocus')}</h4>
                                        <p class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                            {entry.morningFocus}
                                        </p>
                                    </div>
                                {/if}
                            </div>

                            <!-- Afternoon Section -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-red-500 border-b border-red-200 dark:border-red-800 pb-1">
                                    {$t('journal.afternoon.title')}
                                </h3>
                                {#if editingId === entry.id}
                                    <div>
                                        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.authenticMoment')}</h4>
                                        <textarea bind:value={editData.afternoonMoment} rows={3} class="w-full text-sm p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"></textarea>
                                    </div>
                                {:else if entry.afternoonMoment}
                                    <div>
                                        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.authenticMoment')}</h4>
                                        <p class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                            {entry.afternoonMoment}
                                        </p>
                                    </div>
                                {/if}
                            </div>

                            <!-- Evening Section -->
                            <div class="space-y-4 md:col-span-2 lg:col-span-1">
                                <h3 class="text-lg font-semibold text-purple-500 border-b border-purple-200 dark:border-purple-800 pb-1">
                                    {$t('journal.evening.title')}
                                </h3>

                                {#if editingId === entry.id}
                                    <div>
                                        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.mainEmotion')}</h4>
                                        <textarea bind:value={editData.eveningEmotion} rows={2} class="w-full text-sm p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"></textarea>
                                    </div>
                                {:else if entry.eveningEmotion}
                                    <div>
                                        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.mainEmotion')}</h4>
                                        <p class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                            {entry.eveningEmotion}
                                        </p>
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Evening Reflections -->
                        {#if entry.eveningAuthentic || entry.eveningActing || entry.eveningAdmiration}
                            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 class="text-lg font-semibold text-purple-500 mb-4">{$t('results.entry.eveningReflections')}</h3>
                                <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                                    {#if editingId === entry.id}
                                        <div>
                                            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.authenticEvening')}</h4>
                                            <textarea bind:value={editData.eveningAuthentic} rows={2} class="w-full text-sm p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"></textarea>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.acting')}</h4>
                                            <textarea bind:value={editData.eveningActing} rows={2} class="w-full text-sm p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"></textarea>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.admiration')}</h4>
                                            <textarea bind:value={editData.eveningAdmiration} rows={2} class="w-full text-sm p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"></textarea>
                                        </div>
                                    {:else}
                                        {#if entry.eveningAuthentic}
                                            <div>
                                                <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.authenticEvening')}</h4>
                                                <p class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                    {entry.eveningAuthentic}
                                                </p>
                                            </div>
                                        {/if}

                                        {#if entry.eveningActing}
                                            <div>
                                                <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.acting')}</h4>
                                                <p class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                    {entry.eveningActing}
                                                </p>
                                            </div>
                                        {/if}

                                        {#if entry.eveningAdmiration}
                                            <div>
                                                <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">{$t('results.entry.admiration')}</h4>
                                                <p class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                    {entry.eveningAdmiration}
                                                </p>
                                            </div>
                                        {/if}
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    {#if showDeleteModal}
        <div class="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" role="button" tabindex="0" aria-label={$t('results.entry.cancel')} on:click={cancelDelete} on:keydown={(e)=>{ if(e.key==='Escape'|| e.key==='Enter' || e.key===' ') { e.preventDefault(); cancelDelete(); } }}></div>
            <div class="relative z-50 w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 space-y-5">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-red-600 dark:text-red-400">
                            <path fill-rule="evenodd" d="M8.257 3.099c.366-.756 1.42-.756 1.786 0l6.518 13.47A1 1 0 0115.518 18H4.482a1 1 0 01-.893-1.431L10.107 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 12z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{$t('results.entry.delete')}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-300">{$t('results.entry.confirmDelete')}</p>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-3 pt-2">
                    <button on:click={cancelDelete} class="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{$t('results.entry.cancel')}</button>
                    <button on:click={performDelete} class="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50" disabled={deletingId === deleteEntryId}>{deletingId === deleteEntryId ? '...' : $t('results.entry.delete')}</button>
                </div>
            </div>
        </div>
    {/if}
</div>
