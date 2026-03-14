import type { StyleSpec } from './config'
import { pathToFileURL } from 'node:url'

type StyleModule = { styleSpec?: StyleSpec }

export async function loadStyleSpec(stylesPath: string): Promise<StyleSpec> {
  const url = pathToFileURL(stylesPath)
  url.searchParams.set('t', `${Date.now()}`)
  const mod = (await import(url.href)) as StyleModule
  if (!mod.styleSpec) {
    throw new Error(`Missing styleSpec export in ${stylesPath}`)
  }
  return mod.styleSpec
}
