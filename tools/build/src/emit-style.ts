import type { StyleSpec } from './config'
import { formatDeclarations, toCamelCase } from '@arachne/utils'

export function emitCss(spec: StyleSpec) {
  return `
:root {
${formatDeclarations(spec.vars)}
}

.${spec.className} {
${formatDeclarations(spec.declarations)}
}`.trim()
}

export function emitInlineStyle(spec: StyleSpec) {
  const style: Record<string, string> = {}

  for (const [property, value] of Object.entries(spec.declarations)) {
    style[toCamelCase(property)] = value
  }

  return style
}
