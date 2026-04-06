import type { FileNameKind, InternalImportTarget } from './options'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { rewriteSourcePath } from '@maratus/codemod-runner'
import { Project } from 'ts-morph'

export type ResolveInternalImportTargetsOptions = {
  sourceFilePath: string
  packages: Array<{
    packageName: string
    sourceDir: string
    destinationDir: string
    barrel: boolean
    fileNameKind: FileNameKind
  }>
}

export type ResolvedInternalImportTargets = Record<string, InternalImportTarget>

export function resolveInternalImportTargets(
  options: ResolveInternalImportTargetsOptions,
): ResolvedInternalImportTargets {
  const targets: ResolvedInternalImportTargets = {}

  for (const internalPackage of options.packages) {
    const packageName = `@maratus-lib/${internalPackage.packageName}`

    if (internalPackage.barrel) {
      targets[packageName] = {
        barrelPath: relativeModuleSpecifier(
          options.sourceFilePath,
          internalPackage.destinationDir,
        ),
      }
      continue
    }

    const indexSourceFilePath = resolvePackageIndexFile(
      internalPackage.sourceDir,
    )
    if (!indexSourceFilePath) {
      continue
    }

    const project = new Project({
      useInMemoryFileSystem: false,
    })
    const indexSourceFile = project.addSourceFileAtPath(indexSourceFilePath)
    const exportedDeclarations = indexSourceFile.getExportedDeclarations()
    const namedPaths: Record<string, string> = {}

    for (const [exportName, declarations] of exportedDeclarations) {
      const declaration = declarations[0]
      if (!declaration) {
        continue
      }

      const declarationFile = declaration.getSourceFile().getFilePath()
      const relativeSourcePath = path.relative(
        internalPackage.sourceDir,
        declarationFile,
      )
      const destinationFilePath = path.join(
        internalPackage.destinationDir,
        rewriteSourcePath(relativeSourcePath, internalPackage.fileNameKind),
      )

      namedPaths[exportName] = relativeModuleSpecifier(
        options.sourceFilePath,
        destinationFilePath,
      )
    }

    targets[packageName] = {
      namedPaths,
    }
  }

  return targets
}

function resolvePackageIndexFile(sourceDir: string) {
  for (const candidate of ['index.ts', 'index.tsx']) {
    const sourceFilePath = path.join(sourceDir, candidate)
    if (existsSync(sourceFilePath)) {
      return sourceFilePath
    }
  }

  return null
}

function relativeModuleSpecifier(fromFilePath: string, toPath: string) {
  const normalizedToPath = path.normalize(toPath)
  const relativePath = path.relative(
    path.dirname(fromFilePath),
    normalizedToPath,
  )
  const withoutExt = hasSourceExtension(normalizedToPath)
    ? relativePath.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, '')
    : relativePath
  let modulePath = withoutExt.split(path.sep).join('/')

  if (modulePath.endsWith('/.')) {
    modulePath = modulePath.slice(0, -2)
  }
  if (modulePath === '' || modulePath == '.') {
    return './'
  }

  if (modulePath.startsWith('.')) {
    return modulePath
  }

  return `./${modulePath}`
}

function hasSourceExtension(pathValue: string) {
  return ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(
    path.extname(pathValue),
  )
}
