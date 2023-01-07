<script lang="ts">
  import { onMount } from 'svelte'
  import Window from '../Window.svelte'

  // params
  export let id: string

  // core variables
  const chars = 'C()÷789⨯456-123+0.←='.split('')
  let isError = ''
  let result = 0
  let value = ''
  let writting = false

  let evaluate: Function
  $: _calc = (value: string) => evaluate(value.split('÷').join('/').split('⨯').join('*'))

  onMount(async () => {
    evaluate = (await import('mathjs')).evaluate
  })

  // methods
  function addChar(char: string) {
    switch (int(char)) {
      case 67: // clear
        return clear

      case 8592: // delete one char
        return () => {
          value = value.slice(0, value.length - 1)
          calc()
        }

      case 61: // equal
        return () => {
          writting = false
          calc()
        }
    }

    return () => {
      writting = true
      value += char

      // auto calculate
      calc()
    }
  }

  function int(char: string) {
    return char.charCodeAt(0)
  }

  function calc() {
    try {
      result = _calc(value)
      isError = ''
      //
    } catch (e) {
      if (writting) return

      result = e.message.split(' (char')[0]
      isError = 'is-error'
    }
  }

  function clear() {
    isError = value = ''
    result = 0
    writting = false
  }
</script>

<Window
  title="Calculator"
  {id}
  maximizable={false}
  x={200}
  y={300}
  height={285}
  minHeight={285}
  width={200}
  minWidth={200}
>
  <div class="calculator">
    <div class="calculator-display">
      <input class="calculator-entry" bind:value type="text" />
      <p class="calculator-result {isError}">{result}</p>
    </div>

    {#each chars as c}
      <button class="calculator-key calculator-key-{int(c)}" on:click={addChar(c)}>
        {c}
        <!-- {int(c)} -->
      </button>
    {/each}
  </div>
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
