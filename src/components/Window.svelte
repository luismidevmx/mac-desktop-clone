<script lang="ts">
  import { createId } from '@paralleldrive/cuid2'

  // icons
  import Fa from 'svelte-fa'
  import { faXmark, faMinus, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons'

  // stores
  import apps from '../stores/windowsAPI'

  type CssUnit = number | string

  let {
    children,
    menubar = null,
    footer = null,
    extraControls = null,
    id = createId(),
    title = 'Program',
    class: className = '',
    windowColor = '#fefefe',
    fontColor = '#212121',
    borders = false,
    maximizable = true,
    resizable = true,
    minHeight = 150,
    minWidth = 220,
    x = $bindable(400),
    y = $bindable(200),
    width = $bindable(400),
    height = $bindable(300),
    maximized = $bindable(false),
    minimized = $bindable(false),
    onfocus = (_: FocusEvent) => {},
    onblur = (_: FocusEvent) => {}
  } = $props()

  const initialResizable = resizable

  // cursors
  let lastCursorX = $state(0)
  let lastCursorY = $state(0)

  // actions
  let moving = $state(false)
  let resizing = $state(false)
  let resizingDirection = $state('')

  // other
  let maximizedHeight = $state(0)
  let maximizedBottom = $state(0)
  let virtualWidth = $state(width)
  let virtualHeight = $state(height)
  let zIndex = $state(10)

  apps.listen(id, app => {
    zIndex = app.zIndex
    minimized = app.minimized ?? false
  })

  function minimize() {
    apps.minimize(id)
  }

  function maximize() {
    const dockHeight = (document.getElementById('dock')?.clientHeight ?? 0) + 20
    const menubarHeight = document.getElementById('menubar')?.clientHeight ?? 0
    const documentHeight = document.body.clientHeight

    if (maximizable) {
      maximized = true
      resizable = false
      maximizedHeight = documentHeight - dockHeight - menubarHeight - 16
      maximizedBottom = dockHeight + 4
    }
  }

  function compress() {
    if (maximized) {
      maximized = false
      resizable = initialResizable
    }
  }

  function refresh(e: MouseEvent) {
    const dx = e.clientX - lastCursorX
    const dy = e.clientY - lastCursorY

    if (moving) {
      move(dx, dy)
    }

    if (resizing) {
      resize(dx, dy, 0, 0)
    }

    lastCursorX = e.clientX
    lastCursorY = e.clientY
  }

  function resize(dw: number, dh: number, dx: number, dy: number) {
    if (resizingDirection.includes('right')) {
      virtualWidth += dw
    }

    if (resizingDirection.includes('top')) {
      virtualHeight -= dh
    }

    if (resizingDirection.includes('left')) {
      virtualWidth -= dw
    }

    if (resizingDirection.includes('bottom')) {
      virtualHeight += dh
    }

    if (virtualWidth >= minWidth) {
      width = virtualWidth

      if (resizingDirection.includes('left')) {
        x += dw
      }
    }

    if (virtualHeight >= minHeight) {
      height = virtualHeight

      if (resizingDirection.includes('top')) {
        y += dh
      }
    }
  }

  function move(dx: number, dy: number) {
    x += dx
    y += dy
  }

  function allowMove(e: MouseEvent) {
    focus()
    moving = true
    lastCursorX = e.clientX
    lastCursorY = e.clientY
  }

  function allowResize(e: MouseEvent) {
    focus()
    resizing = resizable
    lastCursorX = e.clientX
    lastCursorY = e.clientY
  }

  function Direction(direction: string) {
    return (e: MouseEvent) => {
      resizingDirection = direction
      allowResize(e)
    }
  }

  function focus() {
    apps.focus(id)
    onfocus()
  }

  function reset(e: MouseEvent) {
    moving = resizing = false
    lastCursorX = e.clientX
    lastCursorY = e.clientY
    virtualHeight = height
    virtualWidth = width
  }

  function refineCssUnit(unit: CssUnit) {
    if (typeof unit === 'number' || /^\d+$/gi.test(unit)) {
      return `${unit}px`
    }

    return unit
  }
</script>

<svelte:window onmouseup={reset} onmousemove={refresh} />

<div
  id="window-{id}"
  class="window maximized-{maximized} minimized-{minimized}"
  style="
		--top: {refineCssUnit(y)};
		--left: {refineCssUnit(x)};
		--width: {refineCssUnit(width)};
		--height: {refineCssUnit(height)};
    --z-index: {zIndex};
    --window-color: {windowColor};
    --font-color: {fontColor};
    --maximized-height: {refineCssUnit(maximizedHeight)};
    --maximized-bottom: {refineCssUnit(maximizedBottom)};
  "
  onclick={focus}
  onkeyup={focus}
  {onblur}
  role="dialog"
  aria-label="Ventana de aplicación"
  tabindex={zIndex}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="window-header" onmousedown={allowMove} onmouseup={reset}>
    <div class="window-controls" role="group" aria-roledescription="window controls">
      <button class="window-control window-control-close" title="close" onclick={() => apps.close(id)}>
        <Fa icon={faXmark} />
      </button>

      <button class="window-control window-control-minimize" title="minimize" onclick={minimize}>
        <Fa icon={faMinus} />
      </button>

      {#if maximizable}
        {#if maximized}
          <button class="window-control window-control-compress" title="compress" onclick={compress}>
            <Fa icon={faExpand} />
          </button>
        {:else}
          <button class="window-control window-control-maximize" title="maximize" onclick={maximize}>
            <Fa icon={faCompress} />
          </button>
        {/if}
      {/if}

      {#if extraControls}
        {@render extraControls?.()}
      {/if}
    </div>

    <p class="window-tittle">{title}</p>

    {#if menubar}
      <div class="window-menubar">
        {@render menubar?.()}
      </div>
    {/if}
  </div>

  <div class="window-content borders-{borders} {className}">
    {@render children?.()}
  </div>

  {#if footer}
    <div class="window-footer">
      {@render footer?.()}
      <!-- <slot name="window-footer" class="window-footer" /> -->
      <!-- {width}x{height} ({x},{y}) -->
    </div>
  {/if}

  <!-- resizers -->
  {#if resizable}
    <button class="resizer top" onmousedown={Direction('top')} aria-label="resize top"></button>
    <button class="resizer bottom" onmousedown={Direction('bottom')} aria-label="resize bottom"></button>
    <button class="resizer left" onmousedown={Direction('left')} aria-label="resize left"></button>
    <button class="resizer right" onmousedown={Direction('right')} aria-label="resize right"></button>

    <button class="resizer top-left" onmousedown={Direction('top left')} aria-label="resize top-left"></button>
    <button class="resizer top-right" onmousedown={Direction('top right')} aria-label="resize top-right"></button>
    <button class="resizer bottom-left" onmousedown={Direction('bottom left')} aria-label="resize bottom-left"></button>
    <button class="resizer bottom-right" onmousedown={Direction('bottom right')} aria-label="resize bottom-right"></button>
  {/if}
</div>

<style lang="less" global>
  // @gray-1: #e8e7ea;
  // @gray-2: #f3f0f3;
  // @controls-diameter: 10px;
  @resizer-border-width: 10px;
  @window-color: var(--window-color);
  @font-color: var(--font-color);
  @time: 0.2s;

  // computed
  @b: @resizer-border-width;
  @b_2: -(@b / 2);

  .window {
    --window-gap: 8px;

    background: @window-color;
    border-radius: 3px;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
    color: @font-color;
    position: absolute;
    user-select: none;
    overflow: hidden;
    z-index: var(--z-index);

    display: grid;
    grid-template-rows: auto 1fr;

    &.maximized-false {
      --dynamic-height: var(--height);
      --dynamic-bottom: var(--bottom);

      top: var(--top);
      left: var(--left);
      width: var(--width);
      height: var(--height);
      min-width: var(--min-width);
      min-height: var(--min-height);
    }
    &.maximized-true {
      --dynamic-height: var(--maximized-height);
      --dynamic-bottom: var(--maximized-bottom);

      width: 100vw;
      height: var(--maximized-height);
      bottom: var(--maximized-bottom);
    }
    &.minimized-true {
      transition: top @time;
      top: 200vh !important;
    }
    &.minimized-true.maximized-false {
      left: var(--left);
    }

    &-header {
      display: flex;
      flex-direction: column;
      padding: var(--window-gap);
      gap: calc(var(--window-gap) * 0.8);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: stretch;
    }

    &-controls {
      position: absolute;
      top: 0;
      left: 0;
      padding: var(--window-gap);
    }

    &-tittle {
      text-align: center;
    }

    &-content {
      --window-content-overflow: auto;
      overflow: var(--window-content-overflow);
      display: grid;
      grid-template-rows: 1fr;

      &.borders-true {
        padding: 0 var(--window-gap);
      }
    }

    &-control {
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      margin-right: 5px;
      // color: @font-color;
      color: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 16px;
      height: 16px;
      font-size: 0.4em;
      vertical-align: middle;
    }

    &-control-maximize,
    &-control-compress {
      background: #60c641;
    }

    &-control-minimize {
      background: #ebb53e;
    }

    &-control-close {
      background: #e45752;
    }

    &-footer {
      padding-top: 0.3em;
      text-align: right;
    }

    &-menubar {
      display: flex;
      gap: 8px;

      button,
      .menubar-option {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        font-size: 0.7em;
        color: @font-color;
        margin: 0;
        display: block;
      }
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
