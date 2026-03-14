import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { SRC_DIR, STYLES_FILENAME, TSX_EXT } from './config'

export async function getComponentNamesWithStyles(
  componentsDir: string,
): Promise<string[]> {
  const entries = await readdir(componentsDir, { withFileTypes: true })
  const names: string[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const stylesPath = join(componentsDir, entry.name, SRC_DIR, STYLES_FILENAME)
    if (existsSync(stylesPath)) names.push(entry.name)
  }
  return names
}

export function componentSourceFileName(componentName: string): string {
  const baseName = `${componentName[0]?.toUpperCase() ?? ''}${componentName.slice(1)}`
  return `${baseName}${TSX_EXT}`
}

export function ensureComponentSourcePath(
  componentsDir: string,
  componentName: string,
  fileName: string,
): string {
  const path = join(componentsDir, componentName, SRC_DIR, fileName)
  if (!existsSync(path)) {
    throw new Error(`Missing component source file: ${path}`)
  }
  return path
}
