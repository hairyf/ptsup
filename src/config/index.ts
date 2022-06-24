export type Format = 'cjs' | 'esm' | 'iife'

export interface PtsupConfiguration {
  entry: string | string[]
  outdir: string
  platform: 'node' | 'browser'
  assets?: string[]
  root?: string
  format?: string
  sourcemap?: boolean
  splitting?: boolean
  minify?: boolean
  dts?: boolean
  globalName?: string
  clean?: boolean
  meta?: boolean
  jsxFactory?: string
}

export interface PtsupConfigurationRead extends Omit<Required<PtsupConfiguration>, 'format' | 'entry' | 'dts'> {
  entry: string[]
  format: Format[]
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
  jsxFactory: 'React.createElement',
}
