<script lang="ts">
  import type Quill from 'quill'
  import { onMount } from 'svelte'

  import 'quill/dist/quill.snow.css'

  import Window from '../Window.svelte'

  let editor: HTMLDivElement
  let height = 350
  let maximized = false
  let windowEl: HTMLElement

  export let id: string
  export let quill: Quill = null

  $: h = maximized
    ? 'var(--maximized-height)'
    : `${height - clientHeight('.window-tittle') - clientHeight('.ql-toolbar') - clientHeight('.window-footer')}px`
  // $: console.log(windowEl?.clientHeight, height, maximized)

  function _$(cssSelector: string) {
    return windowEl?.querySelector?.(cssSelector)
  }

  function clientHeight(cssSelector: string) {
    return _$(cssSelector)?.clientHeight ?? 0
  }

  onMount(async () => {
    const { default: Quill } = await import('quill')

    windowEl = document.getElementById(`window-${id}`)

    quill = new Quill(editor, {
      modules: {
        toolbar: [
          [{ font: [] }],
          [{ header: 1 }, { header: 2 }], // custom button values

          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          [{ align: [] }],
          [{ color: [] }, { background: [] }, 'clean'],

          [{ list: 'ordered' }, { list: 'bullet' }]
        ]
      },
      theme: 'snow',
      placeholder: 'Write your story...'
    })
  })
</script>

<Window class="notepad" title="Notepad" bind:height bind:maximized width={570} x={500} y={160} minWidth={570} {id}>
  <div class="notepad-editor" bind:this={editor} style="--h: {h}" />

  <!-- <div slot="window-footer">
    [maximized: {maximized}, windowEl?.clientHeight: {windowEl?.clientHeight}px], style="--h: {h}"
  </div> -->
</Window>

<style lang="less" global>
  .notepad {
    padding: 0;

    &.window-content {
      overflow: hidden;
    }

    .ql-toolbar {
      position: sticky;
      border: none;
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
    }

    .ql-container {
      overflow: auto;
      min-height: 100px;
      height: var(--h);
    }
  }
</style>
