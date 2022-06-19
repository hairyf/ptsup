export type Format = 'cjs' | 'esm' | 'iife'

export interface PtsupConfiguration {
  entry: string | string[]
  outdir: string
  platform: 'node' | 'browser'
  root?: string
  format?: string
  sourcemap?: boolean
  minify?: boolean
  dts?: boolean
  // dtsOnly?: boolean
  globalName?: string
  clean?: boolean
  meta?: boolean
  jsxFactory?: string
}

export interface PtsupConfigurationRead extends Omit<Required<PtsupConfiguration>, 'format' | 'entry'> {
  entry: string[]
  format: Format[]
}

export const defaultConfig: PtsupConfiguration = {
  entry: './',
  outdir: 'dist',
  platform: 'node',
  sourcemap: false,
  minify: false,
  dts: false,

  // dtsOnly: false,
  clean: false,
  jsxFactory: 'React.createElement',
}
