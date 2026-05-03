import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, test } from 'bun:test'
import { collectComponentSourceGraph } from './component-source-graph'

const fixtureDirs: string[] = []

afterEach(async () => {
  await Promise.all(
    fixtureDirs.splice(0).map((fixtureDir) =>
      rm(fixtureDir, {
        force: true,
        recursive: true,
      }),
    ),
  )
})

test('collectComponentSourceGraph follows relative barrel re-exports', async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), 'maratus-source-graph-'))
  fixtureDirs.push(fixtureDir)

  const srcDir = join(fixtureDir, 'src')
  await mkdir(srcDir)
  await writeFile(
    join(srcDir, 'Field.tsx'),
    "import { useControl } from './useField'\nexport function Field() { return useControl() }\n",
  )
  await writeFile(
    join(srcDir, 'Field.types.ts'),
    'export type FieldProps = { label: string }\n',
  )
  await writeFile(
    join(srcDir, 'index.ts'),
    "export type { FieldProps } from './Field.types'\nexport { Field } from './Field'\nexport { useControl } from './useField'\n",
  )
  await writeFile(
    join(srcDir, 'useControl.ts'),
    "export function useControl() { return 'control' }\n",
  )
  await writeFile(
    join(srcDir, 'useField.ts'),
    "export { useControl } from './useControl'\n",
  )

  const files = await collectComponentSourceGraph(join(srcDir, 'Field.tsx'), srcDir)

  expect(files.map((file) => file.fileName).sort()).toEqual([
    'Field.tsx',
    'Field.types.ts',
    'index.ts',
    'useControl.ts',
    'useField.ts',
  ])
})
