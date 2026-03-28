import type { RewriteInternalPackageImportsOptions } from './options'
import type { Codemod } from '@arachne/morph'
import { Project } from 'ts-morph'
import { resolveInternalImportTargets } from './resolve-targets'
import { rewriteInternalImports } from './rewrite-internal-imports'

export const rewriteInternalPackageImports: Codemod<
  RewriteInternalPackageImportsOptions
> = async ({ files, options }) => {
  const results: Array<{
    path: string
    sourceText: string
  }> = []

  for (const file of files) {
    const project = new Project({
      useInMemoryFileSystem: true,
    })

    project.createSourceFile(file.path, file.sourceText, {
      overwrite: true,
    })

    const rewrittenFiles = await rewriteInternalImports({
      files: [file],
      project,
      options: {
        targets: resolveInternalImportTargets({
          sourceFilePath: file.path,
          packages: options.packages,
        }),
      },
    })

    results.push(...rewrittenFiles)
  }

  return results
}
