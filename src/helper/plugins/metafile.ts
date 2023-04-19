import path from 'path'
import fs from 'fs-extra'
import type { Plugin } from 'esbuild'

export const metafile = (outDir: string, format?: string): Plugin => {
  return {
    name: 'write-metafile',
    setup: ({ onEnd }) => {
      onEnd(async (result) => {
        if (result.metafile) {
          const now = Date.now()
          const outPath = path.resolve(outDir, `metafile-${format || now}.json`)
          await fs.ensureDir(path.dirname(outPath))
          await fs.writeJson(
            outPath,
            result.metafile,
          )
        }
      })
    },
  }
}
