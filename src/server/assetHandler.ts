import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import * as mime from 'mime'

export default (prefix) => {
  return async (request: Request, env: EnvInterface, ctx) => {
    let manifest = {}
    if (env.__STATIC_CONTENT_MANIFEST) manifest = env.__STATIC_CONTENT_MANIFEST
    else {
      // HACK - I HAVE TO HARDCODE MANIFEST EVERYTIME I DEPLOY :[
      // https://github.com/cloudflare/kv-asset-handler/issues/174
      manifest = {
        'dist/index.js': 'dist/index.5e68df1107.js',
        'dist/index.css': 'dist/index.cb912a34d1.css'
      }
    }

    let url = new URL(request.url)
    const pathKey = url.pathname.replace(prefix, '').replace(/^\/+/, '')

    console.log(pathKey)
    const key = manifest[pathKey] ? manifest[pathKey] : pathKey
    console.log(key)
    const value = await env.__STATIC_CONTENT.get(key, { cacheTtl: 31536000 }) // it's okay to one year cache here because if the file data is changed the name id changes

    let mimeType = mime.getType(key)
    if (mimeType.startsWith('text') || mimeType === 'application/javascript') {
      mimeType += '; charset=utf-8'
    }

    return new Response(value, {
      headers: {
        'Content-Type': mimeType
      }
    })
  }
}
