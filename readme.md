# Cloudflare SSR web template

```console
wrangler generate {your_project} https://github.com/g45t345rt/cf-ssr-template
```

## Goodies

- Fast build with esbuild cache and rebuild
- Auto web browser refresh while developing
- SSR ready + server hooks
- Supports all popular css preprocessors with `esbuild-style-plugin`
- Server routing with `itty-router`
- KV indexing with `cf-kvprefix`
- Handle static files with Cache API

## Current problem with `modules worker`

Wrangler does not export `__STATIC_CONTENT_MANIFEST` to `modules` worker.
We need the manifest to serve static files

<https://github.com/cloudflare/wrangler/issues/1938>  
<https://github.com/cloudflare/kv-asset-handler/pull/200>  

Right now I have a custom wrangler build that includes the `__STATIC_CONTENT_MANIFEST` in vars
<https://github.com/cloudflare/wrangler/pull/2114>

## Development

`npm run dev`

## Push to Cloudflare worker

`npm run deploy`

## Other features

Other features to showcase the template. A good example on how to manipulate data with KV and how to create an authentication system on a serverless infrastructure. Delete the files if you don't need it.

- Auth (login, register & session user)
- Post (add, remove & edit post)

The auth logic is using a DurableObject for locking in-memory usernames when registering. Avoid duplicate username.
