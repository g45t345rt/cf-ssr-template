import { ConsoleLog, Miniflare } from 'miniflare'
import chokidar from 'chokidar'
import * as esbuild from 'esbuild'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import EventEmitter from 'events'
import http from 'http'

import config from './config'

const argv = yargs(hideBin(process.argv)).argv
const refreshPort = argv['refreshPort']
const env = 'development'

const bundleEmitter = new EventEmitter()

if (refreshPort) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    })

    bundleEmitter.once('reload', () => {
      res.write(`event: reload\ndata: \n\n`)
    })
  })

  server.listen(refreshPort)
}

const buildServer = () => esbuild.build({
  ...config({ extractStyle: false, env }),
  incremental: true,
  define: { global: 'true' },
  //platform: 'node',
  outdir: './dist',
  entryPoints: ['./src/server/index.ts']
})

const buildClient = () => esbuild.build({
  ...config({ extractStyle: true, env, refreshPort }),
  incremental: true,
  platform: 'browser',
  outdir: './public/dist',
  entryPoints: ['./src/client/index.tsx'],
})

const build = () => Promise.all([buildClient(), buildServer()])

const watcher = chokidar.watch('src', { ignoreInitial: true })
watcher.on('ready', async () => {
  const [clientResult, serverResult] = await build()
  console.log('Initial build complete')

  const mf = new Miniflare({
    scriptPath: './dist/index.js',
    log: new ConsoleLog(true),
    buildCommand: undefined
  })

  mf.createServer().listen(5000, '0.0.0.0', () => {
    console.log('Listening on :5000')
  })

  let watchTimeoutId
  watcher.on('change', () => {
    if (watchTimeoutId) clearTimeout(watchTimeoutId)

    const reload = async () => {
      try {
        console.log('Reloading...')

        await Promise.all([clientResult.rebuild(), serverResult.rebuild()])
        await mf.reloadOptions()
        bundleEmitter.emit('reload')

        console.log('Reload complete')
      } catch (err) {
        console.log(err)
      }
    }

    // Make sure there is not a bunch of edit at the same time
    watchTimeoutId = setTimeout(reload, 500)
  })
})