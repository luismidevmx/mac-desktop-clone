import { writable, derived } from 'svelte/store'
import { findIndex, find, maxBy } from 'lodash-es'
import { createId } from '@paralleldrive/cuid2'

export interface IWindowApi<T = any> {
  id: string
  appName: AppName
  zIndex: number
  // x?: number
  // y?: number
  // width?: number
  // height?: number
  // expanded?: boolean
  minimized: boolean
  data?: T
  methods?: Record<string, Function>
}

export interface IWindowsData {
  appComponents: Record<AppName, any>
  instances: IWindowApi[]
}

export const appImports = {
  activityMonitor: { viteImport: () => import('../components/apps/ActivityMonitor.svelte') },
  calculator: { viteImport: () => import('../components/apps/Calculator.svelte') },
  chrome: { viteImport: () => import('../components/apps/Chrome.svelte') },
  notepad: { viteImport: () => import('../components/apps/Notepad.svelte') },
  terminal: { viteImport: () => import('../components/apps/Terminal.svelte') },
  tictactoe: { viteImport: () => import('../components/apps/TicTacToe.svelte') },
  vscode: { viteImport: () => import('../components/apps/VSCode.svelte') }
}

export type AppName = keyof typeof appImports

export function createWindowsStore() {
  const { subscribe, set, update } = writable<IWindowsData>({
    appComponents: {} as Record<AppName, any>,
    instances: []
  })

  async function open(appName: AppName) {
    if (!appImports[appName]) return

    const { default: component } = await appImports[appName].viteImport()

    update(prev => {
      if (!prev.appComponents[appName]) {
        prev.appComponents[appName] = component
      }

      if (prev.instances.length > 1000) {
        alert('Too many apps opened')
        return prev
      }

      const i = findIndex(prev.instances, { appName })
      if (i !== -1) {
        prev.instances[i].minimized = !prev.instances[i].minimized
        return prev
      }

      prev.instances.push({
        appName,
        id: createId(),
        zIndex: prev.instances.length + 10,
        minimized: false
      })

      return prev
    })
  }

  function close(id: string) {
    update(prev => {
      try {
        const i = findIndex(prev.instances, { id })

        console.log([...prev.instances])
        if (i === -1) return prev

        prev.instances[i] = {
          id,
          appName: 'closedApp' as AppName,
          zIndex: 0,
          minimized: false
        }

        // @ts-ignore -- appName may be 'closedApp'
        if (prev.instances.filter(app => app.appName !== 'closedApp').length === 0) {
          prev.instances = []
        }

        return prev
      } catch (error) {
        console.error(error)
        return prev
      }
    })
  }

  function focus(id: string) {
    update(prev => {
      const maxZIndexApp = maxBy(prev.instances, 'zIndex')
      const i = findIndex(prev.instances, { id })

      if (i === -1 || !maxZIndexApp || !maxZIndexApp?.zIndex || maxZIndexApp?.id === id) {
        return prev
      }

      prev.instances[i].zIndex = maxZIndexApp.zIndex + 1

      if (maxZIndexApp.zIndex > 100) {
        const upperZIndexes = prev.instances.map(app => app.zIndex).sort((a, b) => b - a)

        prev.instances = prev.instances.map(app => ({
          ...app,
          zIndex: 10 + findIndex(upperZIndexes, zIndex => zIndex === app.zIndex)
        }))
      }

      return prev
    })
  }

  const listen = (id: string, cb: (appInstance: IWindowApi) => void) =>
    subscribe(data => {
      const appInstance = find(data.instances, { id })
      if (appInstance) cb(appInstance)
    })

  const minimize = (id: string) => {
    update(prev => {
      const i = findIndex(prev.instances, { id })
      if (i === -1) return prev
      prev.instances[i].minimized = true
      return prev
    })
    return true
  }

  return {
    close,
    focus,
    listen,
    open,
    set,
    subscribe,
    update,
    minimize
  }
}

export const windowsStore = createWindowsStore()
export default windowsStore
