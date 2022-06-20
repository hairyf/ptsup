import path from 'path'
import type { PtsupConfigurationRead } from '../config'
import { buildDeclaration } from './dts'

import { resolve } from './helper/resolve'

export async function buildFile(input: string, config: PtsupConfigurationRead) {
  const basename = path.basename(input).replace(/\.ts|\.tsx/, '')
  const dtsFile = `${basename}.d.ts`

  if (config.dts.enable && !config.dts.entry?.length)
    await buildDeclaration(input, path.join(config.outdir, dtsFile))

  if (config.dts.only)
    return

  const formatPromises: any[] = []
  for (const format of config.format) {
    const outfile = path.join(config.outdir, `${basename}.${format}.js`)
    const promise = resolve(config, {
      bundle: true,
      format,
      entryPoints: [input],
      outfile,
    })
    if (config.minify && format === 'iife') {
      const promise = resolve(config, {
        bundle: true,
        minify: true,
        entryPoints: [input],
        outfile: outfile.replace('.js', '.min.js'),
      })
      formatPromises.push(promise)
    }
    formatPromises.push(promise)
  }
  await Promise.all(formatPromises)
}
