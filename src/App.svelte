<script lang="ts">
  // background image
  import src from './assets/bg.jpg'

  // components
  import Windows from './components/Windows.svelte'
  import Dock from './components/Dock.svelte'
  import Menubar from './components/Menubar.svelte'
</script>

<img {src} class="desktop-background" alt="desktop background are mountains" />

<Menubar />

<Windows />

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
