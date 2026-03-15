import { readFile } from 'node:fs/promises'
import { transform } from 'lightningcss'

export type CompiledCssModule = {
  css: string
  exports: Record<string, string>
}

export async function compileCssModule(
  cssModulePath: string,
): Promise<CompiledCssModule> {
  const source = await readFile(cssModulePath)
  const result = transform({
    filename: cssModulePath.replace('.module', ''),
    code: source,
    cssModules: {
      pattern: 'arachne__[name]__[local]',
    },
    minify: false,
  })

  const exports: Record<string, string> = {}
  for (const [localName, exportValue] of Object.entries(result.exports || {})) {
    exports[localName] = exportValue.name
  }

  return {
    css: result.code.toString(),
    exports,
  }
}
