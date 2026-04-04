import { describe, expect, it } from 'bun:test'
import { runCodemod } from '@maratus/codemod-runner'
import { rewriteInternalImports } from './rewrite-internal-imports'

describe(rewriteInternalImports, () => {
  it('rewrites to the barrel path when one is provided', async () => {
    const [result] = await runCodemod(
      rewriteInternalImports,
      [
        {
          path: '/consumer/components/component/component.tsx',
          sourceText: "import { useTestHook } from '@maratus/lib-hook'\n",
        },
      ],
      {
        targets: {
          '@maratus/lib-hook': {
            barrelPath: '../../lib/lib-hook',
          },
        },
      },
    )

    expect(result.sourceText).toContain(
      "import { useTestHook } from '../../lib/lib-hook'",
    )
  })

  it('splits named imports by file path when no barrel path is provided', async () => {
    const [result] = await runCodemod(
      rewriteInternalImports,
      [
        {
          path: '/consumer/components/component/component.tsx',
          sourceText:
            "import { useLibHook, useTestHook } from '@maratus/lib-hook'\n",
        },
      ],
      {
        targets: {
          '@maratus/lib-hook': {
            namedPaths: {
              useLibHook: '../../lib/lib-hook/useLibHook',
              useTestHook: '../../lib/lib-hook/useTestHook',
            },
          },
        },
      },
    )

    expect(result.sourceText).toContain(
      "import { useLibHook } from '../../lib/lib-hook/useLibHook'",
    )
    expect(result.sourceText).toContain(
      "import { useTestHook } from '../../lib/lib-hook/useTestHook'",
    )
  })

  it('groups named imports that resolve to the same file path', async () => {
    const [result] = await runCodemod(
      rewriteInternalImports,
      [
        {
          path: '/consumer/components/example/example.ts',
          sourceText: "import { A, B } from '@maratus/example-lib'\n",
        },
      ],
      {
        targets: {
          '@maratus/example-lib': {
            namedPaths: {
              A: '../../lib/example-lib/a',
              B: '../../lib/example-lib/a',
            },
          },
        },
      },
    )

    expect(result.sourceText).toContain(
      "import { A, B } from '../../lib/example-lib/a'",
    )
  })
})
