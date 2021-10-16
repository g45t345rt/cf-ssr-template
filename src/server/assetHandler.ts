import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import * as mime from 'mime'

export default (prefix) => {
  return async (request: Request, env: EnvInterface, ctx) => {
    let manifest = {}
    if (env.__STATIC_CONTENT_MANIFEST) manifest = env.__STATIC_CONTENT_MANIFEST
    else {
      // hack
      // https://github.com/cloudflare/kv-asset-handler/issues/174
      manifest = {
        'dist/index.js': 'dist/index.2543e3f7f6.js',
        'dist/index.css': 'dist/index.a4afb937e9.css'
      }
    }

    let url = new URL(request.url)
    const pathKey = url.pathname.replace(prefix, '').replace(/^\/+/, '')

    console.log(pathKey)
    const key = manifest[pathKey] ? manifest[pathKey] : pathKey
    console.log(key)
    const value = await env.__STATIC_CONTENT.get(key)

    let mimeType = mime.getType(key)
    if (mimeType.startsWith('text') || mimeType === 'application/javascript') {
      mimeType += '; charset=utf-8'
    }

    return new Response(value, {
      headers: {
        'Content-Type': mimeType
      }
    })

    // https://github.com/cloudflare/wrangler/pull/1973
    // https://github.com/cloudflare/kv-asset-handler/issues/174
    const test = await env.__STATIC_CONTENT.get('dist/index.a4afb937e9.css')
    console.log(test)
    try {
      const data = await getAssetFromKV({ request, waitUntil: ctx.waitUntil } as FetchEvent, {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: {
          'dist/index.js': 'dist/index.7395cc178b.js',
          'dist/index.css': 'dist/index.a4afb937e9.css'
        },
        mapRequestToAsset: customKeyModifier(prefix)
      })
      return new Response(data.body, data)
    } catch (err) {
      console.log(err)
      return new Response('Not Found!', { status: 404 })
      //return // go to next itty route the main route is handling 404 errors
    }
  }
}
