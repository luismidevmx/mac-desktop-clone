<script lang="ts">
  import src from '../../assets/google.png?w=300&format=webp'

  import Window from '../Window.svelte'

  import { faSearch } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'

  let { id } = $props()
</script>

<Window {id} title="Google Chrome" class="chrome" windowColor="#DDE1E7" x={100} y={50} height={800} minHeight={600} width={1300} minWidth={800}>
  <!-- {#snippet extraControls()}
    <button aria-label="back"><Fa icon={faAngleLeft} /></button>
    <button aria-label="forward"><Fa icon={faAngleRight} /></button>
  {/snippet} -->

  <div class="chrome-content">
    <div class="chrome-bar">
      <!-- <div class="chrome-header-title">Chrome</div> -->
    </div>
    <div class="chrome-page page-google">
      <img {src} alt="google logo" />
      <label class="google-input">
        <Fa icon={faSearch} />
        <textarea rows="1"></textarea>
      </label>
      <div class="google-buttons">
        <button>Google Search</button>
        <button>Feeling Lucky</button>
      </div>
    </div>
  </div>
</Window>

<style lang="less">
  .chrome {
    &-content {
      display: grid;
      grid-template-rows: auto 1fr;
    }
    &-page {
      display: flex;
      flex-direction: column;
      gap: 2em;
      align-items: center;
      justify-content: center;
    }
    &-content {
      background-color: #fff;
    }
  }
  .google {
    &-input {
      border: none;
      outline: none;
      box-shadow: 0px 3px 10px 0px rgba(31, 31, 31, 0.08);
      padding: 14px 24px;
      border-radius: 26px;
      display: flex;
      align-items: center;
      gap: 24px;

      textarea {
        border: none;
        outline: none;
        box-shadow: none;
        resize: none;
        width: 600px;
        line-height: 22px;
      }
    }

    &-buttons {
      display: flex;
      gap: 1em;

      button {
        padding: 10px 16px;
        border-radius: 8px;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        background-color: #f8f9fa;
        border: none;
        color: #202124;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
</style>
