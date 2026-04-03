#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { constants as fsConstants } from 'node:fs'
import { access } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
const require = createRequire(import.meta.url)

function platformPackageName() {
  const key = `${process.platform}-${process.arch}`

  switch (key) {
    case 'darwin-arm64':
      return '@arachne/cli-darwin-arm64'
    case 'darwin-x64':
      return '@arachne/cli-darwin-x64'
    case 'linux-x64':
      return '@arachne/cli-linux-x64'
    case 'win32-x64':
      return '@arachne/cli-win32-x64'
    default:
      return null
  }
}

const packageName = platformPackageName()
if (!packageName) {
  console.error(
    `Arachne CLI does not support ${process.platform}-${process.arch}.`,
  )
  process.exit(1)
}

let binaryPath

try {
  const packageJsonPath = require.resolve(`${packageName}/package.json`)
  const binaryName = process.platform === 'win32' ? 'arachne.exe' : 'arachne'
  binaryPath = join(dirname(packageJsonPath), 'bin', binaryName)
} catch {
  console.error(
    [
      `Arachne CLI not installed for ${process.platform}-${process.arch}.`,
      `Expected package: ${packageName}`,
    ].join('\n'),
  )
  process.exit(1)
}

try {
  await access(binaryPath, fsConstants.X_OK)
} catch {
  console.error(
    [
      'Arachne CLI binary is not packaged yet for this platform.',
      `Expected package: ${packageName}`,
      `Expected executable at: ${binaryPath}`,
    ].join('\n'),
  )
  process.exit(1)
}

const child = spawn(binaryPath, process.argv.slice(2), {
  stdio: 'inherit',
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 1)
})

child.on('error', (error) => {
  console.error(error.message)
  process.exit(1)
})
