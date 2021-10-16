import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

const customKeyModifier = (prefix) => {
  return (request) => {
    let defaultModifiedRequest = mapRequestToAsset(request)

    let url = new URL(defaultModifiedRequest.url)
    url.pathname = url.pathname.replace(prefix, '')
    return new Request(url.toString(), request)
  }
}

export default (prefix) => {
  return async (request: Request, env: EnvInterface, ctx) => {
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
