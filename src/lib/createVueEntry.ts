import jetpack from 'fs-jetpack'
import { join } from 'path'
import { CommandItem } from '../types'

export async function createVueEntry(cmd: CommandItem) {
  const cwd = process.cwd()

  const content = `
import { createApp } from 'vue'
import App from '../src/${cmd.name}.command.vue'
import './index.css'
createApp(App).mount('#root')
`

  const vueEntryFile = join(cwd, '.penx', `${cmd.name}.command.ts`)

  await jetpack.fileAsync(vueEntryFile, { mode: '777', content })

  return vueEntryFile
}
