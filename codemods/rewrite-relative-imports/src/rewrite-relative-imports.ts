import type { FileNameKind, RewriteRelativeImportsOptions } from './options'
import type { Codemod } from '@maratus/codemod-runner'
import {
  dirname,
  moduleSpecifierBetween,
  normalizePath,
  rewriteSourcePath,
} from '@maratus/codemod-runner'
import { collectSourceGraph, resolveRelativeModuleTarget } from './source-graph'

const relativeImportPattern =
  /(from\s+['"](\.[^'"]+)['"]|import\s+['"](\.[^'"]+)['"])/g

export const rewriteRelativeImports: Codemod<RewriteRelativeImportsOptions> = ({
  files,
  options,
  project,
}) => {
  const sourceGraph = collectSourceGraph(options.files)
  const fileOptionsByPath = new Map(
    options.files.map((file) => [normalizePath(file.path), file]),
  )

  for (const file of files) {
    const fileOption = fileOptionsByPath.get(normalizePath(file.path))
    if (!fileOption) {
      continue
    }

    const rewritten = rewriteRelativeSourceImports(
      file.path,
      file.sourceText,
      sourceGraph,
      fileOption.fileNameKind,
      normalizePath(fileOption.rewrittenPath),
      fileOptionsByPath,
    )

    project.getSourceFileOrThrow(file.path).replaceWithText(rewritten)
  }

  return files.map((file) => ({
    path: file.path,
    sourceText: project.getSourceFileOrThrow(file.path).getFullText(),
  }))
}

function rewriteRelativeSourceImports(
  sourcePath: string,
  sourceText: string,
  sourceGraph: Map<string, string>,
  fileNameKind: FileNameKind,
  rewrittenSourcePath: string,
  fileOptionsByPath: Map<
    string,
    {
      path: string
      fileNameKind: FileNameKind
      rewrittenPath: string
    }
  >,
) {
  const normalizedSourcePath = normalizePath(sourcePath)
  const sourceDir = dirname(normalizedSourcePath)
  const rewrittenDir = dirname(rewrittenSourcePath)

  return sourceText.replaceAll(
    relativeImportPattern,
    (match, _full, fromSpecifier, sideEffectSpecifier) => {
      const specifier = fromSpecifier || sideEffectSpecifier
      if (!specifier) {
        return match
      }

      const targetOriginal = resolveRelativeModuleTarget(
        sourceDir,
        specifier,
        sourceGraph,
      )
      if (!targetOriginal) {
        return match
      }

      const targetOption = fileOptionsByPath.get(normalizePath(targetOriginal))
      const targetRewritten = targetOption
        ? normalizePath(targetOption.rewrittenPath)
        : rewriteSourcePath(targetOriginal, fileNameKind)
      const rewrittenSpecifier = moduleSpecifierBetween(
        rewrittenDir,
        targetRewritten,
      )

      return match.replace(specifier, rewrittenSpecifier)
    },
  )
}
