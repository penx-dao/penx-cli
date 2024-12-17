import jetpack from 'fs-jetpack'
import { join, sep } from 'path'
import { Manifest } from '../types/index'

export async function getManifest(): Promise<Manifest> {
  const name = process.cwd().split(sep).pop()
  const manifestPath = join(process.cwd(), 'manifest.json')
  const manifest = await jetpack.readAsync(manifestPath, 'json')
  return {
    name,
    ...manifest,
  }
}
