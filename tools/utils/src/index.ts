export function formatDeclarations(declarations: Record<string, string>) {
  return Object.entries(declarations)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')
}

export function toCamelCase(name: string) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}
