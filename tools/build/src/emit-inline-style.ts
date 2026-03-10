import { toCamelCase } from "@arachne/utils"
import { StyleSpec } from "./style-spec"

export function emitInlineStyle(spec: StyleSpec) {
  const style: Record<string, string> = {}

  for (const [property, value] of Object.entries(spec.declarations)) {
    style[toCamelCase(property)] = value
  }

  return style
}
