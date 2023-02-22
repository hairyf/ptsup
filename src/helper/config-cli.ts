import isString from 'lodash/isString'
import isArray from 'lodash/isArray'

import { pascalCase } from 'pascal-case'
import type { Format } from '../config'
import { defaultConfig } from '../config'
import { getCwdPackage, toArray } from '../utils'

export async function helperConfigCli(files: any, flags: any) {
  const options = Object.assign(defaultConfig, flags)

  if (files.length > 0)
    options.entry = files

  if (options.entry)
    options.entry = toArray(options.entry)

  if (options.format)
    options.format = ensureArray(flags.format) as Format[]

  if (options.format)
    options.format = toArray(options.format)

  if (options.assets)
    options.assets = ensureArray(flags.assets)

  if (options.external)
    options.external = options.external === true ? [] : ensureArray(options.external)

  if (options.internal)
    options.internal = options.internal === true ? [] : ensureArray(options.internal)

  const dts: any = { enable: false }

  if (options.dts) {
    if (isString(options.dts) || isArray(options.dts))
      dts.entry = ensureArray(options.dts)
    dts.enable = true
  }
  if (options.dtsOnly)
    dts.only = true

  options.dts = dts

  if (!options.globalName) {
    const packageJson = await getCwdPackage()
    let name: string = packageJson?.name || ''
    name = name.replace('@', '')
    name = pascalCase(name)
    if (name)
      options.globalName = name
  }

  return options
}

function ensureArray(input: string): string[] {
  return Array.isArray(input) ? input : input.split(/ |,/)
}
