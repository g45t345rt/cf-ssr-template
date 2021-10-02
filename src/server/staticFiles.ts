import { getAssetFromKV, mapRequestToAsset } from "@cloudflare/kv-asset-handler"

const customKeyModifier = (prefix) => {
  return (request) => {
    let defaultModifiedRequest = mapRequestToAsset(request)

    let url = new URL(defaultModifiedRequest.url)
    url.pathname = url.pathname.replace(prefix, '')
    return new Request(url.toString(), request)
  }
}

export default (prefix) => {
  return async (request, event) => {
    try {
      const data = await getAssetFromKV(event, { mapRequestToAsset: customKeyModifier(prefix) })
      return new Response(data.body, data)
    } catch (e) {
      // return new Response('Not Found!', { status: 404 })
      return // go to next itty route the main route is handling 404 errors
    }
  }
}
