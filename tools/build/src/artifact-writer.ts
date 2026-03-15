import type { ComponentMeta } from './component-meta'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { renderInlineCssVarsAdapter } from '@arachne/adapters'
import {
  ConfigStyle,
  CSS_EXT,
  INLINE_STYLE_VAR_NAME,
  REGISTRY_META_FILENAME,
  REGISTRY_PACKAGE_FILENAME,
  styleDirFor,
  TSX_EXT,
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

export async function writeInlineCssVarsArtifacts(
  componentName: string,
  componentSource: string,
  inlineStyleLiteral: string,
  registryDir: string,
): Promise<string> {
  const fileName = componentSourceFileName(componentName)
  const dir = join(
    registryDir,
    componentName,
    styleDirFor(ConfigStyle.InlineCssVars),
  )
  await mkdir(dir, { recursive: true })

  const adapter = await renderInlineCssVarsAdapter({
    componentName: fileName.replace(TSX_EXT, ''),
    sourceComponent: componentSource,
    inlineStyleVarName: INLINE_STYLE_VAR_NAME,
    inlineStyleLiteral,
  })
  const path = join(dir, fileName)
  await writeFile(path, adapter, 'utf8')
  return path
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
