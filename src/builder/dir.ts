import path from 'path'
import type { Plugin } from 'esbuild'
import slash from 'slash'
import fg from 'fast-glob'
import type { PtsupConfigurationRead } from '../config'

import { resolve } from './helper/resolve'
import { buildDeclarations } from './dts'

export async function buildDirectory(input: string, config: PtsupConfigurationRead) {
  const source = [slash(path.join(input, './**/*.ts')), slash(path.join(input, './**/*.tsx'))]

  const ignore = ['_*', '**/dist', '**/node_modules', '__tests__/**', '**/.d.ts', 'ptsup.config.ts']
  const plugins: Plugin[] = []

  let entryPoints = await fg(source, { ignore })
  /**/entryPoints = entryPoints.filter(p => !p.endsWith('d.ts'))

  if (config.dts.enable && !config.dts.entry?.length)
    await buildDeclarations(entryPoints, { outdir: config.outdir })

  if (config.dts.only)
    return

  await resolve(config, {
    plugins,
    entryPoints,
    format: 'cjs',
    outdir: config.outdir,
  })
}
