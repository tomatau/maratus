import { Project } from 'ts-morph'

export type CodemodFile = {
  path: string
  sourceText: string
}

export type CodemodResult = {
  path: string
  sourceText: string
}

export type CodemodContext<TOptions = unknown> = {
  options: TOptions
  project: Project
  files: CodemodFile[]
}

export type Codemod<TOptions = unknown> = (
  context: CodemodContext<TOptions>,
) => Promise<CodemodResult[]> | CodemodResult[]

export async function runCodemod<TOptions>(
  codemod: Codemod<TOptions>,
  files: CodemodFile[],
  options: TOptions,
): Promise<CodemodResult[]> {
  const project = new Project({
    useInMemoryFileSystem: true,
  })

  for (const file of files) {
    project.createSourceFile(file.path, file.sourceText, {
      overwrite: true,
    })
  }

  return await codemod({
    options,
    project,
    files,
  })
}
