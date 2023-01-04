<script lang="ts">
  // hooks
  import { onMount } from 'svelte'

  // components
  import Fa from 'svelte-fa/src/fa.svelte' // icons
  import Window from '../Window.svelte'

  // icons
  import { faCopy } from '@fortawesome/free-regular-svg-icons'
  import { faMagnifyingGlass, faCodeBranch, faBugSlash, faShapes } from '@fortawesome/free-solid-svg-icons'

  // syntax highlighting
  // import { EditorView, basicSetup } from 'codemirror'
  // import { oneDark } from '@codemirror/theme-one-dark'
  // import { javascript } from '@codemirror/lang-javascript'

  export let id: string
  let editor: HTMLDivElement

  const icons = [faCopy, faMagnifyingGlass, faCodeBranch, faBugSlash, faShapes]

  const doc = `import { onMount } from 'svelte'
import { EditorView, basicSetup } from 'codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'

let editor // dom

onMount(() => {
  new EditorView({
    parent: editor,
    doc: 'console.log("hello, world")',
    // @ts-ignore
    extensions: [javascript(), ...basicSetup, oneDark] // solved a big migraine!
  })
})
`

  onMount(async () => {
    const { EditorView, basicSetup } = await import('codemirror')
    const { oneDark } = await import('@codemirror/theme-one-dark')
    const { javascript } = await import('@codemirror/lang-javascript')

    new EditorView({
      parent: editor,
      doc,
      // doc: `console.log('hello')\n// Last update: ${format(Date.now(), 'kk:mm a')}`,
      // @ts-ignore
      extensions: [javascript(), ...basicSetup, oneDark] // solved a big migraine!
    })
  })
</script>

<!-- windowColor="#28284e" fontColor="#9c91de"-->
<Window
  class="vscode"
  title="Visual Studio Clone"
  windowColor="#21252b"
  fontColor="#ccc"
  height={500}
  width={700}
  x={50}
  y={110}
  minWidth={700}
  {id}
>
  <div class="vscode-icons">
    {#each icons as icon}
      <Fa class="vscode-icon" {icon} />
    {/each}
  </div>

  <div class="vscode-editor-wrapper">
    <div class="vscode-editor" bind:this={editor} />
  </div>
</Window>

<style lang="less" global>
  .vscode {
    color: var(--font-color);
    display: grid;
    grid-template-columns: 3em 1fr;

    &-icon {
      display: block;
      font-size: 1.5em;
      margin: 0.5em auto;
      cursor: pointer;
      transition: color 0.3s;

      &:hover,
      &:first-child {
        color: #eee;
      }
    }

    &-editor {
      width: auto;
      * {
        font-family: monospace;
      }
    }

    &-editor,
    &-editor-wrapper {
      overflow: auto;

      &::-webkit-scrollbar {
        width: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #444;
      }
    }
  }
</style>
