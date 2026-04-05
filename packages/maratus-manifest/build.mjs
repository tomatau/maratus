import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readRepoContext } from '@maratus/utils'

const { repoConfig, repoRoot } = await readRepoContext(import.meta.url)
const registryDir = join(repoRoot, repoConfig.workspaces.registry.path)
const distDir = new URL('./dist/', import.meta.url)

const components = {}
const registryEntries = await readdir(registryDir, {
  withFileTypes: true,
})

for (const entry of registryEntries) {
  if (!entry.isDirectory()) {
    continue
  }

  const componentName = entry.name
  const metaPath = join(registryDir, componentName, 'meta.json')
  try {
    await readFile(metaPath, 'utf8')
  } catch {
    continue
  }

  const packageJsonPath = join(registryDir, componentName, 'package.json')
  const packageSource = await readFile(packageJsonPath, 'utf8')
  const packageManifest = JSON.parse(packageSource)

  components[componentName] = {
    name: componentName,
    package: packageManifest.name,
    version: packageManifest.version,
  }
}

const output = {
  version: 1,
  components,
}

await mkdir(distDir, { recursive: true })
await writeFile(
  join(distDir.pathname, 'index.json'),
  `${JSON.stringify(output, null, 2)}\n`,
  'utf8',
)
