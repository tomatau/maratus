import { afterEach, expect, test } from 'bun:test'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  collectComponentInputs,
  componentCssFileName,
  componentCssModuleFileName,
  componentSourceFileName,
} from './monorepo'

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

test('component file names use PascalCase for kebab-case package names', () => {
  expect(componentSourceFileName('text-control')).toBe('TextControl.tsx')
  expect(componentCssModuleFileName('text-control')).toBe(
    'TextControl.module.css',
  )
  expect(componentCssFileName('text-control')).toBe('TextControl.css')
})

test('collectComponentInputs discovers kebab-case component packages', async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), 'maratus-monorepo-'))
  fixtureDirs.push(fixtureDir)

  const componentDir = join(fixtureDir, 'text-control')
  const srcDir = join(componentDir, 'src')

  await mkdir(srcDir, { recursive: true })
  await writeFile(
    join(componentDir, 'package.json'),
    '{"name":"@maratus-component/text-control"}\n',
  )
  await writeFile(
    join(srcDir, 'TextControl.tsx'),
    'export function TextControl() { return null }\n',
  )

  const inputs = await collectComponentInputs(fixtureDir)

  expect(inputs).toHaveLength(1)
  expect(inputs[0]?.name).toBe('text-control')
  expect(inputs[0]?.componentSourcePath).toBe(join(srcDir, 'TextControl.tsx'))
})
