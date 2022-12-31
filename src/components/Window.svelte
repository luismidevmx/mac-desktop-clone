<script lang="ts">
  import { generate as shortid } from 'shortid'
  // icons
  import Fa from 'svelte-fa/src/fa.svelte'
  import { faXmark, faMinus, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons'

  // stores
  import windowsStore from '../stores/windowsStore'
  import zIndexStore from '../stores/zIndexStore'

  type CssUnit = number | string

  // core variables
  let className = ''

  // resizing factors
  let kh = 0,
    kw = 0,
    kx = 0,
    ky = 0

  // resizing data
  let resizing = false,
    _resizable: boolean

  // other
  let zIndex = 1,
    moving = false,
    maximizedHeight: number,
    maximizedBottom: number

  // params
  // "immutable"
  export let id = shortid()
  export let title = 'Program'
  export { className as class }
  export let windowColor = '#fefefe'
  export let fontColor = '#212121'

  export let borders = false
  export let maximizable = true
  export let resizable = true
  export let minHeight = 150
  export let minWidth = 220

  // stored
  export let x = 400
  export let y = 200
  export let width: CssUnit = 400
  export let height: CssUnit = 300
  export let maximized = false
  export let minimized = false

  // saving z-index when focus
  const zIndexId = zIndexStore.register(id)
  const edit = windowsStore.edit$(id)
  _resizable = resizable

  zIndexStore.listen(zIndexId, ({ zIndex: z }) => (zIndex = z))

  windowsStore.watch(id, changes => {
    minimized = changes.minimized
  })

  function minimize() {
    minimized = true
    edit({ minimized })
  }

  function maximize() {
    const dockHeight = (document.getElementById('dock')?.clientHeight ?? 0) + 20
    const menubarHeight = document.getElementById('menubar')?.clientHeight ?? 0
    const documentHeight = document.body.clientHeight

    if (maximizable) {
      maximized = true
      resizable = false
      maximizedHeight = documentHeight - dockHeight - menubarHeight
      maximizedBottom = dockHeight
    }
  }

  function compress() {
    if (maximized) {
      maximized = false
      resizable = _resizable
    }
  }

  function refresh(e) {
    move(e.movementX, e.movementY)
    resize(e.movementX, e.movementY)
  }

  function resize(dw: number, dh: number, force = false) {
    if (force || (!maximized && resizing)) {
      ;(width as number) += kw * dw
      ;(height as number) -= kh * dh

      // if resizing to top, makes the window smaller and increment its "Y" to stay at the same css-top
      move(kx * dw, ky * dh, true)

      if (width < minWidth) {
        width = minWidth
        move(-kx * dw, 0, true)
      }

      if (height < minHeight) {
        height = minHeight
        move(0, -ky * dh, true)
      }
    }
  }

  function move(dx: number, dy: number, force = false) {
    if (moving || force) {
      x += dx
      y -= dy
    }
  }

  function resize$(widthFactor = 0, heightFactor = 0, xFactor = 0, yFactor = 0) {
    return () => {
      focus()
      resizing = resizable
      kw = widthFactor
      kh = heightFactor
      kx = xFactor
      ky = yFactor
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

  function refineCssUnit(unit: CssUnit) {
    if (typeof unit === 'number' || /^\d+$/gi.test(unit)) {
      return `${unit}px`
    }

    return unit
  }
</script>

<svelte:window on:mouseup={reset} on:mousemove={refresh} />

<div
  id="window-{id}"
  class="window maximized-{maximized} minimized-{minimized}"
  style="
		--bottom: {refineCssUnit(y)};
		--left: {refineCssUnit(x)};
		--width: {refineCssUnit(width)};
		--height: {refineCssUnit(height)};
		--min-width: {refineCssUnit(minWidth)};
		--min-height: {refineCssUnit(minHeight)};
    --z-index: {zIndex};
    --window-color: {windowColor};
    --font-color: {fontColor};
    
    --maximized-height: {refineCssUnit(maximizedHeight)};
    --maximized-bottom: {refineCssUnit(maximizedBottom)};
  "
  on:click={focus}
  on:keyup={focus}
>
  <p class="window-tittle" on:mousedown={allowMove} on:click={focus} on:keyup={focus}>{title}</p>

  <div class="window-controls">
    <button class="window-control" title="minimize" on:click={minimize}>
      <Fa icon={faMinus} />
    </button>

    {#if maximizable}
      {#if maximized}
        <button class="window-control" title="compress" on:click={compress}>
          <Fa icon={faCompress} />
        </button>
      {:else}
        <button class="window-control" title="maximize" on:click={maximize}>
          <Fa icon={faExpand} />
        </button>
      {/if}
    {/if}

    <button class="window-control" title="close" on:click={windowsStore.remove$(id)}>
      <Fa icon={faXmark} />
    </button>
  </div>

  <div class="window-content {className} borders-{borders}"><slot /></div>

  <slot name="window-footer" class="window-footer">
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
  @window-color: var(--window-color);
  @font-color: var(--font-color);
  @time: 0.3s;

  // computed
  @b: @resizer-border-width;
  @b_2: -(@b / 2);

  .window {
    background: @window-color;
    border-radius: 3px;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
    color: @font-color;
    position: absolute;
    user-select: none;
    overflow: hidden;
    // transition: transform @time;
    z-index: var(--z-index);

    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr auto;
    grid-auto-rows: auto;

    animation: backInUp @time;

    &.maximized-false {
      bottom: var(--bottom);
      left: var(--left);
      width: var(--width);
      height: var(--height);
      min-width: var(--min-width);
      min-height: var(--min-height);
    }
    &.maximized-true {
      width: 100vw;
      height: var(--maximized-height);
      bottom: var(--maximized-bottom);
    }

    &.minimized-true {
      animation: backOutDown @time forwards;
    }

    &.minimized-true.maximized-false {
      left: var(--left);
    }

    &-tittle,
    &-controls,
    &-footer,
    &-content.true {
      padding: 1em;
    }

    &-content {
      grid-column: 1 / -1;
      overflow: auto;
    }

    &-control {
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      margin-left: 0.8em;
      color: @font-color;
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
