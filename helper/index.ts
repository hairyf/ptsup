import { execSync } from 'child_process'
import { runEsbuild } from './build'
import type { UnroilConfigurationRead } from './config'
import { buildMetaFiles } from './utils'

export * from './config'
export * from './utils'
export * from './build'

export async function build(config: UnroilConfigurationRead) {
  if (config.clean)
    execSync(`rimraf ${config.outdir}`)
  if (config.meta)
    await buildMetaFiles(config.outdir)

  await runEsbuild(config)
}
