import type { ImportDeclaration, SourceFile } from 'ts-morph'
import { Project, QuoteKind, ScriptKind, SyntaxKind } from 'ts-morph'

export type TransformCssModuleSourceResult = {
  didTransformCssModuleImport: boolean
  source: string
}

export function transformCssModuleSource(
  sourceText: string,
  cssModuleSpecifier: string,
  cssImportSpecifier: string,
  cssModuleExports: Record<string, string>,
): TransformCssModuleSourceResult {
  const project = new Project({
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
    },
    useInMemoryFileSystem: true,
  })

  const sourceFile = project.createSourceFile(
    '/tmp/maratus-component.tsx',
    sourceText,
    {
      overwrite: true,
      scriptKind: ScriptKind.TSX,
    },
  )

  const cssModuleImport = findCssModuleImport(sourceFile, cssModuleSpecifier)
  if (!cssModuleImport) {
    return {
      didTransformCssModuleImport: false,
      source: sourceText,
    }
  }

  const defaultImport = cssModuleImport.getDefaultImport()
  if (!defaultImport) {
    throw new Error(
      `Expected default CSS module import for ${cssModuleSpecifier}`,
    )
  }

  replaceCssModuleMemberAccesses(
    sourceFile,
    defaultImport.getText(),
    cssModuleExports,
  )
  cssModuleImport.setModuleSpecifier(cssImportSpecifier)
  cssModuleImport.removeDefaultImport()
  ensureBlankLineAfterImports(sourceFile)
  return {
    didTransformCssModuleImport: true,
    source: sourceFile.getFullText().trimStart(),
  }
}

function findCssModuleImport(
  sourceFile: SourceFile,
  cssModuleSpecifier: string,
) {
  return sourceFile
    .getImportDeclarations()
    .find(
      (declaration) =>
        declaration.getModuleSpecifierValue() === cssModuleSpecifier,
    )
}

function replaceCssModuleMemberAccesses(
  sourceFile: SourceFile,
  importedName: string,
  cssModuleExports: Record<string, string>,
): void {
  for (const access of sourceFile.getDescendantsOfKind(
    SyntaxKind.PropertyAccessExpression,
  )) {
    if (access.getExpression().getText() !== importedName) continue

    const exportName = access.getName()
    const compiledClassName = cssModuleExports[exportName]
    if (!compiledClassName) {
      throw new Error(`Missing CSS module export "${exportName}"`)
    }

    access.replaceWithText(JSON.stringify(compiledClassName))
  }
}

function ensureBlankLineAfterImports(sourceFile: SourceFile): void {
  const lastImport = getLastImportDeclaration(sourceFile)
  if (!lastImport) return

  const nextSibling = lastImport.getNextSibling()
  if (!nextSibling) return
  if (
    hasBlankLineBeforeNode(
      sourceFile,
      nextSibling.getFullStart(),
      nextSibling.getStart(true),
    )
  ) {
    return
  }

  nextSibling.replaceWithText(`\n${nextSibling.getText()}`)
}

function getLastImportDeclaration(
  sourceFile: SourceFile,
): ImportDeclaration | undefined {
  return sourceFile.getImportDeclarations().at(-1)
}

function hasBlankLineBeforeNode(
  sourceFile: SourceFile,
  fullStart: number,
  start: number,
): boolean {
  const leadingText = sourceFile.getFullText().slice(fullStart, start)
  return leadingText.includes('\n\n')
}
