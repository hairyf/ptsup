import esbuild from 'esbuild'
import merge from 'lodash/merge'
import type { PtsupConfigurationRead } from '../config'
import { externalize } from './plugins/externalize'
import { metafile } from './plugins/metafile'

export async function resolve(config: PtsupConfigurationRead, build: esbuild.BuildOptions) {
  const defaultConfig: esbuild.BuildOptions = {
    bundle: false,
    color: true,
    platform: config.platform,
    splitting: config.splitting,
    external: config.external,
    sourcemap: config.sourcemap,
    globalName: config.globalName,
    target: config.target,
    // TODO: https://github1s.com/egoist/tsup/blob/dev/src/index.ts
    // watch: config.watch,
    metafile: config.metafile,
    jsxFactory: config.jsxFactory,
    loader: { '.ts': 'tsx', '.tsx': 'tsx' },
  }
  const buildConfig: esbuild.BuildOptions = merge(defaultConfig, build, config.esbuild)

  buildConfig.plugins = buildConfig.plugins || []

  if (!buildConfig.external)
    buildConfig.plugins.push(externalize(config.internal))

  if (buildConfig.metafile)
    buildConfig.plugins.push(metafile(config.outdir, buildConfig.format))

  return esbuild.build(buildConfig)
}
