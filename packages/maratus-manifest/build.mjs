import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readRepoContext } from '@maratus/utils'

/**
 * @typedef {{
 *   name: string
 *   version: string
 * }} PackageManifest
 */

/**
 * @typedef {{
 *   sourceType: 'registry-component'
 * }} RegistryComponentMeta
 */

/**
 * @typedef {{
 *   sourceType: 'codemod'
 *   codemodOptionsCategory: string
 *   exportName: string
 * }} CodemodMeta
 */

const { repoConfig, repoRoot } = await readRepoContext(import.meta.url)
const registryDir = join(repoRoot, repoConfig.workspaces.registry.path)
const codemodsDir = join(repoRoot, repoConfig.workspaces.codemods.path)
const distDir = new URL('./dist/', import.meta.url)

const components = await collectManifestEntries(
  registryDir,
  parseRegistryComponentMeta,
  (name, _meta, packageManifest) => ({
    [name]: {
      name,
      package: packageManifest.name,
      version: packageManifest.version,
    },
  }),
)

const codemods = await collectManifestEntries(
  codemodsDir,
  parseCodemodMeta,
  (name, meta, packageManifest) => ({
    [name]: {
      category: meta.codemodOptionsCategory,
      exportName: meta.exportName,
      package: packageManifest.name,
      version: packageManifest.version,
    },
  }),
)

const output = {
  version: 1,
  components,
  codemods,
}

await mkdir(distDir, { recursive: true })
await writeFile(
  join(distDir.pathname, 'index.json'),
  `${JSON.stringify(output, null, 2)}\n`,
  'utf8',
)

/**
 * @template TMeta
 * @param {string} workspaceDir
 * @param {(meta: unknown) => TMeta} parseMeta
 * @param {(name: string, meta: TMeta, packageManifest: PackageManifest) => Record<string, unknown>} mapEntry
 */
async function collectManifestEntries(workspaceDir, parseMeta, mapEntry) {
  const entries = await readdir(workspaceDir, {
    withFileTypes: true,
  })
  const collected = {}

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const entryName = entry.name
    const metaPath = join(workspaceDir, entryName, 'meta.json')
    const metaSource = await readFile(metaPath, 'utf8').catch(() => null)
    if (!metaSource) {
      continue
    }

    const meta = parseMeta(JSON.parse(metaSource))

    const packageJsonPath = join(workspaceDir, entryName, 'package.json')
    const packageSource = await readFile(packageJsonPath, 'utf8')
    /** @type {PackageManifest} */
    const packageManifest = JSON.parse(packageSource)

    Object.assign(collected, mapEntry(entryName, meta, packageManifest))
  }

  return collected
}

/**
 * @param {unknown} meta
 * @returns {RegistryComponentMeta}
 */
function parseRegistryComponentMeta(meta) {
  if (
    !meta ||
    typeof meta !== 'object' ||
    meta.sourceType !== 'registry-component'
  ) {
    throw new Error(`expected registry-component meta, got ${meta.sourceType}`)
  }

  return meta
}

/**
 * @param {unknown} meta
 * @returns {CodemodMeta}
 */
function parseCodemodMeta(meta) {
  if (!meta || typeof meta !== 'object' || meta.sourceType !== 'codemod') {
    throw new Error(`expected codemod meta, got ${meta.sourceType}`)
  }
  if (
    typeof meta.codemodOptionsCategory !== 'string' ||
    meta.codemodOptionsCategory === ''
  ) {
    throw new Error('expected codemodOptionsCategory in codemod meta')
  }
  if (typeof meta.exportName !== 'string' || meta.exportName === '') {
    throw new Error('expected exportName in codemod meta')
  }

  return meta
}
