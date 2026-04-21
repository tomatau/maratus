import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { CSS_EXT, CSS_MODULE_EXT, SRC_DIR, TSX_EXT } from './config'

export type ComponentInput = {
  name: string
  rootDir: string
  srcDir: string
  packageJsonPath: string
  componentSourcePath: string
  cssModulePath?: string
}

export async function collectComponentInputs(
  componentsDir: string,
): Promise<ComponentInput[]> {
  const entries = await readdir(componentsDir, { withFileTypes: true })
  const components: ComponentInput[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const name = entry.name
    const rootDir = join(componentsDir, name)
    const srcDir = join(rootDir, SRC_DIR)
    const packageJsonPath = join(rootDir, 'package.json')
    const componentSourcePath = join(srcDir, componentSourceFileName(name))
    const cssModulePath = join(srcDir, componentCssModuleFileName(name))

    if (!existsSync(srcDir)) {
      continue
    }
    if (!existsSync(packageJsonPath)) {
      continue
    }
    if (!existsSync(componentSourcePath)) {
      continue
    }

    components.push({
      name,
      rootDir,
      srcDir,
      packageJsonPath,
      componentSourcePath,
      cssModulePath: existsSync(cssModulePath) ? cssModulePath : undefined,
    })
  }

  return components
}

export function componentSourceFileName(componentName: string): string {
  const baseName = `${componentName[0]?.toUpperCase() ?? ''}${componentName.slice(1)}`
  return `${baseName}${TSX_EXT}`
}

export function componentCssModuleFileName(componentName: string): string {
  const baseName = componentSourceFileName(componentName).slice(
    0,
    -TSX_EXT.length,
  )
  return `${baseName}${CSS_MODULE_EXT}`
}

export function componentCssFileName(componentName: string): string {
  const baseName = componentSourceFileName(componentName).slice(
    0,
    -TSX_EXT.length,
  )
  return `${baseName}${CSS_EXT}`
}
