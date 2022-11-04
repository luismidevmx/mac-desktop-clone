import { writable } from 'svelte/store'
import { remove, findIndex } from 'lodash'
import { generate as shortid } from 'shortid'

export interface IWindowBase {
  type: string
  data: any
}

export interface IWindowInternal extends IWindowBase {
  id: string
}

function createWindowsStore() {
  const { subscribe, set, update } = writable<IWindowInternal[]>([])

  const push$ = (type: string, data: any = {}) => {
    if (type) {
      return () => update(prev => [...prev, { type, data, id: shortid() }])
    }

    return () => {}
  }

  const edit$ =
    (id: string) =>
    (data: any = {}) => {
      let newData: any

      update(prev => {
        const i = findIndex(prev, { id })

        if (i !== -1) {
          prev[i].data = { ...prev[i].data, ...data }
        }
        newData = prev[i].data

        return prev
      })

      return newData
    }

  const delete$ = (id: string) => () =>
    update(prev => {
      remove(prev, { id })
      return prev
    })

  return { subscribe, set, update, push$, delete$, edit$ }
}

const windowsStore = createWindowsStore()

export default windowsStore
