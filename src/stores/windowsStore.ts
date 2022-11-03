import { writable } from 'svelte/store'
import { random, findIndex } from 'lodash'

interface IWindow {
  borders?: boolean
  height?: number
  title?: string
  type?: string
  width?: number
  x?: number
  y?: number
}

interface IWindowStrict extends IWindow {
  id: number
  zIndex: 10 | 20
}

function createWindowsStore() {
  const { subscribe, set, update } = writable<IWindowStrict[]>([])

  const add = (w: IWindow) => {
    const id = random(1000)

    update(prev => [...prev, { ...w, zIndex: 10, id }])

    return id
  }

  const focus = (id: number) =>
    update(prev => {
      const i = findIndex(prev, { id })
      const j = findIndex(prev, { zIndex: 20 })

      if (i !== -1) prev[i].zIndex = 20
      if (j !== -1) prev[j].zIndex = 10

      return prev
    })

  return { subscribe, set, update, add, focus }
}

const windowsStore = createWindowsStore()

export default windowsStore
