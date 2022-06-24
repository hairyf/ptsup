import esbuild from 'esbuild'
import type { PtsupConfigurationRead } from '../../config'
import { externalize } from '../plugins/externalize'

export async function resolve(config: PtsupConfigurationRead, build: esbuild.BuildOptions) {
  build.plugins = [externalize(), ...(build.plugins || [])]
  const buildConfig: esbuild.BuildOptions = {
    bundle: false,
    color: true,
    platform: config.platform,
    splitting: config.splitting,
    sourcemap: config.sourcemap,
    globalName: config.globalName,
    loader: { '.ts': 'tsx', '.tsx': 'tsx' },
    ...build,
  }
  return esbuild.build(buildConfig)
}
