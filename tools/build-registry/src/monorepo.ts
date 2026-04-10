import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { CSS_MODULE_EXT, SRC_DIR, TSX_EXT } from './config'

export async function getComponentNamesWithStyles(
  componentsDir: string,
): Promise<string[]> {
  const entries = await readdir(componentsDir, { withFileTypes: true })
  const names: string[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const stylesPath = join(
      componentsDir,
      entry.name,
      SRC_DIR,
      componentCssModuleFileName(entry.name),
    )
    if (existsSync(stylesPath)) names.push(entry.name)
  }
  return names
}

export function componentSourceFileName(componentName: string): string {
  const baseName = `${componentName[0]?.toUpperCase() ?? ''}${componentName.slice(1)}`
  return `${baseName}${TSX_EXT}`
}

export function componentCssModuleFileName(componentName: string): string {
  return `${componentName}${CSS_MODULE_EXT}`
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

export function ensureComponentCssModulePath(
  componentsDir: string,
  componentName: string,
): string {
  const path = join(
    componentsDir,
    componentName,
    SRC_DIR,
    componentCssModuleFileName(componentName),
  )
  if (!existsSync(path)) {
    throw new Error(`Missing component CSS module file: ${path}`)
  }
  return path
}
