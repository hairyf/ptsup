import type esbuild from 'esbuild'

export type Format = 'cjs' | 'esm' | 'iife'

export interface PtsupConfiguration {
  entry: string | string[]
  outdir: string
  platform: 'node' | 'browser'
  assets?: string[]
  root?: string
  sourcemap?: boolean
  splitting?: boolean
  minify?: boolean
  dts?: boolean
  globalName?: string
  clean?: boolean
  target?: string
  format?: string
  external?: string[]
  internal?: string[]
  meta?: boolean
  metaOnly?: boolean
  metafile?: boolean
  jsxFactory?: string
  esbuild?: esbuild.BuildOptions
  watch?: boolean
}

export interface PtsupConfigurationRead extends Omit<Required<PtsupConfiguration>, 'format' | 'entry' | 'dts'> {
  entry: string[]
  format: Format | Format[]
  dts: {
    enable?: boolean
    only?: boolean
    entry?: string[]
  }
}

export const defaultConfig: PtsupConfiguration = {
  entry: './',
  outdir: 'dist',
  platform: 'node',
  sourcemap: false,
  minify: false,
  dts: false,
  clean: false,
  metafile: false,
  jsxFactory: 'React.createElement',
}
