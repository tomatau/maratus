import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

export function formatDeclarations(declarations: Record<string, string>) {
  return Object.entries(declarations)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')
}

export function toCamelCase(name: string) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

type RepoConfig = {
  workspaces: {
    components: WorkspaceConfig
    registry: WorkspaceConfig
    lib: WorkspaceConfig
    codemods: WorkspaceConfig
    packages: WorkspaceConfig
  }
}

type WorkspaceConfig = {
  path: string
  scope: string
  description: string
  artifactTypes: string[]
  published: boolean
  consumption: 'direct' | 'indirect' | 'none'
}

export type RepoContext = {
  repoRoot: string
  repoConfig: RepoConfig
}

export async function readRepoContext(
  fromFileUrl: string,
): Promise<RepoContext> {
  let currentDir = dirname(fileURLToPath(fromFileUrl))

  while (true) {
    const repoConfigPath = join(currentDir, 'repo.yml')

    try {
      const source = await readFile(repoConfigPath, 'utf8')
      return {
        repoRoot: currentDir,
        repoConfig: YAML.parse(source) as RepoConfig,
      }
    } catch (error) {
      const parentDir = dirname(currentDir)
      if (parentDir === currentDir) {
        throw error
      }
      currentDir = parentDir
    }
  }
}
