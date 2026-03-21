export const SRC_DIR = 'src'
export const TS_EXT = '.ts'
export const TSX_EXT = '.tsx'
export const CSS_EXT = '.css'
export const CSS_MODULE_EXT = '.module.css'
export const REGISTRY_META_FILENAME = 'meta.json'
export const REGISTRY_PACKAGE_FILENAME = 'package.json'

export enum ConfigStyle {
  CssFiles = 'css-files',
  CssModules = 'css-modules',
  TailwindCss = 'tailwind-css',
}

export function styleDirFor(style: ConfigStyle): string {
  // Currently the style value and the directory name are identical.
  // This helper makes the coupling explicit and is the single place to
  // adjust if that changes.
  return style
}
