import os from 'os'
import { join } from 'path'

export const PORT = 31415

export const PENX_DIRNAME = '.penx'

export const CONFIG_FILE_NAME = 'config.json'

// TODO: use sqlite in future
export const DB_FILE_NAME = 'db.json'

export const penxDir = join(os.homedir(), PENX_DIRNAME)

export const configPath = join(os.homedir(), PENX_DIRNAME, CONFIG_FILE_NAME)

export const dbPath = join(os.homedir(), PENX_DIRNAME, DB_FILE_NAME)

export enum EventType {
  ADD_NODES = 'ADD_NODES',
}

export type AddTextEvent = {
  eventType: EventType.ADD_NODES
  data: string
}

/**
 * original:
 if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (!window.$__IS_ACTION_OPEN__) {
        window.parent.postMessage({ type: 'escape' }, '*')
      }
    }
  })
}
 
 */
export const escAction = `
"undefined"!=typeof document&&document.addEventListener("keydown",e=>{"Escape"!==e.key||window.$__IS_ACTION_OPEN__||window.parent.postMessage({type:"escape"},"*")});
`
