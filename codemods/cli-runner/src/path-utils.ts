export function normalizePath(path: string) {
  const withSlashes = path.replaceAll('\\', '/')
  const parts = withSlashes.split('/')
  const normalized: string[] = []

  for (const part of parts) {
    if (part === '' || part === '.') {
      continue
    }
    if (part === '..') {
      normalized.pop()
      continue
    }
    normalized.push(part)
  }

  return (
    `${withSlashes.startsWith('/') ? '/' : ''}${normalized.join('/')}` || '.'
  )
}

export function dirname(path: string) {
  const normalized = normalizePath(path)
  const lastSlash = normalized.lastIndexOf('/')

  if (lastSlash < 0) {
    return '.'
  }

  if (lastSlash === 0) {
    return '/'
  }

  return normalized.slice(0, lastSlash)
}

export function basename(path: string) {
  const normalized = normalizePath(path)
  const lastSlash = normalized.lastIndexOf('/')
  return lastSlash < 0 ? normalized : normalized.slice(lastSlash + 1)
}

export function joinPath(base: string, relative: string) {
  if (relative.startsWith('/')) {
    return normalizePath(relative)
  }

  return normalizePath(`${base}/${relative}`)
}

export function trimExtension(path: string) {
  const base = basename(path)
  const extIndex = base.lastIndexOf('.')
  if (extIndex < 0) {
    return path
  }
  return path.slice(0, path.length - (base.length - extIndex))
}

export function trimSuffix(value: string, suffix: string) {
  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value
}

export function relativePathBetween(fromDir: string, toPath: string) {
  const normalizedFrom = normalizePath(fromDir)
  const normalizedTo = normalizePath(toPath)
  const fromParts =
    normalizedFrom === '.' ? [] : normalizedFrom.split('/').filter(Boolean)
  const toParts =
    normalizedTo === '.' ? [] : normalizedTo.split('/').filter(Boolean)

  while (
    fromParts.length > 0 &&
    toParts.length > 0 &&
    fromParts[0] === toParts[0]
  ) {
    fromParts.shift()
    toParts.shift()
  }

  const up = fromParts.map(() => '..')
  const down = toParts
  const relative = [...up, ...down].join('/')

  return relative || '.'
}

export function moduleSpecifierBetween(fromDir: string, toPath: string) {
  const from = fromDir === '' ? '.' : fromDir
  const targetWithoutExt = trimSuffix(
    hasSourceExtension(toPath) ? trimExtension(toPath) : toPath,
    '/index',
  )
  const relativePath = relativePathBetween(from, targetWithoutExt)

  if (relativePath.startsWith('.')) {
    return relativePath
  }

  return `./${relativePath}`
}

function hasSourceExtension(pathValue: string) {
  return ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(
    pathValue.slice(pathValue.lastIndexOf('.')),
  )
}

export function toKebabCase(value: string) {
  if (value === '') {
    return value
  }

  let result = ''
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    const isUpper = char >= 'A' && char <= 'Z'

    if (isUpper) {
      if (index > 0) {
        result += '-'
      }
      result += char.toLowerCase()
      continue
    }

    result += char
  }

  return result
}

export function rewriteSourcePath(
  path: string,
  fileNameKind: 'match-export' | 'kebab-case',
) {
  if (fileNameKind !== 'kebab-case') {
    return normalizePath(path)
  }

  const normalizedPath = normalizePath(path)
  const dir = dirname(normalizedPath)
  const base = basename(normalizedPath)
  const extIndex = base.lastIndexOf('.')
  const ext = extIndex >= 0 ? base.slice(extIndex) : ''
  const name = extIndex >= 0 ? base.slice(0, extIndex) : base

  if (name === 'index' || name === '') {
    return normalizedPath
  }

  const rewrittenBase = `${toKebabCase(name)}${ext}`
  if (dir === '.') {
    return rewrittenBase
  }

  return `${dir}/${rewrittenBase}`
}
