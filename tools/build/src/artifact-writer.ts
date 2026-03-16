import type { ComponentMeta } from './component-meta'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  ConfigStyle,
  CSS_EXT,
  REGISTRY_META_FILENAME,
  REGISTRY_PACKAGE_FILENAME,
  styleDirFor,
} from './config'
import { componentSourceFileName } from './monorepo'

export async function writeCssFilesArtifacts(
  componentName: string,
  componentSource: string,
  css: string,
  registryDir: string,
): Promise<string[]> {
  const fileName = componentSourceFileName(componentName)
  const dir = join(
    registryDir,
    componentName,
    styleDirFor(ConfigStyle.CssFiles),
  )
  await mkdir(dir, { recursive: true })

  const wrappedPath = join(dir, fileName)
  await writeFile(
    wrappedPath,
    `import "./${componentName}${CSS_EXT}"\n\n${componentSource}`,
    'utf8',
  )
  const cssPath = join(dir, `${componentName}${CSS_EXT}`)
  await writeFile(cssPath, css, 'utf8')
  return [wrappedPath, cssPath]
}

export async function writeTailwindCssArtifacts(
  componentName: string,
  componentSource: string,
  css: string,
  registryDir: string,
): Promise<string[]> {
  const fileName = componentSourceFileName(componentName)
  const dir = join(
    registryDir,
    componentName,
    styleDirFor(ConfigStyle.TailwindCss),
  )
  await mkdir(dir, { recursive: true })

  const wrappedPath = join(dir, fileName)
  await writeFile(
    wrappedPath,
    `import "./${componentName}${CSS_EXT}"\n\n${componentSource}`,
    'utf8',
  )
  const cssPath = join(dir, `${componentName}${CSS_EXT}`)
  await writeFile(cssPath, css, 'utf8')
  return [wrappedPath, cssPath]
}

export async function writeRegistryComponentFiles(
  componentName: string,
  meta: ComponentMeta,
  packageManifest: object,
  registryDir: string,
): Promise<string[]> {
  const dir = join(registryDir, componentName)
  await mkdir(dir, { recursive: true })

  const metaPath = join(dir, REGISTRY_META_FILENAME)
  const packagePath = join(dir, REGISTRY_PACKAGE_FILENAME)

  await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8')
  await writeFile(
    packagePath,
    `${JSON.stringify(packageManifest, null, 2)}\n`,
    'utf8',
  )

  return [metaPath, packagePath]
}
