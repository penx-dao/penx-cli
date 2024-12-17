import jetpack from 'fs-jetpack'
import { join } from 'path'

const content = `
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
`

export async function createStyleFile() {
  const cwd = process.cwd()
  const styeFile = join(cwd, '.penx', 'index.css')
  await jetpack.fileAsync(styeFile, { mode: '777', content })
}
