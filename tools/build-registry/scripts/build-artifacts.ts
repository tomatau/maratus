import { join } from 'node:path'
import { buildArtifacts } from '../src'

const ROOT_DIR = join(import.meta.dir, '..', '..', '..')
const COMPONENTS_DIR = join(ROOT_DIR, 'components')
const REGISTRY_DIR = join(ROOT_DIR, 'registry')

await buildArtifacts({
  componentsDir: COMPONENTS_DIR,
  registryDir: REGISTRY_DIR,
})
