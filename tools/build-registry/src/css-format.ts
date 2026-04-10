export function wrapInLayer(name: string, css: string): string {
  return `@layer ${name} {\n${indentBlock(css)}\n}\n`
}

export function indentBlock(text: string): string {
  return text
    .trim()
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
}
