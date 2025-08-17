<script lang="ts">
  import Window from '../Window.svelte'

  import windowsApi from '../../stores/windowsAPI'

  // icons
  import calculator from '../../assets/icons/Calculator.png?w=20&h=20&format=webp'
  import notepad from '../../assets/icons/Notes.png?w=20&h=20&format=webp'
  import tictactoe from '../../assets/icons/TicTacToe.png?w=20&h=20&format=webp'
  import vscode from '../../assets/icons/VSCode-Alt-2.png?w=20&h=20&format=webp'
  import terminal from '../../assets/icons/Terminal-Alt.png?w=20&h=20&format=webp'
  import chrome from '../../assets/icons/Chrome.png?w=20&h=20&format=webp'
  import activityMonitor from '../../assets/icons/ActivityMonitor.png?w=20&h=20&format=webp'

  const icons = {
    calculator,
    notepad,
    tictactoe,
    vscode,
    terminal,
    chrome,
    activityMonitor
  }

  let { id } = $props()
</script>

<Window {id} title="Force Quit Applications" borders x={1200} y={200} height={400} minHeight={400} width={400} minWidth={400}>
  <div class="am">
    {#each $windowsApi.instances as app}
      {#if app.appName !== 'closedApp'}
        <div class="am-list-item">
          <p>
            <img src={icons[app.appName]} alt="{app.appName} icon" />
          </p>
          <p>{app.appName}</p>
          <p>{app.id.slice(8)}...</p>
          <p><button onclick={() => windowsApi.close(app.id)}>Quit</button></p>
        </div>
      {/if}
      {#if app.appName === 'closedApp'}
        <div class="am-list-item closed-app">
          <p>-</p>
          <p>{app.appName}</p>
          <p>{app.id.slice(8)}...</p>
          <p>-</p>
        </div>
      {/if}
    {/each}
  </div>
</Window>

<style lang="less">
  .am {
    &-list-item {
      display: grid;
      grid-template-columns: 2em 1fr 1fr 2em;
      vertical-align: middle;

      &:nth-child(odd) {
        background-color: #f5f5f5;
      }

      &.closed-app {
        color: #555;
      }

      button {
        color: red;
        font-size: 10px;
        border: none;
        background-color: transparent;
        cursor: pointer;
      }
    }
  }
</style>
