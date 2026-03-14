import { spawnSync } from 'node:child_process'

export function formatGeneratedFiles(files: string[]): void {
  if (files.length === 0) return
  const result = spawnSync('bunx', ['oxfmt', '--write', ...files], {
    stdio: 'inherit',
  })
  if (result.status !== 0) {
    throw new Error('oxfmt failed for generated component files')
  }
}
