import path from 'path'
import type { Plugin } from 'esbuild'
import fg from 'fast-glob'
import slash from 'slash'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import type { UnroilConfigurationRead } from './config'
import { bundleBuildDts, resolveBuild } from './utils'

export async function runEsbuild(config: UnroilConfigurationRead) {
  for (const input of config.entry) {
    if (input.endsWith('.js') || input.endsWith('.ts'))
      buildFile(input, config)
    else
      buildDirectory(input, config)
  }
}

export async function buildDirectory(input: string, config: UnroilConfigurationRead) {
  const source = slash(path.join(input, './**/*.ts'))
  const ignore = ['_*', '**/dist', '**/node_modules', '__tests__/**', '**/.d.ts']
  const plugins: Plugin[] = []

  if (config.dts)
    plugins.push(dtsPlugin({ outDir: config.outdir }))

  await resolveBuild(config, {
    plugins,
    entryPoints: await fg(source, { ignore }),
    outdir: config.outdir,
  })
}

export async function buildFile(input: string, config: UnroilConfigurationRead) {
  const basename = path.basename(input).replace(/\.ts|\.tsx/, '')
  const dtsFile = `${basename}.d.ts`

  const promises: any[] = []

  for (const format of config.format) {
    const outfile = path.join(config.outdir, `${basename}.${format}.js`)
    const promise = resolveBuild(config, {
      bundle: true,
      format,
      entryPoints: [input],
      outfile,
    })
    if (config.minify && format === 'iife') {
      const promise = resolveBuild(config, {
        bundle: true,
        minify: true,
        entryPoints: [input],
        outfile: outfile.replace('.js', '.min.js'),
      })
      promises.push(promise)
    }
    promises.push(promise)
  }

  if (config.dts)
    promises.push(bundleBuildDts(input, path.join(config.outdir, dtsFile)))

  await Promise.all(promises)
}
