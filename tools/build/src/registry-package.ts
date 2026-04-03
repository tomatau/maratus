import { readFile } from 'node:fs/promises'

export type RegistryPackageManifest = {
  name: string
  version: string
  private: boolean
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
): Promise<RegistryPackageManifest> {
  const source = await readFile(componentPackagePath, 'utf8')
  const manifest = JSON.parse(source) as SourcePackageManifest

  return {
    name: `@arachne-registry/${componentName}`,
    version: manifest.version ?? '0.0.0',
    private: false,
    type: 'module',
    dependencies: manifest.dependencies,
    peerDependencies: manifest.peerDependencies,
  }
}
