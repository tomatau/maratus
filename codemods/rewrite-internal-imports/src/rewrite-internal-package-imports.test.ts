import { describe, expect, it } from 'bun:test'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { runCodemod } from '@maratus/codemod-runner'
import { rewriteInternalPackageImports } from './rewrite-internal-package-imports'

describe(rewriteInternalPackageImports, () => {
  it('rewrites imports from an explicit internal package import name', async () => {
    const [result] = await runCodemod(
      rewriteInternalPackageImports,
      [
        {
          path: '/consumer/src/components/dependent-component/use-dependent-component.ts',
          sourceText:
            "import { useDependency } from '@example/internal-original'\n",
        },
      ],
      {
        packages: [
          {
            packageName: 'dependency-component',
            importPackageName: '@example/internal-original',
            sourceDir: '/consumer-repo/registry/dependency-component/css-files',
            destinationDir: '/consumer/src/components/dependency-component',
            barrel: true,
            fileNames: {
              components: 'kebab-case',
            },
          },
        ],
      },
    )

    expect(result.sourceText).toContain(
      "import { useDependency } from '../dependency-component'",
    )
  })

  it('rewrites hook exports with the hook file name kind', async () => {
    const sourceDir = mkdtempSync(
      path.join(tmpdir(), 'maratus-internal-imports-'),
    )
    mkdirSync(path.join(sourceDir, 'css-files'), { recursive: true })
    writeFileSync(
      path.join(sourceDir, 'css-files', 'index.ts'),
      "export { useDependencyHook } from './useDependencyHook'\n",
    )
    writeFileSync(
      path.join(sourceDir, 'css-files', 'useDependencyHook.ts'),
      'export function useDependencyHook() { return null }\n',
    )

    const [result] = await runCodemod(
      rewriteInternalPackageImports,
      [
        {
          path: '/consumer/src/components/dependent-component/use-dependent-component.ts',
          sourceText:
            "import { useDependencyHook } from '@example/internal-original'\n",
        },
      ],
      {
        packages: [
          {
            packageName: 'dependency-component',
            importPackageName: '@example/internal-original',
            sourceDir: path.join(sourceDir, 'css-files'),
            destinationDir: '/consumer/src/components/dependency-component',
            barrel: false,
            fileNames: {
              components: 'match-export',
              hooks: 'kebab-case',
            },
          },
        ],
      },
    )

    expect(result.sourceText).toContain(
      "import { useDependencyHook } from '../dependency-component/use-dependency-hook'",
    )
  })

  it('rewrites barrel imports from a nested hook file to the lib directory path', async () => {
    const [result] = await runCodemod(
      rewriteInternalPackageImports,
      [
        {
          path: '/consumer/src/components/component/use-component.ts',
          sourceText:
            "import { useDependencyFeature } from '@maratus-lib/dependency-lib'\n",
        },
      ],
      {
        packages: [
          {
            packageName: 'dependency-lib',
            sourceDir: '/consumer-repo/lib/dependency-lib/src',
            destinationDir: '/consumer/src/lib/dependency-lib',
            barrel: true,
            fileNames: {
              lib: 'kebab-case',
            },
          },
        ],
      },
    )

    expect(result.sourceText).toContain(
      "import { useDependencyFeature } from '../../lib/dependency-lib'",
    )
  })
})
