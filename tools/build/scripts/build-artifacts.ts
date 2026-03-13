import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { renderInlineCssVarsAdapter } from '@arachne/adapters'
import { emitCss, emitInlineStyle, type StyleSpec } from '../src'

const rootDir = join(import.meta.dir, '..', '..', '..')
const componentsDir = join(rootDir, 'components')
const outRoot = join(rootDir, 'registry')
const generatedFiles: string[] = []

type StyleModule = {
  styleSpec?: StyleSpec
}

const entries = await readdir(componentsDir, { withFileTypes: true })
for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue
  }

  const componentName = entry.name
  const stylesPath = join(componentsDir, componentName, 'src', 'styles.ts')
  if (!existsSync(stylesPath)) {
    continue
  }

  const styleModule = (await import(
    pathToFileURL(stylesPath).href
  )) as StyleModule
  if (!styleModule.styleSpec) {
    throw new Error(`Missing styleSpec export in ${stylesPath}`)
  }

  const componentSourceName = `${componentName[0]?.toUpperCase() ?? ''}${componentName.slice(1)}.tsx`
  const componentSourcePath = join(
    componentsDir,
    componentName,
    'src',
    componentSourceName,
  )
  if (!existsSync(componentSourcePath)) {
    throw new Error(`Missing component source file: ${componentSourcePath}`)
  }

  const baseComponentSource = await readFile(componentSourcePath, 'utf8')
  const css = emitCss(styleModule.styleSpec)
  const inlineStyle = emitInlineStyle(styleModule.styleSpec)
  const inlineStyleLiteral = JSON.stringify(inlineStyle)

  const cssFileDir = join(outRoot, componentName, 'css-files')
  const cssVarsDir = join(outRoot, componentName, 'inline-css-vars')
  await mkdir(cssFileDir, { recursive: true })
  await mkdir(cssVarsDir, { recursive: true })

  await writeFile(
    join(cssFileDir, componentSourceName),
    `import "./${componentName}.css"\n\n${baseComponentSource}`,
    'utf8',
  )
  generatedFiles.push(join(cssFileDir, componentSourceName))
  const cssPath = join(cssFileDir, `${componentName}.css`)
  await writeFile(cssPath, css, 'utf8')
  generatedFiles.push(cssPath)

  const inlineAdapter = await renderInlineCssVarsAdapter({
    componentName: componentSourceName.replace('.tsx', ''),
    sourceComponent: baseComponentSource,
    inlineStyleVarName: 'componentInlineStyle',
    inlineStyleLiteral,
  })
  await writeFile(join(cssVarsDir, componentSourceName), inlineAdapter, 'utf8')
  generatedFiles.push(join(cssVarsDir, componentSourceName))
}

if (generatedFiles.length > 0) {
  const result = spawnSync('bunx', ['oxfmt', '--write', ...generatedFiles], {
    stdio: 'inherit',
  })
  if (result.status !== 0) {
    throw new Error('oxfmt failed for generated component files')
  }
}
