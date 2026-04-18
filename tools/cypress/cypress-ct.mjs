import { accessSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'cypress'

const relativeFile = (path) => fileURLToPath(new URL(path, import.meta.url))

const repoRoot = findRepoRoot(import.meta.url)
const axeCorePath = join(repoRoot, 'node_modules/axe-core/axe.min.js')
const componentIndexHtmlFile = relativeFile('./component-index.html')
const supportFile = relativeFile('./support.mjs')

export function createCypressCTConfig(specPattern) {
  return defineConfig({
    expose: {
      axeCorePath,
    },
    component: {
      devServer: {
        bundler: 'vite',
        framework: 'react',
        viteConfig: {
          plugins: [react()],
        },
      },
      indexHtmlFile: componentIndexHtmlFile,
      specPattern,
      supportFile,
    },
    allowCypressEnv: false,
    video: false,
  })
}

function findRepoRoot(fromFileUrl) {
  let currentDir = dirname(fileURLToPath(fromFileUrl))

  while (true) {
    try {
      accessSync(join(currentDir, 'repo.yml'))
      return currentDir
    } catch {
      const parentDir = dirname(currentDir)

      if (parentDir === currentDir) {
        throw new Error(`Could not find repo root from ${fromFileUrl}`)
      }

      currentDir = parentDir
    }
  }
}
