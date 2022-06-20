# ptsup

[![npm version](https://badgen.net/npm/v/ptsup)](https://npm.im/ptsup)

[tsup](https://github.com/egoist/tsup) is similar but focuses more on packet processing, powered by [esbuild](https://github.com/evanw/esbuild).


## what's the difference?

- A more casual package directory
- carry meta options
- carry assets options(.png, .html,...more)
- more universal

## ⚙️ Install

Install it locally in your project folder:

```bash
pnpm add ptsup --dev
# Or Yarn
yarn add ptsup --dev
```

You can also install it globally but it's not recommended.

## 📖 Usage

### Bundle files

```bash
ptsup [...file]
```

Files are written into `./dist`.

You can bundle multiple files in one go:

```bash
ptsup src/index.ts src/bin/bin.ts
```

This will output `dist/index.cjs.js; dist/index.esm.js` and `dist/bin.cjs.js; dist/bin.esm.js`.

> Unlike tsup, ptsup is more suitable for a single independent entry file,
> ptsup does not preserve the directory structure

### build directory

```bash
ptsup [...directory]
```

Files are written into `./dist`.

You can build dir in one go:

```
src
 - bin
   index.ts
 index.ts
```

```bash
ptsup src
```
This will output:

```
dist
 - bin
   index.js
 index.js
```

> You can build multiple directories at once, but it is recommended to use only one directory as filename duplicates will be overwritten

## carry meta

use command `--meta` It works well on some monorepo (pnpm,yarn,npm) applications

- carry package info (`LICENSE`, `README.md`, `CHANGELOG.md`)
- handle `package.publishConfig` and carry package.json
- create `node_modules` lnk file to output(default `dist`)

## Using custom configuration

Like tsup, you can use the config file to configure

Supported file formats

- `ptsup.config.ts`
- `ptsup.config.js`
- `ptsup.config.cjs`
- `ptsup.config.json`

### TypeScript / JavaScript

```ts
import { defineConfig } from 'ptsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
```

## carry assets

You can carry static resources that your project depends on

use command `--assets aaa.png,xxx.vue,assetsDir`

defines it like this in defineConfig

```ts
```ts
import { defineConfig } from 'ptsup'

export default defineConfig({
  assets: [
    'aaa.png',
    'xxx.vue',
    'assetsDir'
  ]
})
```


## command line options

```sh
Usage:
  $ ptsup [...files/directorys]

Commands:
  [...files/directorys]  Bundle files

For more info, run any command with the `--help` flag:
  $ ptsup --help

Options:
  --entry <directory|file>   Use a key-value pair as entry directory|files (default: ./)
  -r, --root <dir>           Root directory (default: .)
  -o, --outdir <outdir>      Output directory (default: dist)
  -f, --format <format>      Bundle format, "cjs", "iife", "esm" (default: cjs)
  --sourcemap [inline]       Generate external sourcemap, or inline source: --sourcemap inline
  --minify                   Minify bundles only for iife
  --target <target>          Bundle target, "es20XX" or "esnext" (default: esnext)
  --dts [entry]              Generate declaration file
                             If entry is not passed in, it will be created based on the compiled file by default
  --dts-only                 Emit declaration files only
  --global-name <name>       Global variable name for iife format (default: package.name in pascal-case)
  --clean                    Clean output directory
  --meta                     helper and carry package.json/*.md
  --assets [files]           carry some static resources
  --jsxFactory <jsxFactory>  Name of JSX factory function (default: React.createElement)
  --platform <node|browser>  platform determines the format of the output (default: node)
                             platform->node:    cjs,esm
                             platform->browser: cjs,esm,iife
  -h, --help                 Display this message
```
