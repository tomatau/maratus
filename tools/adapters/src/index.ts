import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export type InlineCssVarsAdapterInput = {
  componentName: string
  sourceComponent: string
  inlineStyleVarName: string
  inlineStyleLiteral: string
}

export async function renderInlineCssVarsAdapter(
  input: InlineCssVarsAdapterInput,
) {
  const {
    componentName,
    inlineStyleLiteral,
    inlineStyleVarName,
    sourceComponent,
  } = input
  const templatePath = join(
    import.meta.dir,
    '..',
    'templates',
    'inline-css-vars.tsx.tmpl',
  )
  const template = await readFile(templatePath, 'utf8')
  const sourceFunctionExport = `export function ${componentName}(`
  const sourceComponentInline = sourceComponent.replace(
    sourceFunctionExport,
    `function ${componentName}(`,
  )

  return template
    .replaceAll('{{COMPONENT_NAME}}', componentName)
    .replaceAll('{{SOURCE_COMPONENT}}', sourceComponentInline.trim())
    .replaceAll('{{INLINE_VAR_NAME}}', inlineStyleVarName)
    .replaceAll('{{INLINE_STYLE_JSON}}', inlineStyleLiteral)
}
