<script lang="ts">
  import { min } from 'lodash-es'
  import { onMount } from 'svelte'
  import Window from '../Window.svelte'

  let { id } = $props()

  // core variables
  const chars = 'C()÷789⨯456-123+0.←='.split('')

  let isError = $state('')
  let result = $state<string | number>('')
  let writting = $state(false)
  let inputEl = $state<HTMLInputElement>()
  let value = $state('')
  let caretLoc = $state(0)

  let evaluate: Function
  let format: Function
  let evaluation = $derived(value.replaceAll('÷', '/').replaceAll('⨯', '*'))

  onMount(async () => {
    const math = await import('mathjs')
    evaluate = math.evaluate
    format = (expr: string) => math.format(expr, { notation: 'auto', precision: 12, lowerExp: -7, upperExp: 9 })
  })

  function addChar(char: string) {
    return () => {
      const before = value.slice(0, caretLoc) ?? ''
      const after = value.slice(caretLoc) ?? ''

      writting = true
      value = processChar(before, after, char)

      if (int(char) !== 8592) {
        caretLoc = min([caretLoc + char.length, value.length]) ?? 0
      } else {
        caretLoc--
      }

      calc()
    }
  }

  function processChar(before: string, after: string, char: string) {
    switch (int(char)) {
      case 67: // clear
        clear()
        return ''

      case 8592: // delete one char
        return before.slice(0, -1) + after

      case 61: // equal
        writting = false
        return before + after
    }

    return before + char + after
  }

  function refreshCaret() {
    caretLoc = inputEl?.selectionStart ?? 0
  }

  function int(char: string) {
    return char.charCodeAt(0)
  }

  function calc() {
    try {
      result = evaluate(evaluation)
      isError = ''
      writting = false
      // console.log(evaluation, result)
      if (result === undefined || result === 'undefined') {
        result = 0
      }

      result = format(result)

      if (result?.toString().startsWith('function')) {
        result = `Function: ${value}(x)`
      }
      //
    } catch (e: any) {
      if (writting) return
      result = e?.message?.split(' (char')?.[0] ?? 0

      if (result?.toString()?.startsWith('Unexpected end of expression')) {
        result = evaluation
      }

      isError = 'is-error'
      // console.log(e)
    }
  }

  function clear() {
    isError = value = ''
    result = 0
    writting = false
  }
</script>

<Window title="Calculator" {id} maximizable={false} x={200} y={300} height={270} minHeight={270} width={200} minWidth={200}>
  <div class="calculator">
    <div class="calculator-display">
      <input class="calculator-entry" bind:this={inputEl} bind:value type="text" oninput={calc} onclick={refreshCaret} onselect={refreshCaret} onkeyup={refreshCaret} />
      <p class="calculator-result {isError}">{result}</p>
    </div>

    {#each chars as c}
      <button class="calculator-key calculator-key-{int(c)}" onclick={addChar(c)}>
        {c}
        <!-- {int(c)} -->
      </button>
    {/each}
  </div>
  <!-- {#snippet footer()}
    [caret: {caretLoc}]
  {/snippet} -->
</Window>

<style lang="less">
  .calculator {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 1fr);
    height: 100%;
    position: relative;

    &-entry,
    &-result {
      text-align: right;
    }

    &-entry,
    &-key {
      background: none;
      border: none;
      display: block;
      transition: font-size 0.1s;
      width: 100%;
    }

    &-display {
      background: #f0fac9;
      display: flex;
      flex-direction: column;
      grid-column: 1 / -1;
      justify-content: space-evenly;
      padding-right: 1em;
    }

    &-key {
      background: #e0e0e0;
      cursor: pointer;
      padding: 0.5em;

      &:hover {
        background: #d4d4d4;
      }
      &:active {
        background: #a7a7a7;
      }

      // parenthesis and del
      &-40,
      &-41,
      &-8592 {
        background: #d6d6d6;
      }

      // operators
      &-43,
      &-45,
      &-247,
      &-10799 {
        background: #f79231;
        color: white;

        &:hover {
          background: #faa32e;
        }
        &:active {
          background: #f8a830;
        }
      }

      // clear
      &-67 {
        background: #ff3f34;
        color: white;

        &:hover {
          background: #ff2c20;
        }
        &:active {
          background: #ff1104;
        }
      }

      // equal
      &-61 {
        background: #11c85f;
        color: white;

        &:hover {
          background: #12cf63;
        }
        &:active {
          background: #0ea54e;
        }
      }
    }

    &-result {
      &.is-error {
        color: #ff3f34;
      }
    }
  }
</style>
