import type { ComponentSourceFile } from './component-source-file'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { Project, ScriptKind } from 'ts-morph'
import { TS_EXT, TSX_EXT } from './config'

const TS_SOURCE_EXTENSIONS = [TS_EXT, TSX_EXT]

export async function collectComponentSourceGraph(
  entryPath: string,
  srcDir: string,
): Promise<ComponentSourceFile[]> {
  const seen = new Set<string>()
  const files: ComponentSourceFile[] = []

  // Visit the main entry first; add the barrel after if it exists.
  await visitComponentSourceFile(entryPath, srcDir, seen, files)
  await visitComponentIndexFile(srcDir, seen, files)
  return files
}

async function visitComponentIndexFile(
  srcDir: string,
  seen: Set<string>,
  files: ComponentSourceFile[],
): Promise<void> {
  for (const extension of TS_SOURCE_EXTENSIONS) {
    const indexPath = join(srcDir, `index${extension}`)
    if (!existsSync(indexPath)) {
      continue
    }

    await visitComponentSourceFile(indexPath, srcDir, seen, files)
    return
  }
}

async function visitComponentSourceFile(
  filePath: string,
  srcDir: string,
  seen: Set<string>,
  files: ComponentSourceFile[],
): Promise<void> {
  const normalizedPath = resolve(filePath)
  if (seen.has(normalizedPath)) return
  seen.add(normalizedPath)

  const source = await readFile(normalizedPath, 'utf8')
  files.push({
    fileName: relative(srcDir, normalizedPath),
    source,
  })

  const project = new Project({
    useInMemoryFileSystem: true,
  })
  const sourceFile = project.createSourceFile(normalizedPath, source, {
    overwrite: true,
    scriptKind:
      extname(normalizedPath) === '.tsx' ? ScriptKind.TSX : ScriptKind.TS,
  })

  for (const declaration of sourceFile.getImportDeclarations()) {
    const specifier = declaration.getModuleSpecifierValue()
    if (!specifier.startsWith('.')) continue

    const resolvedImportPath = resolveRelativeSourceImport(
      normalizedPath,
      specifier,
    )
    if (!resolvedImportPath) continue
    if (!resolvedImportPath.startsWith(resolve(srcDir))) continue

    await visitComponentSourceFile(resolvedImportPath, srcDir, seen, files)
  }
}

function resolveRelativeSourceImport(
  importerPath: string,
  specifier: string,
): string | undefined {
  const basePath = resolve(dirname(importerPath), specifier)

  for (const extension of TS_SOURCE_EXTENSIONS) {
    const filePath = `${basePath}${extension}`
    if (existsSync(filePath)) return filePath
  }

  for (const extension of TS_SOURCE_EXTENSIONS) {
    const indexPath = join(basePath, `index${extension}`)
    if (existsSync(indexPath)) return indexPath
  }

  return undefined
}
