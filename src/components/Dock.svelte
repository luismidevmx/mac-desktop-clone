<script lang="ts">
  import calculator from '../assets/icons/Calculator.png'
  import appStore from '../assets/icons/AppStore.png'
  import notes from '../assets/icons/Notes.png'
  import safari from '../assets/icons/Safari.png'

  const icons = [{ src: calculator }, { src: appStore }, { src: notes }, { src: safari }]
</script>

<div class="dock">
  {#each icons as { src }}
    <button class="dock-app">
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
