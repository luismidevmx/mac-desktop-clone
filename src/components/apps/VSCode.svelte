<script lang="ts">
  // hooks
  import { onMount } from 'svelte'

  // components
  import Fa from 'svelte-fa' // icons
  import Window from '../Window.svelte'

  // icons
  import { faCopy } from '@fortawesome/free-regular-svg-icons'
  import { faMagnifyingGlass, faCodeBranch, faBugSlash, faShapes } from '@fortawesome/free-solid-svg-icons'

  let { id } = $props()

  let editor = $state<HTMLDivElement>()

  const icons = [faCopy, faMagnifyingGlass, faCodeBranch, faBugSlash, faShapes]

  const doc = `import { onMount } from 'svelte'

let editor = $state<HTMLDivElement>() 
  
onMount(async () => {
  const { EditorView, basicSetup } = await import('codemirror')
  const { oneDark } = await import('@codemirror/theme-one-dark')
  const { javascript } = await import('@codemirror/lang-javascript')

  new EditorView({
    parent: editor,
    doc: 'console.log("hello")',
    // @ts-ignore -- correct theme installation
    extensions: [javascript(), ...basicSetup, oneDark]
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
      // @ts-ignore -- correct theme installation
      extensions: [javascript(), ...basicSetup, oneDark]
    })
  })
</script>

<!-- windowColor="#28284e" fontColor="#9c91de"-->
<Window class="vscode" title="Visual Studio Clone" windowColor="#21252b" fontColor="#ccc" height={500} width={700} x={50} y={110} minWidth={700} {id}>
  {#snippet menubar()}
    <button>File</button>
    <button>Edit</button>
    <button>Select</button>
    <button>View</button>
    <button>Go</button>
    <button>Run</button>
    <button>Debug</button>
    <button>Terminal</button>
    <button>Help</button>
  {/snippet}

  <div class="vscode-aside-icons">
    {#each icons as icon}
      <Fa class="vscode-icon" {icon} />
    {/each}
  </div>

  <div class="vscode-editor-wrapper">
    <div class="vscode-editor-top-files">
      <div class="vscode-editor-top-file active-true">
        <p>
          <svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"
            ><path d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0Z" fill="#3178C6" /><path
              d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.62-4.689 3.93-10.486 3.93-17.391 0-5.006-.749-9.394-2.246-13.163a30.748 30.748 0 0 0-6.479-10.055c-2.821-2.935-6.205-5.567-10.149-7.898-3.945-2.33-8.394-4.531-13.347-6.602-3.628-1.497-6.881-2.949-9.761-4.359-2.879-1.41-5.327-2.848-7.342-4.316-2.016-1.467-3.571-3.021-4.665-4.661-1.094-1.64-1.641-3.495-1.641-5.567 0-1.899.489-3.61 1.468-5.135s2.362-2.834 4.147-3.927c1.785-1.094 3.973-1.942 6.565-2.547 2.591-.604 5.471-.906 8.638-.906 2.304 0 4.737.173 7.299.518 2.563.345 5.14.877 7.732 1.597a53.669 53.669 0 0 1 7.558 2.719 41.7 41.7 0 0 1 6.781 3.797v-25.807c-4.204-1.611-8.797-2.805-13.778-3.582-4.981-.777-10.697-1.165-17.147-1.165-6.565 0-12.784.705-18.658 2.115-5.874 1.409-11.043 3.61-15.506 6.602-4.463 2.993-7.99 6.805-10.582 11.437-2.591 4.632-3.887 10.17-3.887 16.615 0 8.228 2.375 15.248 7.127 21.06 4.751 5.811 11.963 10.731 21.638 14.759a291.458 291.458 0 0 1 10.625 4.575c3.283 1.496 6.119 3.049 8.509 4.66 2.39 1.611 4.276 3.366 5.658 5.265 1.382 1.899 2.073 4.057 2.073 6.474a9.901 9.901 0 0 1-1.296 4.963c-.863 1.524-2.174 2.848-3.93 3.97-1.756 1.122-3.945 1.999-6.565 2.632-2.62.633-5.687.95-9.2.95-5.989 0-11.92-1.05-17.794-3.151-5.875-2.1-11.317-5.25-16.327-9.451Zm-46.036-68.733H140V109H41v22.742h35.345V233h28.137V131.742Z"
              fill="#FFF"
            /></svg
          >
          <span class="filename">main.ts</span>
        </p>
      </div>

      <!-- <div class="vscode-editor-top-file active-true">
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1052 1052"
            ><path fill="#f0db4f" d="M0 0h1052v1052H0z" /><path
              d="M965.9 801.1c-7.7-48-39-88.3-131.7-125.9-32.2-14.8-68.1-25.399-78.8-49.8-3.8-14.2-4.3-22.2-1.9-30.8 6.9-27.9 40.2-36.6 66.6-28.6 17 5.7 33.1 18.801 42.8 39.7 45.4-29.399 45.3-29.2 77-49.399-11.6-18-17.8-26.301-25.4-34-27.3-30.5-64.5-46.2-124-45-10.3 1.3-20.699 2.699-31 4-29.699 7.5-58 23.1-74.6 44-49.8 56.5-35.6 155.399 25 196.1 59.7 44.8 147.4 55 158.6 96.9 10.9 51.3-37.699 67.899-86 62-35.6-7.4-55.399-25.5-76.8-58.4-39.399 22.8-39.399 22.8-79.899 46.1 9.6 21 19.699 30.5 35.8 48.7 76.2 77.3 266.899 73.5 301.1-43.5 1.399-4.001 10.6-30.801 3.199-72.101zm-394-317.6h-98.4c0 85-.399 169.4-.399 254.4 0 54.1 2.8 103.7-6 118.9-14.4 29.899-51.7 26.2-68.7 20.399-17.3-8.5-26.1-20.6-36.3-37.699-2.8-4.9-4.9-8.7-5.601-9-26.699 16.3-53.3 32.699-80 49 13.301 27.3 32.9 51 58 66.399 37.5 22.5 87.9 29.4 140.601 17.3 34.3-10 63.899-30.699 79.399-62.199 22.4-41.3 17.6-91.3 17.4-146.6.5-90.2 0-180.4 0-270.9z"
              fill="#323330"
            /></svg
          >
          <span class="filename">main.js</span>
        </p>
      </div>

      <div class="vscode-editor-top-file active-false">
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 452 520"
            ><path fill="#e34f26" d="M41 460L0 0h451l-41 460-185 52" /><path fill="#ef652a" d="M226 472l149-41 35-394H226" /><path fill="#ecedee" d="M226 208h-75l-5-58h80V94H84l15 171h127zm0 147l-64-17-4-45h-56l7 89 117 32z" /><path
              fill="#fff"
              d="M226 265h69l-7 73-62 17v59l115-32 16-174H226zm0-171v56h136l5-56z"
            /></svg
          >
          <span class="filename">index.html</span>
        </p>
      </div>

      <div class="vscode-editor-top-file active-false">
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"
            ><path fill="#264de4" d="M71.357 460.819 30.272 0h451.456l-41.129 460.746L255.724 512z" /><path fill="#2965f1" d="m405.388 431.408 35.148-393.73H256v435.146z" /><path
              fill="#ebebeb"
              d="m124.46 208.59 5.065 56.517H256V208.59zm-5.041-57.875H256V94.197H114.281zM256 355.372l-.248.066-62.944-16.996-4.023-45.076h-56.736l7.919 88.741 115.772 32.14.26-.073z"
            /><path fill="#fff" d="M255.805 208.59v56.517H325.4l-6.56 73.299-63.035 17.013v58.8l115.864-32.112.85-9.549 13.28-148.792 1.38-15.176 10.203-114.393H255.805v56.518h79.639L330.3 208.59z" /></svg
          >
          <span class="filename">styles.css</span>
        </p>
      </div>-->
    </div>

    <div class="vscode-editor" bind:this={editor}></div>
  </div>
</Window>

<style lang="less" global>
  .vscode {
    color: var(--font-color);
    display: grid;
    grid-template-columns: 3em 1fr;

    &-aside-icons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
    }

    &-editor-top-files {
      display: flex;
      gap: 18px;
    }

    &-editor-top-file {
      padding: 0.3em 2em;
      cursor: pointer;

      &.active-true {
        border-bottom: 2px solid #2bcbba;
      }

      p {
        display: flex;
        align-items: center;
        gap: 0.5em;
      }

      svg,
      span {
        vertical-align: middle;
      }
    }

    &-icon {
      display: block;
      font-size: 1.5em;
      cursor: pointer;
      transition: color 0.2s;

      &:hover,
      &:first-child {
        color: #eee;
      }
    }

    &-editor {
      width: auto;
      span {
        font-family: var(--jetbrains-mono);
        font-variant-ligatures: normal;
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

    .cm-gutterElement {
      font-family: var(--jetbrains-mono);
    }

    .cm-foldGutter span {
      vertical-align: middle;
    }
  }
</style>
