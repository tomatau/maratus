export type FileNameKind = 'match-export' | 'kebab-case'

export type RewriteRelativeImportsOptions = {
  files: Array<{
    path: string
    fileNameKind: FileNameKind
    rewrittenPath: string
  }>
}
