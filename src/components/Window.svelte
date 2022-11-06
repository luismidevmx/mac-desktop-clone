<script lang="ts">
  import { generate as shortid } from 'shortid'
  // icons
  import Fa from 'svelte-fa/src/fa.svelte'
  import { faXmark, faMinus, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'

  // stores
  import windowsStore from '../stores/windowsStore'
  import zIndexStore from '../stores/zIndexStore'

  // core variables
  // prettier-ignore
  let className = '', kh = 0, kw = 0, kx = 0, ky = 0, resizing = false, zIndex = 1, moving = false

  // params
  // "immutable"
  export let id = shortid()
  export let title = 'Program'
  export { className as class }

  export let borders = false
  export let expandable = true
  export let resizable = true
  export let minHeight = 100
  export let minWidth = 100

  // stored
  export let x = 400
  export let y = 200
  export let width = 400
  export let height = 300
  // export let expanded = false

  // saving z-index when focus
  const zIndexId = zIndexStore.register(id)
  zIndexStore.listen(zIndexId, ({ zIndex: z }) => (zIndex = z))

  // // saving x,y... to another instances of same app
  // const edit = windowsStore.edit$(id)
  // const editSafe = windowsStore.editSafe$(id)
  // const transform = windowsStore.transform$(id)

  // editSafe({ x, y, width, height, expanded })

  // windowsStore.watch(id, newData => {
  //   x = newData.x
  //   y = newData.y
  // })

  function refresh(e) {
    move(e.movementX, e.movementY)

    if (resizing) {
      width += kw * e.movementX
      height -= kh * e.movementY

      move(kx * e.movementX, ky * e.movementY)

      if (width < minWidth) {
        // avoiding delay by pixels replacement
        width = minWidth
        move(-kx * e.movementX, 0)
      }

      if (height < minHeight) {
        // avoiding delay by pixels replacement
        height = minHeight
        move(0, -ky * e.movementY)
      }
    }
  }

  function move(dx: number, dy: number) {
    if (moving || resizing) {
      x += dx
      y -= dy
    }
    // saving into global store
    // transform(({ x, y }) => ({ x: x + dx, y: y - dy }))
  }

  function resize$(_kw = 0, _kh = 0, _kx = 0, _ky = 0) {
    return () => {
      focus()
      resizing = resizable
      kw = _kw
      kh = _kh
      kx = _kx
      ky = _ky
    }
  }

  function allowMove() {
    focus()
    moving = true
  }

  function focus() {
    zIndexStore.focus(zIndexId)
  }

  function reset() {
    moving = resizing = false
  }
</script>

<svelte:window on:mouseup={reset} on:mousemove={refresh} />

<div
  class="window animate__backOutDown {className}"
  style="
		bottom: {y}px;
		left: {x}px;
		width: {width}px;
		height: {height}px;
		min-width: {minWidth}px;
		min-height: {minHeight}px;
    z-index: {zIndex};
  "
  on:click={focus}
  on:keyup={focus}
>
  <p class="window-tittle" on:mousedown={allowMove} on:click={focus} on:keyup={focus}>{title}</p>

  <div class="window-controls">
    <button class="window-control" title="minimize">
      <Fa icon={faMinus} />
    </button>

    {#if expandable}
      <button class="window-control" title="maximize">
        <Fa icon={faUpRightAndDownLeftFromCenter} />
      </button>
    {/if}

    <button class="window-control" title="close" on:click={windowsStore.remove$(id)}>
      <Fa icon={faXmark} />
    </button>
  </div>

  <div class="window-content {borders}"><slot /></div>

  <slot name="window-footer">
    <!-- <small>{id} [ x: {x}, y: {y} ]</small> -->
  </slot>

  <!-- resizers -->
  {#if resizable}
    <button class="resizer top" on:mousedown={resize$(0, 1)} />
    <button class="resizer bottom" on:mousedown={resize$(0, -1, 0, 1)} />
    <button class="resizer left" on:mousedown={resize$(-1, 0, 1, 0)} />
    <button class="resizer right" on:mousedown={resize$(1)} />

    <button class="resizer top-left" on:mousedown={resize$(-1, 1, 1)} />
    <button class="resizer top-right" on:mousedown={resize$(1, 1)} />
    <button class="resizer bottom-left" on:mousedown={resize$(-1, -1, 1, 1)} />
    <button class="resizer bottom-right" on:mousedown={resize$(1, -1, 0, 1)} />
  {/if}
</div>

<style lang="less">
  // @gray-1: #e8e7ea;
  // @gray-2: #f3f0f3;
  // @controls-diameter: 10px;
  @resizer-border-width: 6px;

  // computed
  @b: @resizer-border-width;
  @b_2: -(@b / 2);

  .window {
    background: #fefefe;
    border-radius: 3px;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
    position: absolute;
    user-select: none;
    z-index: 50;
    overflow: hidden;

    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr auto;
    grid-auto-rows: auto;

    &-tittle,
    &-controls,
    &-footer,
    &-content.true {
      padding: 1em;
    }

    &-content {
      grid-column: 1 / -1;
    }

    &-control {
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      margin-left: 0.8em;
    }

    &-footer {
      grid-column: 1 / -1;
      text-align: right;
    }
  }

  .resizer {
    position: absolute;
    top: 0;
    left: 0;
    width: @b;
    height: @b;
    transform: translate(@b_2, @b_2);
    border: none;
    background: transparent;
    // background: rgba(255, 0, 0, 0.2);

    &.top,
    &.bottom {
      width: 100%;
      cursor: ns-resize;
    }

    &.left,
    &.right {
      height: 100%;
      cursor: ew-resize;
    }
    &.right,
    &.top-right,
    &.bottom-right {
      left: 100%;
    }

    &.bottom,
    &.bottom-left,
    &.bottom-right {
      top: 100%;
    }

    &.top-left {
      cursor: nw-resize;
    }
    &.top-right {
      cursor: ne-resize;
    }
    &.bottom-left {
      cursor: sw-resize;
    }
    &.bottom-right {
      cursor: se-resize;
    }
  }
</style>
