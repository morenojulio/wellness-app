<script lang="ts">
  import { timeSettings } from '$lib/stores/timeSettings';
  import { t } from '$lib/utils/i18n';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  let localMorning = '09:00';
  let localAfternoon = '18:00';
  let localEvening = '21:00';
  let saveStatus: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let errorMsg = '';

  const unsubList: Array<() => void> = [];

  onMount(() => {
    timeSettings.init();
    const unsub = timeSettings.subscribe(s => {
      if (s.isInitialized) {
        localMorning = s.settings.morningUnlock;
        localAfternoon = s.settings.afternoonUnlock;
        localEvening = s.settings.eveningUnlock;
      }
      if (s.saving) saveStatus = 'saving';
      else if (!s.saving && saveStatus === 'saving') saveStatus = s.error ? 'error' : 'saved';
      if (s.error) errorMsg = s.error;
    });
    unsubList.push(unsub);
    return () => { unsubList.forEach(u => u()); };
  });

  async function save() {
    saveStatus = 'saving';
    errorMsg = '';
    const res = await timeSettings.save({
      morningUnlock: localMorning,
      afternoonUnlock: localAfternoon,
      eveningUnlock: localEvening
    });
    if (!res.success) {
      saveStatus = 'error';
      errorMsg = res.error || 'Unknown error';
    } else {
      saveStatus = 'saved';
      setTimeout(() => { if (saveStatus === 'saved') saveStatus = 'idle'; }, 3000);
    }
  }
</script>

<div class="max-w-xl mx-auto px-4 py-8 space-y-6">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{$t('settings.title')}</h1>
  <p class="text-gray-600 dark:text-gray-300">{$t('settings.subtitle')}</p>

  <form on:submit|preventDefault={save} class="space-y-6">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200" for="morning">{$t('settings.morningLabel')}</label>
        <input id="morning" type="time" bind:value={localMorning} class="w-40 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200" for="afternoon">{$t('settings.afternoonLabel')}</label>
        <input id="afternoon" type="time" bind:value={localAfternoon} class="w-40 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200" for="evening">{$t('settings.eveningLabel')}</label>
        <input id="evening" type="time" bind:value={localEvening} class="w-40 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed" disabled={saveStatus==='saving'}>
        {#if saveStatus === 'saving'}{$t('settings.saving')}{:else}{$t('settings.save')}{/if}
      </button>
      {#if saveStatus === 'saved'}<span class="text-green-600 dark:text-green-400 text-sm">{$t('settings.saved')}</span>{/if}
      {#if saveStatus === 'error'}<span class="text-red-600 dark:text-red-400 text-sm">{$t('settings.error')}: {errorMsg}</span>{/if}
    </div>
  </form>
</div>
