import jetpack from 'fs-jetpack'
import { join, sep } from 'path'
import { Manifest } from '../types/index'

export async function getManifest(): Promise<Manifest> {
  const name = process.cwd().split(sep).pop()
  const manifestPath = join(process.cwd(), 'manifest.json')
  const manifest = await jetpack.readAsync(manifestPath, 'json')
  if (manifest.name && name !== manifest.name) {
    throw new Error('Theme dir name should be same with name in manifest.json')
  }
  return {
    name,
    ...manifest,
  }
}
