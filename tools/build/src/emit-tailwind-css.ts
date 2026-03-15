import type { Declaration, Location2, Rule, StyleRule } from 'lightningcss'
import { transform } from 'lightningcss'

export function emitTailwindCssWithLightning(css: string): string {
  const safeThemeBlocks = extractSafeThemeBlocks(css)
  const strippedCss = stripSafeRootBlocks(css).trim()
  const sections = [`@reference "tailwindcss";`]

  if (safeThemeBlocks.length > 0) {
    sections.push(
      safeThemeBlocks
        .map((block) => `@theme {\n${block.trim()}\n}`)
        .join('\n\n'),
    )
  }

  if (strippedCss) {
    sections.push(`@layer components {\n${indentBlock(strippedCss)}\n}`)
  }

  return sections.join('\n\n').trim()
}

function extractSafeThemeBlocks(css: string): string[] {
  const blocks: string[] = []
  transform({
    filename: 'tmp/tailwind-theme.css',
    code: Buffer.from(css),
    minify: false,
    visitor: {
      Rule(rule) {
        if (!isSafeRootStyleRule(rule)) {
          return
        }

        blocks.push(extractRuleBody(css, rule.value.loc))
      },
    },
  })

  return blocks
}

function stripSafeRootBlocks(css: string): string {
  const result = transform({
    filename: 'tmp/tailwind-layer.css',
    code: Buffer.from(css),
    minify: false,
    visitor: {
      Rule(rule) {
        if (isSafeRootStyleRule(rule)) {
          return []
        }
      },
    },
  })

  return result.code.toString()
}

// A :root rule is only safe to lift into @theme when
// - it is a top-level style rule with no nested rules
// - and every declaration is a custom property.
// Any broader selector shape or mixed declarations should stay as normal CSS.
function isSafeRootStyleRule(rule: Rule<Declaration>): rule is {
  type: 'style'
  value: StyleRule<Declaration>
} {
  if (rule.type !== 'style') {
    return false
  }

  const styleRule = rule.value
  if (styleRule.rules && styleRule.rules.length > 0) {
    return false
  }

  if (!isRootSelectorList(styleRule.selectors)) {
    return false
  }

  const declarations = [
    ...(styleRule.declarations?.declarations ?? []),
    ...(styleRule.declarations?.importantDeclarations ?? []),
  ]
  if (declarations.length === 0) {
    return false
  }

  return declarations.every((declaration) => declaration.property === 'custom')
}

function isRootSelectorList(
  selectors: StyleRule<Declaration>['selectors'],
): boolean {
  return (
    selectors.length === 1 &&
    selectors[0]?.length === 1 &&
    selectors[0]?.[0]?.type === 'pseudo-class' &&
    selectors[0]?.[0]?.kind === 'root'
  )
}

function extractRuleBody(source: string, loc: Location2): string {
  const ruleStart = offsetFromLocation(source, loc)
  const blockStart = source.indexOf('{', ruleStart)
  if (blockStart === -1) {
    throw new Error('Expected opening brace for safe :root rule')
  }

  const blockEnd = findMatchingBrace(source, blockStart)
  return source.slice(blockStart + 1, blockEnd).trim()
}

function offsetFromLocation(source: string, loc: Location2): number {
  let line = 0
  let offset = 0

  while (line < loc.line && offset < source.length) {
    if (source[offset] === '\n') {
      line++
    }
    offset++
  }

  return offset + Math.max(0, loc.column - 1)
}

function findMatchingBrace(source: string, openBraceOffset: number): number {
  let depth = 0

  for (let i = openBraceOffset; i < source.length; i++) {
    const char = source[i]
    if (char === '{') {
      depth++
    } else if (char === '}') {
      depth--
      if (depth === 0) {
        return i
      }
    }
  }

  throw new Error('Expected closing brace for safe :root rule')
}

function indentBlock(text: string): string {
  return text
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')
}
