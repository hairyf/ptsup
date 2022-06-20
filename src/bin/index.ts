#!/usr/bin/env node
import { join } from 'path'
import fs from 'fs-extra'
import cac from 'cac'
import { pascalCase } from 'pascal-case'
import { isArray, isString } from 'lodash'
import type { Format } from '../config'
import { defaultConfig } from '../config'
import { getCwdPackage } from '../utils'
import { build } from '../builder'

const cli = cac('ptsup')

function ensureArray(input: string): string[] {
  return Array.isArray(input) ? input : input.split(/ |,/)
}
function toArray(value: any | any[]) {
  return Array.isArray(value) ? value : [value]
}

cli.command('[...files]', 'Bundle files', { ignoreOptionDefaultValue: true })
  .option('--entry <directory|file>', 'Use a key-value pair as entry directory|files', { default: './' })
  .option('-r, --root <dir>', 'Root directory', { default: '.' })
  .option('-o, --outdir <outdir>', 'Output directory', { default: 'dist' })
  .option('-f, --format <format>', 'Bundle format, "cjs", "iife", "esm"', { default: 'cjs' })
  .option('--sourcemap [inline]', 'Generate external sourcemap, or inline source: --sourcemap inline')
  .option('--minify', 'Minify bundles only for iife')
  .option('--target <target>', 'Bundle target, "es20XX" or "esnext"', { default: 'esnext' })
  .option('--dts [entry]', 'Generate declaration file')
  .option('--dts-only', 'Emit declaration files only')
  .option('--global-name <name>', 'Global variable name for iife format', { default: 'package.name in pascal-case' })
  .option('--clean', 'Clean output directory')
  .option('--meta', 'helper and carry package.json/*.md')
  .option('--assets [files]', 'carry some static resources')
  .option('--jsxFactory <jsxFactory>', 'Name of JSX factory function', { default: 'React.createElement' })
  .option('--platform <node|browser>', 'platform determines the format of the output', { default: 'node' })
  .action(async (files, flags) => {
    const options = Object.assign(defaultConfig, flags)

    if (files.length > 0)
      options.entry = files

    if (options.entry)
      options.entry = toArray(options.entry)

    if (flags.format)
      options.format = ensureArray(flags.format) as Format[]

    if (options.format)
      options.format = toArray(options.format)

    if (flags.assets)
      options.assets = ensureArray(flags.assets)

    const dts: any = { enable: false }

    if (options.dts) {
      if (isString(options.dts) || isArray(options.dts))
        dts.entry = ensureArray(options.dts)
      dts.enable = true
    }
    if (options.dtsOnly)
      dts.only = true

    if (!options.globalName) {
      const packageJson = await getCwdPackage()
      let name: string = packageJson?.name || ''
      name = name.replace('@', '')
      name = pascalCase(name)
      if (name)
        options.globalName = name
    }

    build(options)
  })

const pkgPath = join(__dirname, '../package.json')

if (fs.existsSync(pkgPath))
  cli.version(fs.readJSONSync(pkgPath).version)

cli.help()
cli.parse()
