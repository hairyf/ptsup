import { cwd } from 'process'
import path from 'path'
import fs from 'fs-extra'
import { merge } from 'lodash'
import { loadConfig } from 'unconfig'
import slash from 'slash'
import type { PtsupConfigurationRead } from '../config'
import { buildAssets, buildMeta } from '../utils'
import { buildFile } from './file'
import { buildDirectory } from './dir'

export async function build(config: PtsupConfigurationRead) {
  // #region config helper
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

  config.entry = config.entry.map(slash)
  config.outdir = slash(config.outdir)
  // #endregion

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
