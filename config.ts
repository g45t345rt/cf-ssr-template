import { BuildOptions } from 'esbuild'
import autoprefixer from 'autoprefixer'
import stylePlugin from 'esbuild-style-plugin'
import presetEnv from 'postcss-preset-env'

type ConfigOptions = {
  extractStyle: boolean,
  env: string,
  refreshPort?: number
}

export default (options: ConfigOptions): BuildOptions => {
  const { extractStyle, env, refreshPort } = options
  const isProduction = env === 'production'
  return {
    define: {
      ['process.env.NODE_ENV']: `"${env}"`,
      ['process.env.BROWSER_REFRESH_PORT']: `${refreshPort}`
    },
    bundle: true,
    sourcemap: !isProduction ? 'inline' : false,
    logLevel: 'error',
    minify: isProduction,
    loader: {
      '.png': 'file',
      '.jpg': 'file'
    },
    plugins: [
      stylePlugin({
        extract: extractStyle,
        postcss: [
          autoprefixer,
          //presetEnv({ stage: 0 })
        ]
      })
    ]
  }
}
