<script lang="ts">
  export let size: number = 40; // px
  export let label: string | undefined;
</script>

<div class="flex flex-col items-center gap-3 text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
  <div class="inline-block animate-spin rounded-full border-2 border-blue-600 border-t-transparent" style={`width:${size}px;height:${size}px`}></div>
  {#if label}
    <p class="text-sm">{label}</p>
  {/if}
</div>
