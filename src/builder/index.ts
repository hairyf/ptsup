import { cwd } from 'process'
import fs from 'fs-extra'
import { merge } from 'lodash'
import { loadConfig } from 'unconfig'
import type { PtsupConfigurationRead } from '../config'
import { buildAssets, buildMeta } from '../utils'
import { buildFile } from './file'
import { buildDirectory } from './dir'

export async function build(config: PtsupConfigurationRead) {
  const { config: mrConfig } = await loadConfig<PtsupConfigurationRead>({
    sources: {
      files: 'ptsup.config',
      extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
    },
    merge: false,
  })

  if (mrConfig)
    merge(config, mrConfig)

  await fs.ensureDir(config.outdir)

  if (config.assets)
    await buildAssets(config.root || cwd(), config.outdir, config.assets)

  if (!config.format)
    config.format = config.platform === 'node' ? ['cjs', 'esm'] : ['cjs', 'esm', 'iife']

  if (config.clean)
    fs.removeSync(config.outdir)

  if (config.meta)
    await buildMeta(config.outdir)

  for (const input of config.entry) {
    if (input.endsWith('.js') || input.endsWith('.ts'))
      buildFile(input, config)
    else
      buildDirectory(input, config)
  }
}
