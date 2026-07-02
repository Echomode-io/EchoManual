# EchoMode Docs

Source for [developers.echomode.io](https://developers.echomode.io).

## Structure

| Path | Purpose |
|------|---------|
| `docs/index.md` | Landing page |
| `docs/manual/*.md` | Product guide (user manual) |
| `docs/api/*.md` | API reference |
| `.vitepress/config.ts` | Site config (nav, sidebar) |
| `.vitepress/theme/` | Custom theme (EchoMode branding) |
| `scripts/sync-docs.mjs` | Copies `docs/` into `content/` for VitePress |

## Local preview

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```
