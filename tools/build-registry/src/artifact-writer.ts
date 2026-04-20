import type { ComponentMeta } from './component-meta'
import type { ComponentSourceFile } from './component-source-file'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import {
  ConfigStyle,
  REGISTRY_META_FILENAME,
  REGISTRY_PACKAGE_FILENAME,
  styleDirFor,
} from './config'
import { wrapInLayer } from './css-format'
import { componentCssFileName, componentCssModuleFileName } from './monorepo'

export async function writeCssFilesArtifacts(
  componentName: string,
  componentSources: ComponentSourceFile[],
  css: string,
  registryDir: string,
): Promise<string[]> {
  const dir = join(
    registryDir,
    componentName,
    styleDirFor(ConfigStyle.CssFiles),
  )
  await mkdir(dir, { recursive: true })

  const writtenPaths: string[] = []

  for (const { fileName, source } of componentSources) {
    const filePath = join(dir, fileName)
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, source, 'utf8')
    writtenPaths.push(filePath)
  }

  const cssPath = join(dir, componentCssFileName(componentName))
  await writeFile(cssPath, wrapInLayer('components', css), 'utf8')
  return [...writtenPaths, cssPath]
}

export async function writeTailwindCssArtifacts(
  componentName: string,
  componentSources: ComponentSourceFile[],
  css: string,
  registryDir: string,
): Promise<string[]> {
  const dir = join(
    registryDir,
    componentName,
    styleDirFor(ConfigStyle.TailwindCss),
  )
  await mkdir(dir, { recursive: true })

  const writtenPaths: string[] = []

  for (const { fileName, source } of componentSources) {
    const filePath = join(dir, fileName)
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, source, 'utf8')
    writtenPaths.push(filePath)
  }

  const cssPath = join(dir, componentCssFileName(componentName))
  await writeFile(cssPath, css, 'utf8')
  return [...writtenPaths, cssPath]
}

export async function writeCssModulesArtifacts(
  componentName: string,
  componentSources: ComponentSourceFile[],
  cssModuleSource: string,
  registryDir: string,
): Promise<string[]> {
  const dir = join(
    registryDir,
    componentName,
    styleDirFor(ConfigStyle.CssModules),
  )
  await mkdir(dir, { recursive: true })

  const writtenPaths: string[] = []

  for (const { fileName, source } of componentSources) {
    const filePath = join(dir, fileName)
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, source, 'utf8')
    writtenPaths.push(filePath)
  }

  const cssModulePath = join(dir, componentCssModuleFileName(componentName))
  await writeFile(cssModulePath, cssModuleSource, 'utf8')
  return [...writtenPaths, cssModulePath]
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
