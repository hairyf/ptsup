import fs from 'fs-extra'
import { runEsbuild } from './build'
import type { PtsupConfigurationRead } from './config'
import { buildMetaFiles } from './utils'

export * from './config'
export * from './utils'
export * from './build'

export async function build(config: PtsupConfigurationRead) {
  if (!config.format)
    config.format = config.platform === 'node' ? ['cjs', 'esm'] : ['cjs', 'esm', 'iife']

  if (config.clean)
    fs.removeSync(config.outdir)

  if (config.meta)
    await buildMetaFiles(config.outdir)

  await runEsbuild(config)
}
