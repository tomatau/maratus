import { describe, expect, it } from 'bun:test'
import { runCodemod } from '@arachne-codemod/cli-runner'
import { rewriteRelativeImports } from './rewrite-relative-imports'

describe(rewriteRelativeImports, () => {
  it('rewrites a renamed sibling import for kebab-case', async () => {
    const [result] = await runCodemod(
      rewriteRelativeImports,
      [
        {
          path: '/consumer/lib/dependency-lib/useDependencyFeature.ts',
          sourceText:
            "import { useDependencyHook } from './useDependencyHook'\nexport function useDependencyFeature() { return useDependencyHook() === 'ready' }\n",
        },
        {
          path: '/consumer/lib/dependency-lib/useDependencyHook.ts',
          sourceText:
            "export function useDependencyHook() { return 'ready' }\n",
        },
      ],
      {
        files: [
          {
            path: '/consumer/lib/dependency-lib/useDependencyFeature.ts',
            fileNameKind: 'kebab-case',
          },
          {
            path: '/consumer/lib/dependency-lib/useDependencyHook.ts',
            fileNameKind: 'kebab-case',
          },
        ],
      },
    )

    expect(result.sourceText).toContain("from './use-dependency-hook'")
  })

  it('rewrites index-directory imports to the package path', async () => {
    const [result] = await runCodemod(
      rewriteRelativeImports,
      [
        {
          path: '/consumer/components/component/Component.tsx',
          sourceText:
            "import { helper } from './utils'\nexport function Component() { return helper() }\n",
        },
        {
          path: '/consumer/components/component/utils/index.ts',
          sourceText: 'export function helper() { return null }\n',
        },
      ],
      {
        files: [
          {
            path: '/consumer/components/component/Component.tsx',
            fileNameKind: 'match-export',
          },
          {
            path: '/consumer/components/component/utils/index.ts',
            fileNameKind: 'match-export',
          },
        ],
      },
    )

    expect(result.sourceText).toContain("from './utils'")
  })

  it('leaves imports unchanged for match-export naming', async () => {
    const [result] = await runCodemod(
      rewriteRelativeImports,
      [
        {
          path: '/consumer/components/component/Component.tsx',
          sourceText:
            "import { useComponent } from './useComponent'\nexport function Component() { return useComponent() }\n",
        },
        {
          path: '/consumer/components/component/useComponent.ts',
          sourceText: 'export function useComponent() { return null }\n',
        },
      ],
      {
        files: [
          {
            path: '/consumer/components/component/Component.tsx',
            fileNameKind: 'match-export',
          },
          {
            path: '/consumer/components/component/useComponent.ts',
            fileNameKind: 'match-export',
          },
        ],
      },
    )

    expect(result.sourceText).toContain("from './useComponent'")
  })
})
