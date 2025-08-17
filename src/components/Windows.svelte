<script lang="ts">
  import apps from '../stores/windowsAPI'
</script>

{#each $apps.instances as { id, appName }}
  {#if appName !== 'closedApp'}
    <svelte:component this={$apps.appComponents[appName]} {id} />
  {/if}
{/each}
