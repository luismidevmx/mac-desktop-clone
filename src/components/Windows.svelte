<script lang="ts">
  // stores
  import windows from '../stores/windowsStore'

  // windows
  // import Window from './Window.svelte'
  import Calculator from './apps/Calculator.svelte'
  import Notepad from './apps/Notepad.svelte'
  import VSCode from './apps/VSCode.svelte'

  const windowComponents = {
    Calculator,
    Notepad,
    VSCode
  }
</script>

<!-- <Window id="inspector" title="inspector" width={300} height={400} x={1000} y={200} maximizable={false} borders>
  <table style="font-size: 11px">
    {#each $windows as { id, data, type }}
      <tr>
        <td>{type}@{id}</td>
        <td>[ {Object.values(data)} ]</td>
      </tr>
    {/each}
  </table>
</Window> -->

{#each $windows as { id, type }}
  <svelte:component this={windowComponents[type]} {id} />
{/each}
