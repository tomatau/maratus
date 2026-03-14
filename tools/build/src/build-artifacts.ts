import { readFile } from 'node:fs/promises'
import { writeCssFilesArtifacts } from './artifact-writer'
import { compileCssModule } from './compile-css-module'
import { formatGeneratedFiles } from './formatter'
import {
  getComponentNamesWithStyles,
  componentSourceFileName,
  componentCssModuleFileName,
  ensureComponentCssModulePath,
  ensureComponentSourcePath,
} from './monorepo'
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
    const componentSource = await readFile(componentSourcePath, 'utf8')
    const cssModule = await compileCssModule(cssModulePath)

    const componentSourceForCssFiles = transformCssModuleSource(
      componentSource,
      `./${componentCssModuleFileName(componentName)}`,
      cssModule.exports,
    )

    generatedFiles.push(
      ...(await writeCssFilesArtifacts(
        componentName,
        componentSourceForCssFiles,
        cssModule.css,
        registryDir,
      )),
    )
  }

  formatGeneratedFiles(generatedFiles)
}
