import fs from 'fs'
import jetpack from 'fs-jetpack'
import { resolve } from 'path'

export async function iconToString(icon: any) {
  if (!icon) return ''

  try {
    const cwd = process.cwd()
    const iconPath = resolve(cwd, 'assets', icon)
    if (icon.endsWith('.svg')) {
      return jetpack.read(iconPath, 'utf8') || ''
    } else {
      return fs.readFileSync(iconPath).toString('base64') || ''
    }
  } catch (error) {
    return ''
  }
}
