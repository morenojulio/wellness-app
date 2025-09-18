<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { t } from '$lib/utils/i18n';
  import { language } from '$lib/stores/language';
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  let email = '';
  let password = '';
  let confirmPassword = '';

  $: mode = $authStore.mode; // 'signin' | 'signup'
  $: error = $authStore.error;
  $: loading = $authStore.loading;

  function submit(e: Event) {
    e.preventDefault();
    if (mode === 'signup') {
      authStore.signUpEmail(email.trim(), password, confirmPassword);
    } else {
      authStore.signInEmail(email.trim(), password);
    }
  }

  function switchMode() {
    authStore.toggleMode();
    // Clear form + error
    email = '';
    password = '';
    confirmPassword = '';
  }

  function google() {
    authStore.signInWithGoogle();
  }
</script>

<div class="w-full max-w-md mx-auto" transition:fade>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 space-y-6">
    <div class="space-y-2 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{$t('auth.heading')}</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm">{$t('auth.subheading')}</p>
    </div>

    <form on:submit|preventDefault={submit} class="space-y-5">
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="email">{$t('auth.email')}</label>
        <input id="email" type="email" bind:value={email} required class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="password">{$t('auth.password')}</label>
        <input id="password" type="password" bind:value={password} required minlength="6" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      {#if mode === 'signup'}
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="confirm">{$t('auth.confirmPassword')}</label>
            <input id="confirm" type="password" bind:value={confirmPassword} required minlength="6" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      {/if}

      {#if error}
        <div class="text-sm font-medium text-red-600 dark:text-red-400" role="alert">{error}</div>
      {/if}

      <div class="space-y-3">
        <button type="submit" class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition" disabled={loading}>
          {#if loading}
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
          {/if}
          <span>{mode === 'signup' ? $t('auth.signUp') : $t('auth.signIn')}</span>
        </button>
        <button type="button" on:click={google} class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-60" disabled={loading}>
          <span>⚡ {$t('auth.google')}</span>
        </button>
      </div>
    </form>

    <div class="text-center text-sm">
      {#if mode === 'signup'}
        <button on:click={switchMode} class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">{$t('auth.switchToSignIn')}</button>
      {:else}
        <button on:click={switchMode} class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">{$t('auth.switchToSignUp')}</button>
      {/if}
    </div>
  </div>
</div>
