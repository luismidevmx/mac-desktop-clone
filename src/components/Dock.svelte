<script lang="ts">
  import type { IWindowInternal } from '../stores/windowsStore'

  // icons
  import calculator from '../assets/icons/Calculator.png?w=200&h=200&webp'
  import notes from '../assets/icons/Notes.png?w=200&h=200&webp'
  import tictactoe from '../assets/icons/TicTacToe.png?w=200&h=200&webp'
  import vscode from '../assets/icons/VSCode.png?w=200&h=200&webp'
  
  // photo only
  // import amadine from '../assets/icons/Amadine.png?w=200&h=200&webp'
  // import chrome from '../assets/icons/Chrome.png?w=200&h=200&webp'
  // import discord from '../assets/icons/Discord.png?w=200&h=200&webp'
  // import finder from '../assets/icons/Finder.png?w=200&h=200&webp'
  // import spotify from '../assets/icons/Spotify.png?w=200&h=200&webp'
  // import twitter from '../assets/icons/X.png?w=200&h=200&webp'

  // stores
  import windows from '../stores/windowsStore'

  const icons = [
    { src: calculator, appName: 'Calculator' },
    { src: notes, appName: 'Notepad' },
    { src: tictactoe, appName: 'TicTacToe' },
    { src: vscode, appName: 'VSCode' },
    
    // photo only
    // { src: amadine, appName: 'Calculator' },
    // { src: chrome, appName: 'Notepad' },
    // { src: discord, appName: 'TicTacToe' },
    // { src: finder, appName: 'VSCode' },
    // { src: spotify, appName: 'Calculator' },
    // { src: twitter, appName: 'Notepad' },
  ]
  
  let dock: HTMLDivElement & { children: HTMLCollectionOf<HTMLButtonElement> }

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
  
  function resetTransform() {
    for(let i = 0; i < dock.children.length; i++) {
      dock.children[i].style.transform = `scale(1) translateY(0)`
      dock.children[i].style.marginLeft = "0"
      dock.children[i].style.marginRight = "0"
    }
  }
  
  function transform$(i: number) {
    const {exp, floor} = Math
    let y = 0
    
    return () => {
      for(let x = -2; x <= 2; x++) {
        if(i + x < 0 || i + x >= dock.children.length) continue
        
        y = exp(-(x**2)/2)
        
        dock.children[i + x].style.transform = `scale(${y + 1}) translateY(-${floor(12 * y)}px)`
        dock.children[i + x].style.marginLeft = `${floor(10 * (1 + y))}px`
        dock.children[i + x].style.marginRight = `${floor(10 * (1 + y))}px`
      }
    }
  }
  
</script>

<div class="dock" id="dock" bind:this={dock}>
  {#each icons as { src, appName }, i}
    <button class="dock-app" on:click={openApp$(appName)} on:mouseenter={transform$(i)} on:mouseleave={resetTransform}>
      <img {src} alt="{appName} dock icon"/>
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
    width: 800px;
    z-index: 1000000;

    &-app {
      background: transparent;
      border: none;
      cursor: pointer;
      display: block;
      height: @w;
      position: relative;
      transition: transform .3s ease, margin .3s ease;
      
      width: @w;
      
      img {
        width: 100%;
      }      
    }
  }
</style>
