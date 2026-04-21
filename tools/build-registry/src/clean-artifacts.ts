import { readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { ConfigStyle, REGISTRY_META_FILENAME, styleDirFor } from './config'

export type CleanArtifactsOptions = {
  registryDir: string
}

const GENERATED_DIRS = [
  styleDirFor(ConfigStyle.CssFiles),
  styleDirFor(ConfigStyle.CssModules),
  styleDirFor(ConfigStyle.TailwindCss),
]

export async function cleanArtifacts(
  options: CleanArtifactsOptions,
): Promise<void> {
  const { registryDir } = options
  const entries = await readdir(registryDir, { withFileTypes: true })

  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => [
        ...GENERATED_DIRS.map((dirName) =>
          rm(join(registryDir, entry.name, dirName), {
            force: true,
            recursive: true,
          }),
        ),
        rm(join(registryDir, entry.name, REGISTRY_META_FILENAME), {
          force: true,
        }),
      ]),
  )
}
