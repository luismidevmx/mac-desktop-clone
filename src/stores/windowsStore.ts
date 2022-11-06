import { writable } from 'svelte/store'
import { remove, findIndex } from 'lodash'
import { generate as shortid } from 'shortid'

export interface IWindowData {
  x?: number
  y?: number
  width?: number
  height?: number
  expanded?: boolean
}

export interface IWindowBase {
  data: IWindowData
}

export interface IWindowInternal extends IWindowBase {
  id: string
  type: string
}

function createWindowsStore() {
  const { subscribe, set, update } = writable<IWindowInternal[]>([])

  const push$ = (type: string) => {
    if (type) {
      return () => update(prev => [...prev, { type, id: shortid(), data: {} }])
    }

    // undefined types trig nothing
    return () => {}
  }

  const transform = (id: string, transformItem: (data: IWindowData) => IWindowData) => {
    let newData: IWindowData

    update(prev => {
      // find existent data id
      const i = findIndex(prev, { id })

      // if exists, modify this item
      if (i !== -1) {
        prev[i].data = { ...prev[i].data, ...transformItem(prev[i].data) }

        // save changes
        newData = prev[i].data
      }

      return prev
    })

    return newData
  }

  const watch = (id: string, onChange: (data: IWindowData) => void) => {
    subscribe(prev => {
      const i = findIndex(prev, { id })

      if (i !== -1) {
        onChange(prev[i].data)
      }
    })
  }

  const remove = (id: string) =>
    update(prev => {
      // find existent data id
      const i = findIndex(prev, { id })

      // if exists, modify this item
      if (i !== -1) {
        prev[i].data = {}
        prev[i].type = 'closedwindow'
      }

      return prev
    })

  const edit = (id: string, data: IWindowData) => transform(id, () => data)
  const editSafe = (id: string, data: IWindowData) => transform(id, prev => ({ ...data, ...prev }))

  const remove$ = (id: string) => () => remove(id)

  const edit$ = (id: string) => (data: IWindowData) => edit(id, data)
  const editSafe$ = (id: string) => (data: IWindowData) => editSafe(id, data)
  const transform$ = (id: string) => (transformItem: (data: IWindowData) => IWindowData) => transform(id, transformItem)

  return { subscribe, set, update, push$, remove, remove$, edit$, edit, editSafe$, editSafe, transform$, watch }
}

const windowsStore = createWindowsStore()

export default windowsStore
