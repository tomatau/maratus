export const SRC_DIR = 'src'
export const TSX_EXT = '.tsx'
export const CSS_EXT = '.css'
export const CSS_MODULE_EXT = '.module.css'

export enum ConfigStyle {
	InlineCssVars = 'inline-css-vars',
	CssFiles = 'css-files',
	TailwindCss = 'tailwind-css',
}

export const STYLES_FILENAME = 'styles.ts'
export const INLINE_STYLE_VAR_NAME = 'componentInlineStyle'

export type StyleSpec = {
  className: string
  vars: Record<string, string>
  declarations: Record<string, string>
}

export function styleDirFor(style: ConfigStyle): string {
  // Currently the style value and the directory name are identical.
  // This helper makes the coupling explicit and is the single place to
  // adjust if that changes.
  return style
}
