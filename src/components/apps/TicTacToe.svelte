<script lang="ts">
  import Window from '../Window.svelte'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { faCircle } from '@fortawesome/free-regular-svg-icons'
  import { faXmark } from '@fortawesome/free-solid-svg-icons'


  export let id: string
  
  let board: string[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
  
  let moveCount = 0
  
  let currentTurn = 'x'
  let winner = '-'
  let winnerLoc = ''
  let xScore = 0
  let oScore = 0
  
  $: select$ = (i: number, j: number) => {
    return () => {
      if(winner !== '-' || board[i][j] !== null) return
      board[i][j] = currentTurn
      moveCount++
      checkWinner(board, currentTurn)
      currentTurn = currentTurn === 'x' ? 'o' : 'x'
      
      if(winner === 'x') {
        xScore++
      } else if(winner === 'o') {
        oScore++
      }
    }
  }
  
  function reset() {
    board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]
    moveCount = 0
    winner = '-'
  }
  
  function resetGame() {
    xScore = 0
    oScore = 0
    reset()
  }
  
  function checkWinner(board: string[][], turn: string)
  {
    if (moveCount < 5) return
    
    if(board[0][0] === turn && board[0][1] === turn && board[0][2] === turn) {
      winner = turn
      winnerLoc = 'row-0'
      return
    }
    
    if(board[1][0] === turn && board[1][1] === turn && board[1][2] === turn) {
      winner = turn
      winnerLoc = 'row-1'
      return
    }
    
    if(board[2][0] === turn && board[2][1] === turn && board[2][2] === turn) {
      winner = turn
      winnerLoc = 'row-2'
      return
    }
    
    if(board[0][0] === turn && board[1][0] === turn && board[2][0] === turn) {
      winner = turn
      winnerLoc = 'col-0'
      return
    }
    
    if(board[0][1] === turn && board[1][1] === turn && board[2][1] === turn) {
      winner = turn
      winnerLoc = 'col-1'
      return
    }
    
    if(board[0][2] === turn && board[1][2] === turn && board[2][2] === turn) {
      winner = turn
      winnerLoc = 'col-2'
      return
    }
    
    if(board[0][0] === turn && board[1][1] === turn && board[2][2] === turn) {
      winner = turn
      winnerLoc = 'diag-a'
      return
    }
    
    if(board[0][2] === turn && board[1][1] === turn && board[2][0] === turn) {
      winner = turn
      winnerLoc = 'diag-b'
    }
  }
</script>

<Window
  title="Tic Tac Toe"
  {id}
  maximizable={false}
  resizable={false}
  x={400}
  y={200}
  height={300}
  width={200}
  windowColor="#000035"
  fontColor="#d0cadf"
>
  <svelte:fragment slot="window-menubar">
    <button on:click={reset}>Reset round</button>
    <button on:click={resetGame}>Reset game</button>
  </svelte:fragment>

  <div class="tic-tac-toe">
    <div class="board board-winner-{winner} board-winner-loc-{winnerLoc}">
      {#each board as row, i}
        {#each row as cell, j}
          {#if cell}
              {#if cell === 'x'}
                <div class="cell cell-x cell-row-{i} cell-col-{j}">
                  <Fa icon={faXmark}/>
                </div>
                
              {:else}
                <div class="cell cell-o cell-row-{i} cell-col-{j}">
                  <Fa icon={faCircle}/>
                </div>
              {/if}
              
          {:else}
              <button on:click={select$(i, j)} class="cell cell-available cell-turn-{currentTurn}"></button>
          {/if}
          
        {/each}
      {/each}
    </div>
    
    <div class="scores">
      <div class="score-icon score-x score-icon-x"><Fa icon={faXmark} /></div>
      <div class="score-text score-x">{xScore}</div>
      <div class="score-text score-dash">-</div>
      <div class="score-text score-o">{oScore}</div>
      <div class="score-icon score-o score-icon-o"><Fa icon={faCircle} /></div>
      <!-- <button class="button-reset" on:click={reset}>Reset</button> -->
    </div>
  </div>
  
</Window>

<style lang="less">
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
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      width: 100%;
      aspect-ratio: 1 / 1;
      
      &-winner-x { --winner-highlight: @x-highlight; }
      &-winner-o { --winner-highlight: @o-highlight; }
      
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
    }
    
    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      border-radius: 0;
      background: transparent;
      border: solid 1px #2c243e;
      transition: background color .3s ease-in-out;
      
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
      gap: .5em;
      
      .score-dash {
        font-weight: bold;
      }
      
      .score-icon {
        &-o {
          padding-top: .15em;
          font-size: .8em;
        }
      }
      
      .score-x { color: @x-color; }
      .score-o { 
        color: @o-color;
      }
    }
  }
</style>