import path from 'path'
import fs from 'fs-extra'
import esbuild from 'esbuild'
import { rollup } from 'rollup'
import rollupPluginDts from 'rollup-plugin-dts'
import lnk from 'lnk'
import type { UnroilConfigurationRead } from './config'
import { externalizePlugin } from './plugins'

export const toArray = (value: any | any[]) => {
  return Array.isArray(value) ? value : [value]
}

export const getCwdPackage = (cwd = process.cwd()) => {
  const pkgPath = (path.join(cwd, 'package.json'))
  if (!fs.existsSync(pkgPath))
    return
  return fs.readJSONSync(pkgPath)
}

export async function resolveBuild(config: UnroilConfigurationRead, build: esbuild.BuildOptions) {
  build.plugins = [externalizePlugin(), ...(build.plugins || [])]
  const buildConfig: esbuild.BuildOptions = {
    bundle: false,
    color: true,
    platform: config.platform,

    sourcemap: config.sourcemap,
    globalName: config.globalName,
    loader: { '.ts': 'tsx', '.tsx': 'tsx' },
    ...build,
  }
  return esbuild.build(buildConfig)
}

export async function bundleBuildDts(input: string, outfile: string) {
  const bundles = await rollup({
    input,
    plugins: [
      rollupPluginDts({
        compilerOptions: { preserveSymlinks: false },
      }),
    ],
    onwarn: () => false,
  })

  await bundles.write({ file: outfile, format: 'es' })
}

export async function buildMetaFiles(outdir: string) {
  const FILES_COPY_LOCAL = ['README.md', 'LICENSE', 'index.md', 'CHANGELOG.md']
  await fs.ensureDir(outdir)
  for (const file of FILES_COPY_LOCAL) {
    const filePath = path.join(process.cwd(), file)
    if (!fs.existsSync(filePath))
      continue
    await fs.copy(filePath, path.join(process.cwd(), outdir, file))
  }

  const packageJson = getCwdPackage()
  if (packageJson && packageJson.publishConfig) {
    delete packageJson.publishConfig.directory
    Object.assign(packageJson, packageJson.publishConfig)
    delete packageJson.publishConfig
    await fs.writeJSON(path.join(outdir, 'package.json'), packageJson, { spaces: '\t' })
  }

  const modulesPath = path.join(process.cwd(), 'node_modules')
  if (fs.existsSync(modulesPath) && !fs.existsSync(path.join(outdir, 'node_modules')))
    lnk(['node_modules'], outdir)
}
