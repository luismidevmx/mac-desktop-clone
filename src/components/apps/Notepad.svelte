<script lang="ts">
  import { onMount } from 'svelte'

  import 'quill/dist/quill.snow.css'

  import Window from '../Window.svelte'

  let height = $state(350)
  let maximized = $state(false)

  let { id, quill } = $props()

  onMount(async () => {
    const { default: Quill } = await import('quill')

    quill = new Quill(`#${id}-editor`, {
      theme: 'snow',
      placeholder: 'Write your story...',
      modules: {
        toolbar: `#${id}-toolbar`
      }
    })
  })
</script>

<Window class="notepad" title="Notepad" bind:height bind:maximized width={680} x={500} y={220} minWidth={680} {id}>
  <div class="notepad-container">
    <div id="{id}-toolbar">
      <select class="ql-size"></select>

      <button class="ql-align"></button>
      <button class="ql-align" value="center"></button>
      <button class="ql-align" value="right"></button>
      <button class="ql-align" value="justify"></button>

      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>

      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>

      <select class="ql-color"></select>
      <select class="ql-background"></select>
      <button class="ql-clean"></button>

      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>

      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
    </div>
    <div id="{id}-editor"></div>
  </div>
</Window>

<style lang="less" global>
  .notepad {
    --window-content-overflow: hidden;

    padding: 0;

    .notepad-container {
      display: grid;
      grid-template-rows: auto 1fr;
      height: var(--height);
    }

    .ql-toolbar {
      border: none;
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 10000;
      background: var(--window-color);
    }

    .ql-editor {
      padding: 1em;
      overflow: auto;
      height: calc(var(--dynamic-height) - 80px);
      position: relative;
    }
  }
</style>
