import { formatDeclarations } from '@arachne/utils'
import { StyleSpec } from './style-spec'

export function emitCss(spec: StyleSpec) {
  return `
:root {
${formatDeclarations(spec.vars)}
}

.${spec.className} {
${formatDeclarations(spec.declarations)}
}`.trim()
}
