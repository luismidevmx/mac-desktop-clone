<script lang="ts">
  import Window from '../Window.svelte'
  import Fa from 'svelte-fa'
  import { faCircle, faSquareCheck, faSquare } from '@fortawesome/free-regular-svg-icons'
  import { faXmark } from '@fortawesome/free-solid-svg-icons'
  import { random } from 'lodash-es'

  let { id } = $props()

  let board: string[][] = $state([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ])

  let moveCount = $state(0)

  let currentTurn = $state<'x' | 'o'>('x')
  let winner = $state<'x' | 'o' | '-' | 'tie'>('-')
  let winnerLoc = $state('')
  let xScore = $state(0)
  let oScore = $state(0)
  let randomMode = $state(false)

  let randomSelect = $derived(() => {
    while (moveCount < 9) {
      const i = random(2)
      const j = random(2)

      if (board[i][j] === '') {
        select$(i, j)()
        break
      }
    }
  })

  let select$ = $derived((i: number, j: number) => {
    return () => {
      if (winner !== '-' || board[i][j] !== '') return
      board[i][j] = currentTurn
      moveCount++
      checkWinner(board, currentTurn)
      currentTurn = currentTurn === 'x' ? 'o' : 'x'

      // @ts-ignore
      if (winner === 'x') {
        xScore++
        // @ts-ignore
      } else if (winner === 'o') {
        oScore++
      }

      if (randomMode && currentTurn === 'o') {
        setTimeout(randomSelect, 120)
      }
    }
  })

  let next$ = $derived((i: number, j: number) => {
    return () => {
      reset()
      select$(i, j)()
    }
  })

  function reset() {
    board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
    moveCount = 0
    winner = '-'
    winnerLoc = ''
    currentTurn = 'x'
  }

  function resetGame() {
    xScore = 0
    oScore = 0
    reset()
  }

  function checkWinner(board: string[][], turn: 'x' | 'o') {
    if (moveCount < 5) return

    if (board[0][0] === turn && board[0][1] === turn && board[0][2] === turn) {
      winner = turn
      winnerLoc = 'row-0'
      return
    }

    if (board[1][0] === turn && board[1][1] === turn && board[1][2] === turn) {
      winner = turn
      winnerLoc = 'row-1'
      return
    }

    if (board[2][0] === turn && board[2][1] === turn && board[2][2] === turn) {
      winner = turn
      winnerLoc = 'row-2'
      return
    }

    if (board[0][0] === turn && board[1][0] === turn && board[2][0] === turn) {
      winner = turn
      winnerLoc = 'col-0'
      return
    }

    if (board[0][1] === turn && board[1][1] === turn && board[2][1] === turn) {
      winner = turn
      winnerLoc = 'col-1'
      return
    }

    if (board[0][2] === turn && board[1][2] === turn && board[2][2] === turn) {
      winner = turn
      winnerLoc = 'col-2'
      return
    }

    if (board[0][0] === turn && board[1][1] === turn && board[2][2] === turn) {
      winner = turn
      winnerLoc = 'diag-a'
      return
    }

    if (board[0][2] === turn && board[1][1] === turn && board[2][0] === turn) {
      winner = turn
      winnerLoc = 'diag-b'
    }

    if (moveCount === 9) {
      winner = 'tie'
    }
  }

  function startRandom() {
    randomMode = !randomMode
    reset()

    if (randomMode) {
      currentTurn = 'o'
      setTimeout(randomSelect, 120)
    }
  }
</script>

<Window title="Tic Tac Toe" {id} maximizable={false} resizable={false} x={400} y={200} height={280} width={200} windowColor="#000035" fontColor="#d0cadf">
  {#snippet menubar()}
    <button onclick={resetGame}>Reset score</button>
    <button onclick={startRandom}>
      <Fa icon={randomMode ? faSquareCheck : faSquare} />
      Random
    </button>
  {/snippet}

  <div class="tic-tac-toe">
    <div class="board board-winner-{winner} board-winner-loc-{winnerLoc}">
      {#each board as row, i}
        {#each row as cell, j}
          {#if cell}
            {#if cell === 'x'}
              <div class="cell cell-x cell-row-{i} cell-col-{j}">
                <Fa icon={faXmark} />
              </div>
            {:else}
              <div class="cell cell-o cell-row-{i} cell-col-{j}">
                <Fa icon={faCircle} />
              </div>
            {/if}
          {:else}
            <button onclick={select$(i, j)} class="cell cell-available cell-turn-{currentTurn}" aria-label="available place"></button>
          {/if}
        {/each}
      {/each}

      {#if winner !== '-'}
        <div class="board board-next">
          {#each board as row, i}
            {#each row as cell, j}
              <button onclick={next$(i, j)} class="cell cell-available cell-turn-{currentTurn}" aria-label="available place"></button>
            {/each}
          {/each}
        </div>
      {/if}
    </div>

    <div class="scores">
      <div class="score-icon score-x score-icon-x"><Fa icon={faXmark} /></div>
      <div class="score-text score-x">{xScore}</div>
      <div class="score-text score-dash">-</div>
      <div class="score-text score-o">{oScore}</div>
      <div class="score-icon score-o score-icon-o"><Fa icon={faCircle} /></div>
      <!-- <button class="button-reset" onclick={reset}>Reset</button> -->
    </div>
  </div>
</Window>

<style lang="less" global>
  @x-color: #2dffcc;
  @o-color: #ff3535;
  @x-highlight: rgba(@x-color, 0.4);
  @o-highlight: rgba(@o-color, 0.4);
  @fore-color: #d0cadf;
  @window-color: #000035;

  .tic-tac-toe {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-evenly;

    .board {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      width: 100%;
      aspect-ratio: 1 / 1;

      &-winner-x {
        --winner-highlight: @x-highlight;
      }
      &-winner-o {
        --winner-highlight: @o-highlight;
      }

      &-winner-loc-row-0 .cell-row-0,
      &-winner-loc-row-1 .cell-row-1,
      &-winner-loc-row-2 .cell-row-2,
      &-winner-loc-col-0 .cell-col-0,
      &-winner-loc-col-1 .cell-col-1,
      &-winner-loc-col-2 .cell-col-2,
      &-winner-loc-diag-a .cell-row-0.cell-col-0,
      &-winner-loc-diag-a .cell-row-1.cell-col-1,
      &-winner-loc-diag-a .cell-row-2.cell-col-2,
      &-winner-loc-diag-b .cell-row-0.cell-col-2,
      &-winner-loc-diag-b .cell-row-1.cell-col-1,
      &-winner-loc-diag-b .cell-row-2.cell-col-0 {
        background: var(--winner-highlight);
      }

      &-next {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .cell {
          border: none;
        }
      }
    }

    .cell {
      display: flex;
      justify-content: center;
      align-items: center;

      border-radius: 0;
      background: transparent;
      border: solid 1px #2c243e;
      transition: background color 0.3s ease-in-out;

      &-x {
        color: @x-color;
        font-size: 36px;
      }

      &-o {
        color: @o-color;
        font-size: 26px;
      }

      &-available {
        cursor: pointer;
      }

      &-turn-x:hover {
        background: @x-highlight;
      }

      &-turn-o:hover {
        background: @o-highlight;
      }
    }

    .scores {
      display: flex;
      justify-content: center;
      gap: 0.5em;

      .score-dash {
        font-weight: bold;
      }

      .score-icon {
        &-o {
          padding-top: 0.15em;
          font-size: 0.8em;
        }
      }

      .score-x {
        color: @x-color;
      }
      .score-o {
        color: @o-color;
      }
    }
  }
</style>
