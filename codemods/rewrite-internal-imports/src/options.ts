export type FileNameKind = 'match-export' | 'kebab-case'

export type InternalImportTarget = {
  barrelPath?: string
  sideEffectPath?: string
  defaultPath?: string
  namespacePath?: string
  namedPaths?: Record<string, string>
}

export type RewriteInternalImportsOptions = {
  targets: Record<string, InternalImportTarget>
}

export type FileNamesConfig = {
  lib?: FileNameKind
  hooks?: FileNameKind
  components?: FileNameKind
}

export type RewriteInternalPackageImportsOptions = {
  packages: Array<{
    packageName: string
    importPackageName?: string
    sourceDir: string
    destinationDir: string
    barrel: boolean
    fileNames: FileNamesConfig
  }>
}
