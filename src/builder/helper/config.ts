import path from 'path'
import { merge } from 'lodash'
import slash from 'slash'
import { loadConfig } from 'unconfig'
import type { PtsupConfigurationRead } from '../../config'

export async function configRead(config: PtsupConfigurationRead) {
  const { config: mrConfig } = await loadConfig<PtsupConfigurationRead>({
    sources: {
      files: 'ptsup.config',
      extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
    },
    merge: false,
  })

  if (mrConfig)
    merge(config, mrConfig)

  if (config.root)
    config.entry = config.entry.map((p: string) => path.join(config.root, p))

  if (!config.format)
    config.format = config.platform === 'node' ? ['cjs', 'esm'] : ['cjs', 'esm', 'iife']

  if (config.sourcemap)
    config.format = ['esm']

  config.entry = config.entry.map(slash)
  config.outdir = slash(config.outdir)
  return config
}
