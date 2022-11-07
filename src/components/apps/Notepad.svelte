<script lang="ts">
  // import { onMount } from 'svelte'
  // import 'quill/dist/quill.snow.css'
  // import type Quill from 'quill'

  import Window from '../Window.svelte'

  // let editor: HTMLDivElement, toolbar: HTMLDivElement

  export let id: string
  // export let quill: Quill = null
  // export let toolbarOptions = [
  //   [{ font: [] }],
  //   [{ header: 1 }, { header: 2 }], // custom button values

  //   ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  //   [{ align: [] }],
  //   [{ color: [] }, { background: [] }, 'clean'],

  //   [{ list: 'ordered' }, { list: 'bullet' }]
  // ]

  // onMount(async () => {
  //   const { default: Quill } = await import('quill')

  //   quill = new Quill(editor, {
  //     modules: {
  //       toolbar
  //       // {
  //       //   container: toolbar,
  //       //   options:
  //       // }
  //     },
  //     theme: 'snow',
  //     placeholder: 'Write your story...'
  //   })
  // })
</script>

<Window class="notepad" title="Notepad" height={350} width={570} x={500} y={160} minWidth={570} borders {id}>
  <div class="notepad-editor" contenteditable />
</Window>

<style lang="less" global>
  .notepad {
    padding: 1em;

    &-editor {
      height: 100%;
      width: 100%;
    }
  }
</style>
