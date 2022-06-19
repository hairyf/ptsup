import path from 'path'
import type { Plugin } from 'esbuild'
import slash from 'slash'
import fg from 'fast-glob'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import type { PtsupConfigurationRead } from '../config'

import { resolve } from './helper/resolve'

export async function buildDirectory(input: string, config: PtsupConfigurationRead) {
  const source = slash(path.join(input, './**/*.ts'))

  const ignore = ['_*', '**/dist', '**/node_modules', '__tests__/**', '**/.d.ts', 'ptsup.config.ts']
  const plugins: Plugin[] = []

  const entryPoints = await fg(source, { ignore })

  if (config.dts)
    plugins.push(dtsPlugin({ outDir: config.outdir }))

  await resolve(config, {
    plugins,
    entryPoints: entryPoints.filter(p => !p.endsWith('d.ts')),
    outdir: config.outdir,
  })
}
