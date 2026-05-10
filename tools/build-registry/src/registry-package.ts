import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readRepoContext, RepoContext } from '@maratus/utils'
import { ConfigStyle, REGISTRY_META_FILENAME, styleDirFor } from './config'

export type RegistryPackageManifest = {
  name: string
  version: string
  private: boolean
  files: string[]
  type: 'module'
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

type SourcePackageManifest = {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

export async function buildRegistryPackageManifest(
  componentName: string,
  componentPackagePath: string,
  registryDir: string,
): Promise<RegistryPackageManifest> {
  const { repoConfig } = await readRepoContext(import.meta.url)
  const source = await readFile(componentPackagePath, 'utf8')
  const manifest = JSON.parse(source) as SourcePackageManifest
  const existingRegistryPackagePath = join(
    registryDir,
    componentName,
    'package.json',
  )
  const existingRegistryManifest = await readOptionalPackageManifest(
    existingRegistryPackagePath,
  )
  const dependencies = await resolveRegistryDependencyVersions(
    manifest.dependencies,
    import.meta.url,
  )

  return {
    name: `${repoConfig.workspaces.registry.scope}${componentName}`,
    version: existingRegistryManifest?.version ?? manifest.version ?? '0.0.0',
    private: false,
    files: [
      styleDirFor(ConfigStyle.CssFiles),
      styleDirFor(ConfigStyle.CssModules),
      styleDirFor(ConfigStyle.TailwindCss),
      REGISTRY_META_FILENAME,
    ],
    type: 'module',
    dependencies,
    peerDependencies: manifest.peerDependencies,
  }
}

async function resolveRegistryDependencyVersions(
  dependencies: Record<string, string> | undefined,
  fromFileUrl: string,
): Promise<Record<string, string> | undefined> {
  if (!dependencies) {
    return undefined
  }

  const { repoRoot, repoConfig } = await readRepoContext(fromFileUrl)

  const resolvedEntries = await Promise.all(
    Object.entries(dependencies).map(async ([packageName, version]) => {
      if (version !== 'workspace:*') {
        return [packageName, version] as const
      }

      if (packageName.startsWith(repoConfig.workspaces.components.scope)) {
        return resolveComponentEntries(packageName, { repoRoot, repoConfig })
      }

      if (packageName.startsWith(repoConfig.workspaces.lib.scope)) {
        return resolveLibEntries(packageName, { repoRoot, repoConfig })
      }

      return [packageName, version] as const
    }),
  )

  return Object.fromEntries(resolvedEntries)
}

async function readOptionalPackageManifest(
  packagePath: string,
): Promise<SourcePackageManifest | undefined> {
  try {
    const source = await readFile(packagePath, 'utf8')
    return JSON.parse(source) as SourcePackageManifest
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined
    }

    throw error
  }
}

async function resolveComponentEntries(
  packageName: string,
  { repoRoot, repoConfig }: RepoContext,
) {
  const componentScopePrefix = repoConfig.workspaces.components.scope
  const registryScopePrefix = repoConfig.workspaces.registry.scope
  const registryRoot = join(repoRoot, repoConfig.workspaces.registry.path)
  const componentsRoot = join(repoRoot, repoConfig.workspaces.components.path)
  const packageDirName = packageName.slice(componentScopePrefix.length)

  const registryManifest = await readOptionalPackageManifest(
    join(registryRoot, packageDirName, 'package.json'),
  )
  const source = await readFile(
    join(componentsRoot, packageDirName, 'package.json'),
    'utf8',
  )
  const manifest = JSON.parse(source) as SourcePackageManifest

  return [
    `${registryScopePrefix}${packageDirName}`,
    registryManifest?.version ?? manifest.version ?? '0.0.0',
  ] as const
}

async function resolveLibEntries(
  packageName: string,
  { repoRoot, repoConfig }: RepoContext,
) {
  const libScopePrefix = repoConfig.workspaces.lib.scope
  const libRoot = join(repoRoot, repoConfig.workspaces.lib.path)
  const packageDirName = packageName.slice(libScopePrefix.length)
  const source = await readFile(
    join(libRoot, packageDirName, 'package.json'),
    'utf8',
  )
  const manifest = JSON.parse(source) as SourcePackageManifest

  return [packageName, manifest.version ?? '0.0.0'] as const
}
