import * as esbuild from 'esbuild'
import config from './config'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv)).argv
const env = argv['env'] || 'development'

const buildServer = esbuild.build({
  ...config({ extractStyle: false, env }),
  define: { global: 'true' },
  //platform: 'node',
  outdir: './dist',
  entryPoints: ['./src/server/index.ts']
})

const buildClient = esbuild.build({
  ...config({ extractStyle: true, env }),
  platform: 'browser',
  outdir: './public/dist',
  entryPoints: ['./src/client/index.tsx'],
})

Promise.all([buildClient, buildServer])
