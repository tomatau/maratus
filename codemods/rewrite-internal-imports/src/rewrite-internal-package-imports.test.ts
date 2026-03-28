import { describe, expect, it } from 'bun:test'
import { runCodemod } from '@arachne/morph'
import { rewriteInternalPackageImports } from './rewrite-internal-package-imports'

describe(rewriteInternalPackageImports, () => {
  it('rewrites barrel imports from a nested hook file to the lib directory path', async () => {
    const [result] = await runCodemod(
      rewriteInternalPackageImports,
      [
        {
          path: '/consumer/src/components/component/use-component.ts',
          sourceText:
            "import { useDependencyFeature } from '@arachne/dependency-lib'\n",
        },
      ],
      {
        packages: [
          {
            packageName: 'dependency-lib',
            sourceDir: '/consumer-repo/lib/dependency-lib/src',
            destinationDir: '/consumer/src/lib/dependency-lib',
            barrel: true,
            fileNameKind: 'kebab-case',
          },
        ],
      },
    )

    expect(result.sourceText).toContain(
      "import { useDependencyFeature } from '../../lib/dependency-lib'",
    )
  })
})
