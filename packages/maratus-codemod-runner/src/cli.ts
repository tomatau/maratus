#!/usr/bin/env node

import type { CodemodFile } from './run-codemod'
import { readFile } from 'node:fs/promises'
import { runCodemod } from './run-codemod'

type Manifest = {
  codemodPackageName: string
  codemodExportName?: string
  files: Array<CodemodFile>
  options: unknown
}

const manifestPath = process.argv[2]
if (!manifestPath) {
  throw new Error('expected manifest path')
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as Manifest
const codemodModule = await import(manifest.codemodPackageName)
const codemod = codemodModule[manifest.codemodExportName ?? 'default']

if (typeof codemod !== 'function') {
  throw new Error('expected codemod export to be a function')
}

const files = await runCodemod(codemod, manifest.files, manifest.options)

process.stdout.write(JSON.stringify({ files }))
