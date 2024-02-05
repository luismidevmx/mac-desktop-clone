<script lang="ts">
  import Fa from 'svelte-fa/src/fa.svelte'
  import { faAppleWhole } from '@fortawesome/free-solid-svg-icons'
  import { format } from 'date-fns'
  const aa = { target: '_blank', rel: 'noopener noreferrer' }

  let date = format(Date.now(), 'ccc MMM dd kk:mm a')

  setInterval(() => (date = format(Date.now(), 'ccc MMM dd  hh:mm a')), 1000)
</script>

<nav class="menubar" id="menubar">
  <ul class="menubar-section">
    <li><Fa icon={faAppleWhole} /></li>

    <li><a href="https://github.com/LuisOlive/mac-desktop-clone" {...aa}>Code</a></li>
    <li><a href="https://github.com/LuisOlive?tab=repositories" {...aa}>Repos</a></li>
    <li><a href="https://github.com/LuisOlive" {...aa}>Author</a></li>
    <li><a href="https://fontawesome.com/search?o=r&m=free" {...aa}>Icons</a></li>
    <!-- <li><a href="#" target="_blank">More projects</a></li>
    <li><a href="#" target="_blank">Donate</a></li>  -->
  </ul>

  <p class="menubar-section">{date}</p>
</nav>

<style lang="less">
  .menubar {
    background: rgba(#fdfdfd, .6);
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    left: 0;
    padding: 0.4em 2em;
    position: absolute;
    top: 0;
    width: 100vw;
    z-index: 1000000;
    user-select: none;

    &-section {
      display: flex;
      gap: 2em;
    }

    li {
      list-style: none;
    }

    a {
      color: black;
      font-weight: bold;
      text-decoration: none;
    }
  }
</style>
