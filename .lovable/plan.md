# Netlify Migration Plan

Migrate PhasonForge from TanStack Start on Cloudflare Workers (current setup) to Netlify with SSR running on Netlify Functions. Lovable Cloud (Supabase) stays as the backend — only hosting/runtime changes.

---

## 1. Current state (what we're replacing)

- **Framework**: TanStack Start v1 + Vite 7, React 19
- **SSR runtime**: Cloudflare Workers (`wrangler.jsonc`, `@cloudflare/vite-plugin`)
- **Server entry**: `src/server.ts` wrapping `@tanstack/react-start/server-entry`
- **Server logic**: `createServerFn` (RPC) + file-based server routes under `src/routes/api/*`
- **Auth**: Supabase via `src/integrations/supabase/{client,client.server,auth-middleware}.ts`
- **Env**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, server `SUPABASE_SERVICE_ROLE_KEY`

Everything that needs to change is the **runtime adapter and host config**. Application code (routes, components, server functions, DB schema) stays.

---

## 2. Target architecture on Netlify

```text
Browser
  │
  ▼
Netlify Edge/CDN  ── static assets (Vite build output)
  │
  ▼
Netlify Function  ── single SSR handler (Node 20)
  │   wraps TanStack Start server entry
  │   handles: page SSR, /api/* routes, createServerFn RPC
  ▼
Supabase (Lovable Cloud) — unchanged
```

- One catch-all Netlify Function serves SSR + API.
- Static assets served directly from Netlify CDN.
- SPA-style fallback handled by the function (fixes refresh 404s).

---

## 3. Refactors required

### 3.1 Replace Cloudflare Workers adapter with Node SSR

- **Remove**: `wrangler.jsonc`, `@cloudflare/vite-plugin`, Workers-specific bits in `vite.config.ts`, `src/server.ts` Worker `fetch` export.
- **Add**: a Node-compatible server entry exporting a Web `fetch(request)` handler that delegates to `@tanstack/react-start/server-entry`.
- **Update** `vite.config.ts` to build SSR for `node` target instead of `webworker`. Drop `ssr.external`/`resolve.external` constraints that were Workers-only.

### 3.2 Netlify Function wrapper

Create `netlify/functions/ssr.mts`:

- Imports the built SSR handler.
- Exports a Netlify Function (v2 API: default-export async handler returning `Response`).
- Forwards the incoming `Request` to TanStack's handler, returns the `Response`.
- Wraps in try/catch with structured logging (Netlify Function logs).

### 3.3 Routing / redirects

Add `netlify.toml`:

```toml
[build]
  command = "bun run build"
  publish = "dist/client"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/ssr"
  status = 200
  force = false   # static assets win first
```

This fixes the **refresh-404 / deep-link** problem: any unmatched URL falls through to the SSR function, which renders the correct route.

### 3.4 Environment variables

Document and re-create in Netlify UI (Site settings → Environment variables):

| Var | Scope | Source |
|---|---|---|
| `VITE_SUPABASE_URL` | build + runtime | Lovable Cloud |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | build + runtime | Lovable Cloud |
| `SUPABASE_URL` | runtime (functions) | same value, no VITE_ prefix |
| `SUPABASE_PUBLISHABLE_KEY` | runtime | same |
| `SUPABASE_SERVICE_ROLE_KEY` | runtime, secret | Supabase dashboard |
| `LOVABLE_API_KEY` | runtime, secret (if AI used) | Lovable |

Add `.env.example` documenting all of the above. Real `.env` stays gitignored.

### 3.5 Server function compatibility audit

`createServerFn` and file-based `/api/*` routes work in any Web-fetch runtime. We need to verify:

- **No Cloudflare-only APIs** (`env` bindings, `caches.default`, `ExecutionContext`, KV/R2/D1) — current code doesn't use these.
- **Node built-ins** (`crypto`, `fs`, `path`) work natively on Netlify Functions (Node 20).
- **`process.env`** access keeps working — no change needed.
- **Edge-only packages** (e.g. WASM-only crypto): none currently used.

### 3.6 SSR error handling

Port the existing four-layer error handling (`src/lib/error-capture.ts`, `error-page.ts`, root `errorComponent`) into the new Node entry. The h3-swallowed-500 issue applies regardless of host.

### 3.7 GitHub → Netlify CI

- Connect repo in Netlify (Import from Git).
- Build command: `bun run build`. Publish dir: `dist/client`. Functions dir: `netlify/functions`.
- Auto-deploy on push to `main`; deploy previews on PRs.
- Optional: `[context.production.environment]` and `[context.deploy-preview.environment]` blocks in `netlify.toml` for per-context vars.

---

## 4. New / changed files

| File | Action |
|---|---|
| `netlify.toml` | new |
| `netlify/functions/ssr.mts` | new |
| `src/server.ts` | rewrite (Node fetch handler, no Worker export) |
| `vite.config.ts` | remove Cloudflare plugin, set Node SSR target |
| `wrangler.jsonc` | delete |
| `package.json` | remove `@cloudflare/vite-plugin`, `wrangler`; add `@netlify/functions` |
| `.env.example` | new — documents all vars |
| `README.md` | add "Deploy to Netlify" section |

---

## 5. Step-by-step execution

1. Branch off current code.
2. Remove Workers adapter + `wrangler.jsonc`; uninstall Cloudflare deps.
3. Rewrite `src/server.ts` as a Node Web-fetch handler.
4. Update `vite.config.ts` (SSR target = node, drop Worker plugin).
5. Add `netlify/functions/ssr.mts` wrapper.
6. Add `netlify.toml` with build + SPA-fallback redirect.
7. Add `.env.example` and update `README.md`.
8. Local verification: `bun run build` → run `netlify dev` → smoke-test `/`, `/admin/login`, a deep link refresh, a `createServerFn` call, an `/api/*` route.
9. Push to GitHub; connect repo in Netlify; set env vars; trigger first deploy.
10. Post-deploy QA: refresh on every route, admin login, WhatsApp button, 404 page, console clean, network 200s.

---

## 6. Risks & trade-offs

- **Cold starts**: Netlify Functions (Node) have higher cold-start latency than Cloudflare Workers. First request after idle ~300–800 ms.
- **Lovable Cloud preview**: The Lovable in-editor preview will no longer reflect Netlify-hosted behavior — only the deployed Netlify site will. Lovable Cloud (Supabase) backend keeps working.
- **Two-way GitHub sync** via Lovable continues to work for source code, but the deploy target is Netlify, not Lovable hosting.
- **Edge function feature parity**: any future use of Cloudflare-specific APIs (KV, Durable Objects, R2) won't be available — must use Supabase Storage / Postgres instead.
- **AI gateway**: `LOVABLE_API_KEY` still works (it's an HTTP API), no migration needed.

---

## 7. What this plan does NOT do

- Does not change DB schema, RLS, auth flows, or any UI.
- Does not migrate to a different framework (TanStack Start stays).
- Does not remove Lovable Cloud — Supabase remains the backend.
- Does not set up a custom domain (separate Netlify step once deployed).

Approve this plan and I'll execute steps 1–8 in one pass, then hand you the GitHub + Netlify connect instructions for steps 9–10.
