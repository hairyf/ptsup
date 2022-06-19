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
