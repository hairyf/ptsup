import path from 'path'
import fs from 'fs-extra'
import lnk from 'lnk'

export async function getCwdPackage(cwd = process.cwd()) {
  const pkgPath = (path.join(cwd, 'package.json'))
  if (!fs.existsSync(pkgPath))
    return
  return fs.readJSONSync(pkgPath)
}

export async function buildMeta(outdir: string) {
  await buildAssets(process.cwd(), outdir, ['README.md', 'LICENSE', 'CHANGELOG.md'])

  await buildPackageJson(outdir)

  await buildModulesLnk(outdir)
}

export async function buildAssets(root: string, outdir: string, files: string[]) {
  for (const asset of files) {
    const assetPath = path.join(root, asset)
    if (!fs.existsSync(assetPath))
      continue
    await fs.copy(assetPath, path.join(outdir, asset))
  }
}

export async function buildPackageJson(outdir: string) {
  const packageJson = await getCwdPackage()

  if (packageJson && packageJson.publishConfig) {
    delete packageJson.publishConfig.directory
    Object.assign(packageJson, packageJson.publishConfig)
    delete packageJson.publishConfig
    await fs.writeJSON(path.join(outdir, 'package.json'), packageJson, { spaces: '\t' })
  }
}

export async function buildModulesLnk(outdir: string) {
  if (fs.existsSync('node_modules')) {
    await fs.remove(path.join(outdir, 'node_modules'))
    await lnk(['node_modules'], outdir)
  }
}

export function toArray(value: any | any[]) {
  return Array.isArray(value) ? value : [value]
}
