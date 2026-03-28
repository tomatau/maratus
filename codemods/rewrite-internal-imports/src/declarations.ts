import type { InternalImportTarget } from './index'
import type { ImportDeclaration } from 'ts-morph'

export type InternalImportDeclaration = {
  moduleSpecifier: string
  defaultImport?: string
  namespaceImport?: string
  namedImports?: string[]
}

export function buildInternalImportDeclarations(
  importDeclaration: ImportDeclaration,
  target: InternalImportTarget,
) {
  const namedImports = importDeclaration.getNamedImports()
  const namedImportsByPath = new Map<string, string[]>()

  for (const namedImport of namedImports) {
    const importName = namedImport.getName()
    const modulePath = target.namedPaths?.[importName]

    if (!modulePath) {
      continue
    }

    const existing = namedImportsByPath.get(modulePath) ?? []
    existing.push(namedImport.getText())
    namedImportsByPath.set(modulePath, existing)
  }

  const nextDeclarations: InternalImportDeclaration[] = []

  const defaultImport = importDeclaration.getDefaultImport()?.getText()
  if (defaultImport && target.defaultPath) {
    nextDeclarations.push({
      moduleSpecifier: target.defaultPath,
      defaultImport,
    })
  }

  const namespaceImport = importDeclaration.getNamespaceImport()?.getText()
  if (namespaceImport && target.namespacePath) {
    nextDeclarations.push({
      moduleSpecifier: target.namespacePath,
      namespaceImport,
    })
  }

  for (const [moduleSpecifier, groupedNamedImports] of namedImportsByPath) {
    nextDeclarations.push({
      moduleSpecifier,
      namedImports: groupedNamedImports,
    })
  }

  if (
    importDeclaration.getImportClause() === undefined &&
    target.sideEffectPath
  ) {
    nextDeclarations.push({
      moduleSpecifier: target.sideEffectPath,
    })
  }

  return nextDeclarations
}

export function renderInternalImportDeclarations(
  declarations: InternalImportDeclaration[],
) {
  return declarations
    .map((declaration) => {
      if (
        declaration.defaultImport &&
        declaration.namedImports &&
        declaration.namedImports.length > 0
      ) {
        return `import ${declaration.defaultImport}, { ${declaration.namedImports.join(', ')} } from '${declaration.moduleSpecifier}'`
      }

      if (declaration.namespaceImport) {
        return `import * as ${declaration.namespaceImport} from '${declaration.moduleSpecifier}'`
      }

      if (declaration.defaultImport) {
        return `import ${declaration.defaultImport} from '${declaration.moduleSpecifier}'`
      }

      if (declaration.namedImports && declaration.namedImports.length > 0) {
        return `import { ${declaration.namedImports.join(', ')} } from '${declaration.moduleSpecifier}'`
      }

      return `import '${declaration.moduleSpecifier}'`
    })
    .join('\n')
}
