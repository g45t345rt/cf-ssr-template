import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import ittyRouter from 'itty-router'

const customKeyModifier = (prefix) => {
  return (request) => {
    let defaultModifiedRequest = mapRequestToAsset(request)

    let url = new URL(defaultModifiedRequest.url)
    url.pathname = url.pathname.replace(prefix, '')
    return new Request(url.toString(), request)
  }
}

export default (prefix) => {
  return async (request: ittyRouter.Request, event: FetchEvent) => {
    try {
      const data = await getAssetFromKV(event, { mapRequestToAsset: customKeyModifier(prefix) })
      return new Response(data.body, data)
    } catch (err) {
      console.log(err)
      // return new Response('Not Found!', { status: 404 })
      return // go to next itty route the main route is handling 404 errors
    }
  }
}
