import { readFile } from 'node:fs/promises'

export type RegistryPackageManifest = {
  name: string
  version: string
  private: boolean
  type: 'module'
}

type SourcePackageManifest = {
  version?: string
}

export async function buildRegistryPackageManifest(
  componentName: string,
  componentPackagePath: string,
): Promise<RegistryPackageManifest> {
  const source = await readFile(componentPackagePath, 'utf8')
  const manifest = JSON.parse(source) as SourcePackageManifest

  return {
    name: `@arachne/${componentName}`,
    version: manifest.version ?? '0.0.0',
    private: true,
    type: 'module',
  }
}
