<script lang="ts">
  import type { AppName } from '../stores/windowsAPI'

  // icons
  import calculator from '../assets/icons/Calculator.png?w=200&h=200&format=webp'
  import notes from '../assets/icons/Notes.png?w=200&h=200&format=webp'
  import tictactoe from '../assets/icons/TicTacToe.png?w=200&h=200&format=webp'
  import vscode from '../assets/icons/VSCode-Alt-2.png?w=200&h=200&format=webp'
  import terminal from '../assets/icons/Terminal-Alt.png?w=200&h=200&format=webp'
  import chrome from '../assets/icons/Chrome.png?w=200&h=200&format=webp'
  import activityMonitor from '../assets/icons/ActivityMonitor.png?w=200&h=200&format=webp'

  // photo only
  // import amadine from '../assets/icons/Amadine.png?w=200&h=200&format=webp'
  // import discord from '../assets/icons/Discord.png?w=200&h=200&format=webp'
  // import finder from '../assets/icons/Finder.png?w=200&h=200&format=webp'
  // import spotify from '../assets/icons/Spotify.png?w=200&h=200&format=webp'
  // import twitter from '../assets/icons/X.png?w=200&h=200&format=webp'
  // import siri from '../assets/icons/Siri.png?w=200&h=200&format=webp'

  // stores
  import apps from '../stores/windowsAPI'

  const icons: { src: string; appName: AppName }[] = [
    { src: calculator, appName: 'calculator' },
    { src: notes, appName: 'notepad' },
    { src: tictactoe, appName: 'tictactoe' },
    { src: vscode, appName: 'vscode' },
    { src: terminal, appName: 'terminal' },
    { src: chrome, appName: 'chrome' },
    { src: activityMonitor, appName: 'activityMonitor' }

    // photo only
    // { src: amadine, appName: 'chrome' },
    // { src: discord, appName: 'chrome' },
    // { src: finder, appName: 'chrome' },
    // { src: spotify, appName: 'chrome' },
    // { src: twitter, appName: 'chrome' },
    // { src: siri, appName: 'chrome' }
  ]

  // @ts-ignore
  let dock: HTMLDivElement & { children: HTMLCollectionOf<HTMLButtonElement> } = $state()

  function resetTransform() {
    for (let i = 0; i < dock.children.length; i++) {
      dock.children[i].style.transform = `scale(1) translateY(0)`
      dock.children[i].style.marginLeft = '0'
      dock.children[i].style.marginRight = '0'
    }
  }

  function transform$(i: number) {
    const { exp, floor } = Math
    let y = 0

    return () => {
      for (let x = -2; x <= 2; x++) {
        if (i + x < 0 || i + x >= dock.children.length) continue

        y = exp(-(x ** 2) / 2)

        dock.children[i + x].style.transform = `scale(${y + 1}) translateY(-${floor(12 * y)}px)`
        dock.children[i + x].style.marginLeft = `${floor(10 * (1 + y))}px`
        dock.children[i + x].style.marginRight = `${floor(10 * (1 + y))}px`
      }
    }
  }
</script>

<div class="dock" id="dock" bind:this={dock}>
  {#each icons as { src, appName }, i}
    <button class="dock-app" onclick={() => apps.open(appName)} onmouseenter={transform$(i)} onmouseleave={resetTransform}>
      <img {src} alt="{appName} dock icon" />
    </button>
  {/each}
</div>

<style lang="less">
  @w: 4em;

  .dock {
    background: rgba(#fff, 0.6);
    border-radius: 10px;
    bottom: 1em;
    display: flex;
    justify-content: center;
    left: 50%;
    padding: 0.2em;
    position: absolute;
    transform: translateX(-50%);
    user-select: none;
    width: 900px;
    z-index: 9999999;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);

    &-app {
      background: transparent;
      border: none;
      cursor: pointer;
      display: block;
      height: @w;
      position: relative;
      transition:
        transform 0.2s ease,
        margin 0.2s ease;

      width: @w;

      img {
        width: 100%;
      }
    }
  }
</style>
