import { writable, derived } from 'svelte/store'
import { findIndex, findLast } from 'lodash-es'
import { generate as shortid } from 'shortid'

export interface IWindowData {
  x?: number
  y?: number
  width?: number
  height?: number
  expanded?: boolean
  minimized?: boolean
}

export interface IWindowBase {
  data: IWindowData
}

export interface IWindowInternal extends IWindowBase {
  id: string
  type: string
}

const data = { minimized: false }

function createWindowsStore() {
  const { subscribe, set, update } = writable<IWindowInternal[]>([])

  const lastInstanceOff = (type: string) =>
    derived({ subscribe, set, update }, $arr => {
      return findLast($arr, { type })
    })

  const push$ = (type: string) => {
    if (type) {
      return () => update(prev => [...prev, { type, id: shortid(), data }])
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
        prev[i].type = ''
      }

      return prev
    })

  const edit = (id: string, data: IWindowData) => transform(id, () => data)
  const editSafe = (id: string, data: IWindowData) => transform(id, prev => ({ ...data, ...prev }))

  return {
    edit$: (id: string) => (data: IWindowData) => edit(id, data),
    edit,
    editSafe$: (id: string) => (data: IWindowData) => editSafe(id, data),
    editSafe,
    lastInstanceOff,
    push$,
    remove$: (id: string) => () => remove(id),
    remove,
    set,
    subscribe,
    transform$: (id: string) => (transformItem: (data: IWindowData) => IWindowData) => transform(id, transformItem),
    update,
    watch
  }
}

const windowsStore = createWindowsStore()

export default windowsStore
