<script lang="ts">
  // stores
  import windows from '../stores/windowsStore'

  // windows
  import Window from './Window.svelte'
  import Calculator from './apps/Calculator.svelte'
</script>

<!-- <Window title="inspector" width={300} height={200} x={1000} y={300} expandable={false} borders>
  <button on:click={push('calculator')}>click me!</button>
  windows: [{$windows}] <br />
  size: {$windows.length}
</Window> -->

{#each $windows as { id, data }}
  <svelte:component this={Calculator} {id} {...data} />
{/each}
