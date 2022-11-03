<script>
  // background image
  import src from './assets/bg.jpg'

  // components
  import Window from './components/Window.svelte'
  import Dock from './components/Dock.svelte'
  import Menubar from './components/Menubar.svelte'
  import Calculator from './components/apps/Calculator.svelte'

  const windows = [
    // { x: 120, y: 100, width: 300, height: 200 },
    // { x: 420, y: 200, width: 300, height: 200 },
    // { x: 620, y: 300, width: 300, height: 200, resizable: false, title: 'No resizable app' }
  ]
</script>

<img {src} class="desktop-background" alt="desktop background are mountains" />

<Menubar />

{#each windows as w, i}
  <Window {...w} />
{/each}

<Calculator />

<Dock />

<style lang="less">
  .desktop {
    &-background {
      width: 100vw;
      height: 100vh;
      user-select: none;
    }
  }
</style>
