import type { Declaration, Rule, StyleRule } from 'lightningcss'
import { readFile } from 'node:fs/promises'
import { transform } from 'lightningcss'

export type ComponentTokenMapping = {
  component: string
  theme: string
}

export type ComponentMeta = {
  sourceType: 'registry-component'
  themeTokens: string[]
  componentTokens: ComponentTokenMapping[]
}

export function emptyComponentMeta(): ComponentMeta {
  return {
    sourceType: 'registry-component',
    themeTokens: [],
    componentTokens: [],
  }
}

export async function extractComponentMeta(
  cssModulePath: string,
): Promise<ComponentMeta> {
  const css = await readFile(cssModulePath)
  const componentTokens: ComponentTokenMapping[] = []

  transform({
    filename: cssModulePath,
    code: css,
    minify: false,
    visitor: {
      Rule(rule) {
        if (!isRootStyleRule(rule)) {
          return
        }

        const declarations = [
          ...(rule.value.declarations?.declarations ?? []),
          ...(rule.value.declarations?.importantDeclarations ?? []),
        ]

        for (const declaration of declarations) {
          const tokenMapping = extractTokenMapping(declaration)
          if (!tokenMapping) {
            continue
          }

          componentTokens.push(tokenMapping)
        }
      },
    },
  })

  const themeTokens = [...new Set(componentTokens.map((token) => token.theme))]

  return {
    sourceType: 'registry-component',
    themeTokens,
    componentTokens,
  }
}

function isRootStyleRule(rule: Rule<Declaration>): rule is {
  type: 'style'
  value: StyleRule<Declaration>
} {
  return (
    rule.type === 'style' &&
    rule.value.selectors.length === 1 &&
    rule.value.selectors[0]?.length === 1 &&
    rule.value.selectors[0]?.[0]?.type === 'pseudo-class' &&
    rule.value.selectors[0]?.[0]?.kind === 'root'
  )
}

function extractTokenMapping(
  declaration: Declaration,
): ComponentTokenMapping | null {
  if (declaration.property !== 'custom') {
    return null
  }

  const customProperty = declaration.value
  const firstValue = customProperty.value[0]
  if (!firstValue || firstValue.type !== 'var') {
    return null
  }

  return {
    component: customProperty.name,
    theme: firstValue.value.name.ident,
  }
}
