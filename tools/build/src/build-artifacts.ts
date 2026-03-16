import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  writeCssFilesArtifacts,
  writeCssModulesArtifacts,
  writeRegistryComponentFiles,
  writeTailwindCssArtifacts,
} from './artifact-writer'
import { compileCssModule } from './compile-css-module'
import { extractComponentMeta } from './component-meta'
import { emitTailwindCssWithLightning } from './emit-tailwind-css'
import { formatGeneratedFiles } from './formatter'
import {
  getComponentNamesWithStyles,
  componentSourceFileName,
  componentCssModuleFileName,
  ensureComponentCssModulePath,
  ensureComponentSourcePath,
} from './monorepo'
import { buildRegistryPackageManifest } from './registry-package'
import { transformCssModuleSource } from './transform-css-module-source'

export type BuildArtifactsOptions = {
  componentsDir: string
  registryDir: string
}

export async function buildArtifacts(
  options: BuildArtifactsOptions,
): Promise<void> {
  const { componentsDir, registryDir } = options

  const componentNames = await getComponentNamesWithStyles(componentsDir)
  const generatedFiles: string[] = []

  for (const componentName of componentNames) {
    const componentSourcePath = ensureComponentSourcePath(
      componentsDir,
      componentName,
      componentSourceFileName(componentName),
    )
    const cssModulePath = ensureComponentCssModulePath(
      componentsDir,
      componentName,
    )
    const componentPackagePath = join(
      componentsDir,
      componentName,
      'package.json',
    )
    const componentSource = await readFile(componentSourcePath, 'utf8')
    const cssModuleSource = await readFile(cssModulePath, 'utf8')
    const cssModule = await compileCssModule(cssModulePath)
    const componentMeta = await extractComponentMeta(cssModulePath)
    const packageManifest = await buildRegistryPackageManifest(
      componentName,
      componentPackagePath,
    )

    const componentSourceForCssFiles = transformCssModuleSource(
      componentSource,
      `./${componentCssModuleFileName(componentName)}`,
      cssModule.exports,
    )

    generatedFiles.push(
      ...(await writeCssModulesArtifacts(
        componentName,
        componentSource,
        cssModuleSource,
        registryDir,
      )),
    )
    generatedFiles.push(
      ...(await writeCssFilesArtifacts(
        componentName,
        componentSourceForCssFiles,
        cssModule.css,
        registryDir,
      )),
    )
    generatedFiles.push(
      ...(await writeTailwindCssArtifacts(
        componentName,
        componentSourceForCssFiles,
        emitTailwindCssWithLightning(cssModule.css),
        registryDir,
      )),
    )
    generatedFiles.push(
      ...(await writeRegistryComponentFiles(
        componentName,
        componentMeta,
        packageManifest,
        registryDir,
      )),
    )
  }

  formatGeneratedFiles(generatedFiles)
}
