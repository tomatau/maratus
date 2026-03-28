import type { RewriteInternalImportsOptions } from './options'
import type { Codemod } from '@arachne/morph'
import {
  buildInternalImportDeclarations,
  renderInternalImportDeclarations,
} from './declarations'

export const rewriteInternalImports: Codemod<RewriteInternalImportsOptions> = ({
  files,
  options,
  project,
}) => {
  for (const file of files) {
    const sourceFile = project.getSourceFile(file.path)
    if (!sourceFile) continue

    for (const importDeclaration of sourceFile.getImportDeclarations()) {
      const packageName = importDeclaration.getModuleSpecifierValue()
      const target = options.targets[packageName]
      if (!target) continue

      if (target.barrelPath) {
        importDeclaration.setModuleSpecifier(target.barrelPath)
        continue
      }

      const nextDeclarations = buildInternalImportDeclarations(
        importDeclaration,
        target,
      )

      if (nextDeclarations.length === 0) {
        continue
      }

      importDeclaration.replaceWithText(
        renderInternalImportDeclarations(nextDeclarations),
      )
    }
  }

  return files.map((file) => ({
    path: file.path,
    sourceText: project.getSourceFileOrThrow(file.path).getFullText(),
  }))
}
