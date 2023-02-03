#!/usr/bin/env node
import { join } from 'path'
import fs from 'fs-extra'
import cac from 'cac'
import { build } from '../builder'
import { helperConfigCli } from '../helper/config-cli'

const cli = cac('ptsup')

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
  .option('--external [module]', 'Using external will turn off automatic ignoring of dependencies')
  .option('--internal [module]', 'Using internal will turn off automatic ignoring of dependencies')
  .option('--global-name <name>', 'Global variable name for iife format', { default: 'package.name in pascal-case' })
  .option('--clean', 'Clean output directory')
  .option('--watch', 'Whether to continuously monitor entry changes')
  .option('--splitting', 'Enables esbuild "code splitting", enable cast to esm module')
  .option('--meta', 'Helper and carry package.json/*.md')
  .option('--meta-only', 'Emit meta files only')
  .option('--assets [files]', 'Carry some static resources')
  .option('--jsxFactory <jsxFactory>', 'Name of JSX factory function', { default: 'React.createElement' })
  .option('--platform <node|browser>', 'Platform determines the format of the output', { default: 'node' })
  .action(async (files, flags) => {
    build(await helperConfigCli(files, flags))
  })

const pkgPath = join(__dirname, '../package.json')

if (fs.existsSync(pkgPath))
  cli.version(fs.readJSONSync(pkgPath).version)

cli.help()
cli.parse()
