export type Format = 'cjs' | 'esm' | 'iife'

export interface UnroilConfiguration {
  entry: string | string[]
  outdir: string
  platform: 'node' | 'browser'
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

export interface UnroilConfigurationRead extends Omit<Required<UnroilConfiguration>, 'format' | 'entry'> {
  entry: string[]
  format: Format[]
}

export const defaultConfig: UnroilConfiguration = {
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
