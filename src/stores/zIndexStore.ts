import { writable } from 'svelte/store'
import { findIndex, sortBy } from 'lodash'
import { generate as shortid } from 'shortid'

interface IZIndex {
  id: string
  zIndex: number
}

function createZIndexStore() {
  const { subscribe, set, update } = writable<IZIndex[]>([])
  let max = 1000

  const register = (id: string) => {
    update(prev => [...prev, { zIndex: max, id: id.trim() ?? shortid() }])

    return id
  }

  const listen = (id: string, cb: Function) =>
    subscribe(items => {
      const i = findIndex(items, { id })
      if (i >= 0) cb(items[i])
    })

  const focus = (id: string) =>
    update(prev => {
      const i = findIndex(prev, { id })
      const j = findIndex(prev, { zIndex: max })

      if (i >= 0 && i !== j) {
        prev[i].zIndex = ++max

        // keeping max z-index between 1000 and 1999
        if (max >= 2000) {
          max = 1000
          // flatting z-indexes
          return sortBy(prev, 'zIndex').map((x, i) => ({ ...x, zIndex: 1000 + i }))
        }
      }

      return prev
    })

  return { subscribe, set, update, register, focus, listen }
}

const zIndexStore = createZIndexStore()

export default zIndexStore
