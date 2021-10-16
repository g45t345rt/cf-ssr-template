# Cloudflare SSR web template

## Goodies

- Fast build with esbuild cache and rebuild
- Auto web browser refresh while developing
- SSR ready + server hooks
- Handle static files with `kv-asset-handler`
- Supports all popular css preprocessors with `esbuild-style-plugin`
- Server routing with `itty-router`
- KV indexing with `cf-kvprefix`

## Development

`npm run dev`

## Push to Cloudflare worker

`npm run publish`

## Examples

The template comes with reccurent logics that you might need.
You can always delete the files if you don't need it

- Auth (login, register, session user)
- Post (add, remove, edit post)
