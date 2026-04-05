import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
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
  version?: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

export async function buildRegistryPackageManifest(
  componentName: string,
  componentPackagePath: string,
  registryDir: string,
): Promise<RegistryPackageManifest> {
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

  return {
    name: `@maratus-registry/${componentName}`,
    version: existingRegistryManifest.version ?? manifest.version ?? '0.0.0',
    private: false,
    files: [
      styleDirFor(ConfigStyle.CssFiles),
      styleDirFor(ConfigStyle.CssModules),
      styleDirFor(ConfigStyle.TailwindCss),
      REGISTRY_META_FILENAME,
    ],
    type: 'module',
    dependencies: manifest.dependencies,
    peerDependencies: manifest.peerDependencies,
  }
}
