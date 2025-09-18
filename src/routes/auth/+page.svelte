<script lang="ts">
  import AuthCard from '$lib/components/AuthCard.svelte';
  import { authStore } from '$lib/stores/auth';
  import { t } from '$lib/utils/i18n';
  import Spinner from '$lib/components/Spinner.svelte';
</script>

<div class="min-h-[70vh] flex items-center justify-center p-4">
  {#if $authStore.loading}
    <Spinner size={40} label={$t('auth.loading') || 'Loading...'} />
  {:else if $authStore.user}
    <!-- Redirect immediately if already signed in -->
    <script>
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    </script>
    <div class="text-center space-y-4">
      <p class="text-lg font-medium text-gray-700 dark:text-gray-200">Redirecting...</p>
    </div>
  {:else}
    <AuthCard />
  {/if}
</div>
