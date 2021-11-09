# Cloudflare SSR web template

```console
wrangler generate {your_project} https://github.com/g45t345rt/cf-ssr-template
```

## Goodies

- Latest of `React` with useful hooks
- Fast rebuild with `esbuild` caching
- Auto web browser refresh while developing
- Server side rendering ready - SSR
- Supports all popular css preprocessors (sass, stylus, less) with `esbuild-style-plugin`
- Server routing with `itty-router`
- KV indexing with `cf-kvprefix`
- Custom static files handler with Cache API (instead of kv-asset-handler that does seem to work on modules worker)

## Current problem with `modules worker`

Wrangler does not export `__STATIC_CONTENT_MANIFEST` to `modules` worker.
We need the manifest to serve static files

<https://github.com/cloudflare/wrangler/issues/1938>  
<https://github.com/cloudflare/kv-asset-handler/pull/200>  

~~Right now I have a custom wrangler build that includes the `__STATIC_CONTENT_MANIFEST` in vars
<https://github.com/cloudflare/wrangler/pull/2114>`~~

The upcoming wrangler release will import the manifest
`import manifest from '__STATIC_CONTENT_MANIFEST'`

<https://github.com/cloudflare/wrangler/pull/2126>

## Development

`npm run dev`

## Push to Cloudflare worker

`npm run deploy`

## Comes with default features

- Auth (login, register & session user) - authentication system on a serverless infrastructure
- Post (add, remove & edit post) - Simple data entry

You can always remove the features by deleting the appropriate folders.  

The auth logic is using a DurableObject for in-memory locking of usernames when registering.  
Avoid simultaneous registration with the same username!
