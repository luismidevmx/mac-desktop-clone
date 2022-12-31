<script lang="ts">
  import type { IWindowInternal } from '../stores/windowsStore'

  // icons
  import calculator from '../assets/icons/Calculator.png'
  import notes from '../assets/icons/Notes.png'
  import vscode from '../assets/icons/VSCode.png'
  // import appStore from '../assets/icons/AppStore.png'
  // import safari from '../assets/icons/Safari.png'

  // stores
  import windows from '../stores/windowsStore'

  const icons = [
    { src: calculator, appName: 'Calculator' },
    { src: notes, appName: 'Notepad' },
    { src: vscode, appName: 'VSCode' }
  ]

  function openApp$(appName: string) {
    const push = windows.push$(appName)
    let lastInstance: IWindowInternal

    windows.lastInstanceOff(appName).subscribe(x => (lastInstance = x))

    return () => {
      if (lastInstance) {
        windows.edit(lastInstance.id, { minimized: !lastInstance.data.minimized })
      } else {
        push()
      }
    }
  }
</script>

<div class="dock" id="dock">
  {#each icons as { src, appName }}
    <button class="dock-app" on:click={openApp$(appName)}>
      <img {src} alt="icon from sass" />
    </button>
  {/each}
</div>

<style lang="less">
  @import '../variables.less';
  @w: 4em;

  .dock {
    background: @dock;
    border-radius: 10px;
    bottom: 1em;
    display: flex;
    justify-content: center;
    left: 50%;
    padding: 0.2em;
    position: absolute;
    transform: translateX(-50%);
    user-select: none;
    width: 800px;
    z-index: 1000000;

    &-app {
      background: transparent;
      border: none;
      cursor: pointer;
      display: block;
      height: @w;
      position: relative;
      transition: transform 0.5s;
      width: @w;

      &:hover {
        transform: scale(1.5);
      }

      img {
        width: 100%;
      }
    }
  }
</style>
