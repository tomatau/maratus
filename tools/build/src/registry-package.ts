import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readRepoContext } from '@maratus/utils'
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
  const existingRegistrySource = await readFile(
    existingRegistryPackagePath,
    'utf8',
  )
  const existingRegistryManifest = JSON.parse(
    existingRegistrySource,
  ) as SourcePackageManifest
  const dependencies = await resolveRegistryDependencyVersions(
    manifest.dependencies,
    import.meta.url,
  )

  return {
    name: `${repoConfig.workspaces.registry.scope}${componentName}`,
    version: existingRegistryManifest.version ?? manifest.version ?? '0.0.0',
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
  const libRoot = join(repoRoot, repoConfig.workspaces.lib.path)
  const libScopePrefix = repoConfig.workspaces.lib.scope

  const resolvedEntries = await Promise.all(
    Object.entries(dependencies).map(async ([packageName, version]) => {
      if (
        version !== 'workspace:*' ||
        !packageName.startsWith(libScopePrefix)
      ) {
        return [packageName, version] as const
      }

      const packageDirName = packageName.slice(libScopePrefix.length)
      const source = await readFile(
        join(libRoot, packageDirName, 'package.json'),
        'utf8',
      )
      const manifest = JSON.parse(source) as SourcePackageManifest

      return [packageName, manifest.version ?? '0.0.0'] as const
    }),
  )

  return Object.fromEntries(resolvedEntries)
}
