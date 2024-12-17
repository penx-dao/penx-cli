import jetpack from 'fs-jetpack'
import { join } from 'path'

export function getReadme(): string {
  try {
    try {
      const path = join(process.cwd(), 'readme.md')
      return jetpack.read(path, 'utf8') || ''
    } catch (error) {
      const path = join(process.cwd(), 'README.md')
      return jetpack.read(path, 'utf8') || ''
    }
  } catch (error) {
    return ''
  }
}
