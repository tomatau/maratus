import { join } from 'node:path'
import { readRepoContext } from '@maratus/utils'
import { cleanArtifacts } from '../src'

const { repoConfig, repoRoot } = await readRepoContext(import.meta.url)
const REGISTRY_DIR = join(repoRoot, repoConfig.workspaces.registry.path)

await cleanArtifacts({
  registryDir: REGISTRY_DIR,
})
