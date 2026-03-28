import { joinPath, normalizePath } from '@arachne/morph'

export function collectSourceGraph(files: Array<{ path: string }>) {
  const graph = new Map<string, string>()

  for (const file of files) {
    graph.set(normalizePath(file.path), normalizePath(file.path))
  }

  return graph
}

export function resolveRelativeModuleTarget(
  sourceDir: string,
  specifier: string,
  sourceGraph: Map<string, string>,
) {
  const base = normalizePath(joinPath(sourceDir, specifier))
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mjs`,
    `${base}.cjs`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
    `${base}/index.js`,
    `${base}/index.jsx`,
    `${base}/index.mjs`,
    `${base}/index.cjs`,
  ]

  for (const candidate of candidates) {
    if (sourceGraph.has(candidate)) {
      return candidate
    }
  }

  return ''
}
