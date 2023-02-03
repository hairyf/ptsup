import path from 'path'
import type { Plugin } from 'esbuild'

export const externalize = (internal?: string[]): Plugin => {
  return {
    name: 'externalize-deps',
    setup: ({ onResolve }) => {
      onResolve({ filter: /.*/ }, (args) => {
        if (args.path[0] !== '.' && !path.isAbsolute(args.path) && !internal?.includes(args.path))
          return { external: true }
      })
    },
  }
}
