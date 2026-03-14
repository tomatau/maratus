import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  writeCssFilesArtifacts,
  writeInlineCssVarsArtifacts,
} from './artifact-writer'
import { SRC_DIR, STYLES_FILENAME } from './config'
import { emitCss, emitInlineStyle } from './emit-style'
import { formatGeneratedFiles } from './formatter'
import {
  getComponentNamesWithStyles,
  componentSourceFileName,
  ensureComponentSourcePath,
} from './monorepo'
import { loadStyleSpec } from './style-loader'

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
    const stylesPath = join(
      componentsDir,
      componentName,
      SRC_DIR,
      STYLES_FILENAME,
    )
    const styleSpec = await loadStyleSpec(stylesPath)
    const componentSourcePath = ensureComponentSourcePath(
      componentsDir,
      componentName,
      componentSourceFileName(componentName),
    )
    const componentSource = await readFile(componentSourcePath, 'utf8')

    const css = emitCss(styleSpec)
    const inlineStyleLiteral = JSON.stringify(emitInlineStyle(styleSpec))

    generatedFiles.push(
      ...(await writeCssFilesArtifacts(
        componentName,
        componentSource,
        css,
        registryDir,
      )),
    )
    generatedFiles.push(
      await writeInlineCssVarsArtifacts(
        componentName,
        componentSource,
        inlineStyleLiteral,
        registryDir,
      ),
    )
  }

  formatGeneratedFiles(generatedFiles)
}
