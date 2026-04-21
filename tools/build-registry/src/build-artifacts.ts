import { readFile } from 'node:fs/promises'
import { styleText } from 'node:util'
import {
  writeCssFilesArtifacts,
  writeCssModulesArtifacts,
  writeRegistryComponentFiles,
  writeTailwindCssArtifacts,
} from './artifact-writer'
import { compileCssModule } from './compile-css-module'
import { emptyComponentMeta, extractComponentMeta } from './component-meta'
import { collectComponentSourceGraph } from './component-source-graph'
import { emitTailwindCssWithLightning } from './emit-tailwind-css'
import { formatGeneratedFiles } from './formatter'
import {
  collectComponentInputs,
  componentCssFileName,
  componentCssModuleFileName,
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

  const componentInputs = await collectComponentInputs(componentsDir)
  const generatedFiles: string[] = []

  for (const componentInput of componentInputs) {
    const { name: componentName } = componentInput

    console.log(
      `${styleText('cyan', 'build-registry')} ${styleText('bold', componentName)}`,
    )
    if (!componentInput.cssModulePath) {
      console.log(
        `${styleText('yellow', '  no CSS module file')} skipping CSS artefacts`,
      )
    }

    const packageManifest = await buildRegistryPackageManifest(
      componentName,
      componentInput.packageJsonPath,
      registryDir,
    )
    const componentSourceGraph = await collectComponentSourceGraph(
      componentInput.componentSourcePath,
      componentInput.srcDir,
    )

    const cssModuleSource = componentInput.cssModulePath
      ? await readFile(componentInput.cssModulePath, 'utf8')
      : undefined
    const cssModule = componentInput.cssModulePath
      ? await compileCssModule(componentInput.cssModulePath)
      : undefined
    const componentMeta = componentInput.cssModulePath
      ? await extractComponentMeta(componentInput.cssModulePath)
      : emptyComponentMeta()
    const componentSourcesForCssFiles = cssModule
      ? componentSourceGraph.map(({ fileName, source }) => ({
          fileName,
          source: transformCssModuleSource(
            source,
            `./${componentCssModuleFileName(componentName)}`,
            `./${componentCssFileName(componentName)}`,
            cssModule.exports,
          ).source,
        }))
      : componentSourceGraph

    generatedFiles.push(
      ...(await writeCssModulesArtifacts(
        componentName,
        componentSourceGraph,
        cssModuleSource,
        registryDir,
      )),
    )
    generatedFiles.push(
      ...(await writeCssFilesArtifacts(
        componentName,
        componentSourcesForCssFiles,
        cssModule?.css,
        registryDir,
      )),
    )
    generatedFiles.push(
      ...(await writeTailwindCssArtifacts(
        componentName,
        componentSourcesForCssFiles,
        cssModule ? emitTailwindCssWithLightning(cssModule.css) : undefined,
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
