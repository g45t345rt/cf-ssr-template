import * as mime from 'mime'
import staticContentManifest from '__STATIC_CONTENT_MANIFEST'

export default (prefix) => {
  return async (request: Request, env: EnvInterface, ctx) => {
    const cache = caches.default
    const edgeTtl = 2 * 60 * 60 * 24 // 2 days

    let manifest = JSON.parse(staticContentManifest)
    let url = new URL(request.url)
    const pathKey = url.pathname.replace(prefix, '').replace(/^\/+/, '')
    const key = manifest[pathKey] ? manifest[pathKey] : pathKey

    const cacheRequest = new Request(`${url.origin}/${key}`, request) // will cache only on custom domain and not *.worker.dev
    const cacheResponse = await cache.match(cacheRequest)
    if (cacheResponse) return cacheResponse

    const value = await env.__STATIC_CONTENT.get(key)
    if (!value) return new Response('404 Not Found', { status: 404 })

    let mimeType = mime.getType(key)
    if (mimeType.startsWith('text') || mimeType === 'application/javascript') {
      mimeType += '; charset=utf-8'
    }

    const response = new Response(value, {
      headers: {
        'Content-Type': mimeType,
        'CF-Cache-Status': 'MISS'
      }
    })

    const newCacheResponse = response.clone()
    newCacheResponse.headers.set('Cache-Control', `max-age=${edgeTtl}`)
    ctx.waitUntil(cache.put(cacheRequest, newCacheResponse))
    return response
  }
}
