import jetpack from 'fs-jetpack'
import { join } from 'path'
import { CommandItem } from '../types'

export async function createSvelteEntry(cmd: CommandItem) {
  const cwd = process.cwd()

  const content = `
import App from "../src/${cmd.name}.command.svelte";
import './index.css'

new App({
    target: document.getElementById('root'),
});

`

  const entryFile = join(cwd, '.penx', `${cmd.name}.command.js`)

  await jetpack.fileAsync(entryFile, { mode: '777', content })

  return entryFile
}
