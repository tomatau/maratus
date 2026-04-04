import { describe, expect, it } from 'bun:test'
import { runCodemod } from '@maratus/codemod-runner'
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
            rewrittenPath:
              '/consumer/lib/dependency-lib/use-dependency-feature.ts',
          },
          {
            path: '/consumer/lib/dependency-lib/useDependencyHook.ts',
            fileNameKind: 'kebab-case',
            rewrittenPath:
              '/consumer/lib/dependency-lib/use-dependency-hook.ts',
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
            rewrittenPath: '/consumer/components/component/Component.tsx',
          },
          {
            path: '/consumer/components/component/utils/index.ts',
            fileNameKind: 'match-export',
            rewrittenPath: '/consumer/components/component/utils/index.ts',
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
            rewrittenPath: '/consumer/components/component/Component.tsx',
          },
          {
            path: '/consumer/components/component/useComponent.ts',
            fileNameKind: 'match-export',
            rewrittenPath: '/consumer/components/component/useComponent.ts',
          },
        ],
      },
    )

    expect(result.sourceText).toContain("from './useComponent'")
  })

  it('rewrites css imports using the rewritten target path', async () => {
    const [result] = await runCodemod(
      rewriteRelativeImports,
      [
        {
          path: '/consumer/components/component/use-component.ts',
          sourceText:
            "import './component-with-hook.css'\nexport function useComponent() { return null }\n",
        },
      ],
      {
        files: [
          {
            path: '/consumer/components/component/use-component.ts',
            fileNameKind: 'kebab-case',
            rewrittenPath: '/consumer/components/component/use-component.ts',
          },
          {
            path: '/consumer/components/component/component-with-hook.css',
            fileNameKind: 'match-export',
            rewrittenPath:
              '/consumer/components/component/ComponentWithHook.css',
          },
        ],
      },
    )

    expect(result.sourceText).toContain("import './ComponentWithHook.css'")
  })
})
