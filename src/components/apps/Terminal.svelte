<script lang="ts">
  import type { Handler } from '../../terminalHandlers/types'

  import Window from '../Window.svelte'

  let { id, symbolMessage = 'my-awesome-mac ~ %' } = $props()

  let command = $state('')
  let history = $state<string[]>([])
  let commandHistory = $state<string[]>([])
  let commandHistoryIndex = $state(0)

  const commands = [
    {
      name: 'clear',
      desc: 'Clears the terminal'
    },
    {
      name: 'echo',
      desc: 'Prints one or many lines of text',
      viteImport: () => import('../../terminalHandlers/echo')
    },
    {
      name: 'inspect',
      desc: 'Inspects a command and its arguments',
      viteImport: () => import('../../terminalHandlers/inspect')
    },
    {
      name: 'curl',
      desc: 'Fetches a resource from the web',
      viteImport: () => import('../../terminalHandlers/curl')
    },
    {
      name: 'neofetch',
      desc: 'Shows system info',
      viteImport: () => import('../../terminalHandlers/neofetch')
    },
    {
      name: 'mathjs',
      desc: 'Calculates an expression',
      viteImport: () => import('../../terminalHandlers/mathjs')
    }
  ].sort((a, b) => a.name.localeCompare(b.name))

  async function parse(line: string) {
    const { default: minimist } = await import('minimist')

    const cmd = minimist(line.split(' '))
    const root = cmd._[0]

    let result = ''
    const commandHandler = commands.find(c => c.name === root)

    if (root === 'clear') {
      history = []
    } else if (root === 'help') {
      result = commands.map(c => `<span class="ascii-cyan">${c.name}: </span>${c.desc}`).join('\n')
    } else if (commandHandler) {
      const handler = await commandHandler?.viteImport?.()
      result = (await handler?.default(cmd)) ?? ''
      result = filterHTML(result)
    } else {
      result = `${root}: Command not found`
    }

    result.split('\n').forEach(line => history.push(line))
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      commandHistory.push(command)
      history.push('$' + command)
      parse(command)
      command = ''
      commandHistoryIndex = 0
      return
    }

    if (e.key === 'ArrowUp') {
      command = commandHistory.at(--commandHistoryIndex) ?? ''
      return
    }

    if (e.key === 'ArrowDown') {
      command = commandHistory.at(++commandHistoryIndex) ?? ''
      return
    }
  }

  function filterHTML(html: string) {
    const parts = html.split('<')

    return parts
      .map(part => {
        if (/<\/?(b|i|span)\sclass="\w+">/.test(part)) {
          return part
        } else {
          return part.replace(/<[^>]+>/g, '')
        }
      })
      .join('<')
  }
</script>

<Window class="terminal" title="Terminal" fontColor="#d0cadf" windowColor="linear-gradient(180deg,rgba(0, 0, 0, 0.85) 57%, rgba(0, 8, 13, 0.85) 100%)" width={860} height={450} x={300} y={120} minWidth={860} minHeight={450} {id} borders>
  <!-- <div class="terminal-target" bind:this={target}></div> -->
  <label class="terminal-lines">
    {#each history as line}
      <div class="terminal-line">
        {#if line.startsWith('$')}
          <span class="terminal-symbol">{symbolMessage}</span>
          {line.slice(1)}
        {:else}
          {@html line}
        {/if}
      </div>
    {/each}

    <div class="terminal-line">
      <span class="terminal-symbol">{symbolMessage}</span>
      <input class="terminal-input" type="text" bind:value={command} onkeydown={handleKeydown} />
    </div>
  </label>

  <!-- {#snippet footer()}
    <small>[loc:, buff: {buff}]</small>
  {/snippet} -->
</Window>

<style lang="less" global>
  .terminal {
    &-lines {
      width: calc(var(--width) - 2em);
      font-family: var(--jetbrains-mono);
    }

    &-line {
      white-space: pre;
      width: calc(var(--width) - 2em);

      span {
        white-space: pre;
      }
    }

    &-symbol {
      font-style: italic;
      font-weight: bold;
      margin-right: 10px;
    }

    &-input {
      background: transparent;
      border: none;
      color: var(--font-color);
      outline: none;
      width: 50%;
    }

    &-target {
      height: 100%;
    }

    &::-webkit-scrollbar {
      width: 16px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
    }

    editor-squiggler {
      display: none !important;
    }

    span.ascii-pink {
      color: #f368e0;
    }
    span.ascii-bright-pink {
      color: #ff9ff3;
    }
    span.ascii-purple {
      color: #5758bb;
    }
    span.ascii-bright-purple {
      color: #9980fa;
    }
    span.ascii-blue {
      color: #4834d4;
    }
    span.ascii-bright-blue {
      color: #686de0;
    }
    span.ascii-cyan {
      color: #22a6b3;
    }
    span.ascii-bright-cyan {
      color: #7ed6df;
    }
    span.ascii-green {
      color: #6ab04c;
    }
    span.ascii-bright-green {
      color: #badc58;
    }
    span.ascii-red {
      color: #ff7979;
    }
    span.ascii-bright-red {
      color: #eb4d4b;
    }
    span.ascii-yellow {
      color: #f9ca24;
    }
    span.ascii-bright-yellow {
      color: #f6e58d;
    }
    span.ascii-orange {
      color: #f0932b;
    }
    span.ascii-bright-orange {
      color: #ffbe76;
    }
  }
</style>
