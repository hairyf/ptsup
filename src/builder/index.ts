import { cwd } from 'process'
import fs from 'fs-extra'
import type { PtsupConfigurationRead } from '../config'
import { buildAssets, buildMeta } from '../utils'
import { helperConfigRead } from '../helper/config-read'
import { buildFile } from './file'
import { buildDirectory } from './dir'
import { buildDeclarations } from './dts'

export async function build(config: PtsupConfigurationRead) {
  config = await helperConfigRead(config)

  if (config.clean)
    fs.removeSync(config.outdir)

  if (!fs.existsSync(config.outdir))
    await fs.ensureDir(config.outdir)

  if (config.meta)
    await buildMeta(config.outdir)
  if (config.metaOnly)
    return

  if (config.assets)
    await buildAssets(config.root || cwd(), config.outdir, config.assets)

  if (config.entry)
    await buildEntry(config.entry, config)

  if (config.dts.entry?.length) {
    await buildDeclarations(config.dts.entry, {
      outdir: config.outdir,
      bundle: true,
      root: config.root,
    })
  }
}

async function buildEntry(entry: string[], config: PtsupConfigurationRead) {
  for (const input of entry) {
    if (input.endsWith('.js') || input.endsWith('.ts') || input.endsWith('.tsx'))
      await buildFile(input, config)
    else
      await buildDirectory(input, config)
  }
}
