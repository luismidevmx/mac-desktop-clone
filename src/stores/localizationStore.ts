import { writable } from 'svelte/store'
import { findIndex } from 'lodash'

/**
 * TODO: rename this sh1ts
 */

interface IWindowBase {
  borders?: boolean
  height?: number
  minHeight?: number
  title?: string
  type?: string
  width?: number
  minWidth?: number
  x?: number
  y?: number
  instances?: number
}

export interface IWindowParams extends IWindowBase {
  type: string
}

export interface IWindowInternal extends IWindowBase {
  instances: number
}

function createWindowsStore() {
  const { subscribe, set, update } = writable<IWindowInternal[]>([])

  const useLoc = (inicialData: IWindowParams) => {
    let newData: IWindowBase

    update(locDataByAppList => {
      let i = findIndex(locDataByAppList, ['type', inicialData.type])

      if (i === -1) {
        locDataByAppList.push({
          ...inicialData,
          instances: 0
        })
        // the length is updated
        i = locDataByAppList.length - 1
      }
      locDataByAppList[i].instances++

      newData = { ...locDataByAppList[i] }

      return locDataByAppList
    })

    newData.x += newData.instances * 5
    newData.y -= newData.instances * 5

    // removing unknown attributes warning
    delete newData.type
    delete newData.instances

    return newData
  }

  const saveShift = ({ type, x, y }: IWindowBase) => {}

  return { subscribe, set, update, useLoc }
}

const windowsStore = createWindowsStore()

export default windowsStore
