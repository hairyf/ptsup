import path from 'path'
import { rollup } from 'rollup'
import rollupPluginDts from 'rollup-plugin-dts'

export async function buildDeclaration(input: string, outfile: string) {
  const bundles = await rollup({
    input,
    plugins: [
      rollupPluginDts({ compilerOptions: { preserveSymlinks: false } }),
    ],
    onwarn: () => false,
  })
  await bundles.write({ file: outfile, format: 'es' })
}

export interface BuildDeclarationsOptions {
  root?: string
  outdir: string
  bundle?: boolean
}
export async function buildDeclarations(inputs: string[], options: BuildDeclarationsOptions) {
  if (options.bundle) {
    for (const baseInput of inputs) {
      const input = options.root ? path.join(options.root, baseInput) : baseInput
      const outfile = path.join(options.outdir, baseInput).replace('.ts', '.d.ts')
      await buildDeclaration(input, outfile)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ts = require('typescript')
  const compilerOptions = {
    allowJs: true,
    declaration: true,
    incremental: true,
    skipLibCheck: true,
    emitDeclarationOnly: true,
    outDir: options.outdir,
  }
  const tsHost = ts.createCompilerHost!(compilerOptions)
  const program = ts.createProgram!(inputs, compilerOptions, tsHost)
  await program.emit()
}
