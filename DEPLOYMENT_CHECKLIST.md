# Netlify Deployment Checklist

Use this checklist before every production deploy. The site is **TanStack Start
+ Supabase (Lovable Cloud)** running SSR on a single Netlify Function. It does
**not** use NextAuth or Cloudinary — do not set those variables.

---

## 1. Environment variables (Site settings → Environment variables)

The codebase only reads the variables in this table. Anything else is dead
config.

| Variable | Scope | Required | Source |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Build + runtime | ✅ | Lovable Cloud |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Build + runtime | ✅ | Lovable Cloud |
| `VITE_SUPABASE_PROJECT_ID` | Build | ✅ | Lovable Cloud |
| `SUPABASE_URL` | Runtime (Functions) | ✅ | same as VITE_SUPABASE_URL |
| `SUPABASE_PUBLISHABLE_KEY` | Runtime (Functions) | ✅ | same as VITE_SUPABASE_PUBLISHABLE_KEY |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime, **secret** | ✅ | Supabase → Project Settings → API |
| `LOVABLE_API_KEY` | Runtime, secret | optional | only if AI features added later |

**Why both `VITE_*` and unprefixed copies?** `VITE_*` is inlined into the
client bundle at build time. The unprefixed copies are read by the SSR
function at runtime (`src/integrations/supabase/client.server.ts`,
`auth-middleware.ts`).

**Variables explicitly NOT used (do not add):**
- ❌ `NEXTAUTH_SECRET`, `NEXTAUTH_URL` — this is not a Next.js project
- ❌ `CLOUDINARY_URL`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — no Cloudinary integration; media goes through Supabase Storage

---

## 1b. Netlify function & route wiring (must match exactly)

The SSR pipeline depends on three pieces lining up. If any drift, deep links
404, the function fails to bundle, or static assets get swallowed by SSR.

### `netlify.toml` (project root)

```toml
[build]
  command = "bun run build"
  publish = "dist/client"          # Vite client build output
  functions = "netlify/functions"  # where Netlify discovers functions

[build.environment]
  NODE_VERSION = "20"

[functions]
  node_bundler = "esbuild"         # required: bundles dist/server/server.js into the function

# Belt-and-suspenders SPA fallback. The function ALSO declares config.path = "/*"
# (see below), so this redirect is redundant but harmless. Keep it: if the
# function config is ever removed, this still routes unmatched URLs to SSR.
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/ssr"
  status = 200
  force = false                    # static assets in dist/client win first
```

### `netlify/functions/ssr.mts`

| Aspect | Value | Why |
|---|---|---|
| File path | `netlify/functions/ssr.mts` | Filename `ssr` → function name `ssr` → invoke URL `/.netlify/functions/ssr` |
| Function name | `ssr` | Must match the redirect target in `netlify.toml` |
| Route config | `export const config = { path: "/*" }` | Netlify Functions v2 — routes every request to this handler |
| Built bundle import | `import ssrHandler from "../../dist/server/server.js"` | Static import so esbuild inlines the SSR bundle at deploy time |
| Handler shape | `default async (request, context) => Response` | Web fetch; delegates to `ssrHandler.fetch(request)` |
| Error fallback | try/catch returning branded HTML 500 | Prevents `{"unhandled":true}` JSON from leaking to users |

### Path-matching truth table

| Incoming URL | Resolved by | Notes |
|---|---|---|
| `/assets/index-abc123.js` | static (`dist/client/assets/...`) | publish dir wins; long-cached via `[[headers]]` |
| `/favicon.ico`, `/robots.txt` | static | served from `dist/client` |
| `/`, `/about`, `/services/*` | SSR function (`ssr`) | rendered by TanStack Start |
| `/api/health`, `/api/contact` | SSR function (`ssr`) | TanStack server routes inside the same handler |
| `/this-does-not-exist` | SSR function → branded 404 | matches `__root` notFoundComponent |

### Verify the wiring after a deploy

```sh
# 1. Function is discoverable
curl -sI https://YOUR-SITE.netlify.app/.netlify/functions/ssr | head -1
# Expect: HTTP/2 200 (or 405 if GET-on-POST route, never 404)

# 2. Pretty URL routes through the same function
curl -sI https://YOUR-SITE.netlify.app/services | head -1
# Expect: HTTP/2 200, content-type text/html

# 3. Static asset is NOT swallowed by SSR
curl -sI https://YOUR-SITE.netlify.app/favicon.ico | grep -i cache-control
# Expect: a long-cache header from the static layer, not text/html
```

If any of those fail, check in order: function name in `netlify.toml` redirect
matches the file at `netlify/functions/ssr.mts` → `dist/server/server.js`
exists in the build output → `node_bundler = "esbuild"` is set.

---

## 2. Pre-deploy verification (local)

Run from the project root:

```sh
# 1. Confirm a clean Netlify-target build
NETLIFY=true bun run build

# 2. Confirm the SSR bundle was emitted
ls -lh dist/server/server.js dist/client/index.html

# 3. Confirm env vars are present locally (sanity)
[ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && echo "SERVICE_ROLE: set" || echo "SERVICE_ROLE: MISSING"
```

---

## 3. Post-deploy smoke tests

Replace `YOUR-SITE.netlify.app` with the deploy URL.

| Check | URL | Expected |
|---|---|---|
| Homepage SSR | `/` | 200, full HTML, no `{"unhandled":true}` |
| Deep-link refresh | `/services`, `/contact`, `/admin/login` | 200 (SPA fallback works) |
| 404 page | `/this-does-not-exist` | branded 404 |
| Health endpoint | `/api/health` | 200 JSON, `"ok": true`, all 3 checks pass |
| Contact form | `POST /api/contact` with valid payload | 201, row inserted in `contact_messages` |
| CORS preflight | `OPTIONS /api/contact` | 204 with `Access-Control-Allow-*` headers |
| Admin status page | `/admin/status` (after login) | all probes green |

Quick health check from terminal:

```sh
curl -s https://YOUR-SITE.netlify.app/api/health | jq
```

If any `checks[].ok` is `false`, the most common cause is a missing
`SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_URL` in Netlify env vars.

---

## 4. Common failure → fix

| Symptom | Likely cause | Fix |
|---|---|---|
| `/api/health` returns `auth: false` or `database: false` | `SUPABASE_SERVICE_ROLE_KEY` missing/wrong | re-paste from Supabase dashboard |
| Pages render but Supabase queries fail in browser | `VITE_SUPABASE_*` not set at **build** time | add vars, then **trigger a new deploy** (Vite inlines at build) |
| 404 on refresh of any non-root route | SPA fallback redirect missing | confirm `netlify.toml` `[[redirects]]` block intact |
| `{"status":500,"unhandled":true}` JSON in browser | stale build before SSR error wrapper | redeploy; should now show branded fallback |
| Function cold-start timeout | first request after long idle | normal — second request is fast |

---

## 5. Sign-off

Before announcing the deploy is live, confirm all of these:

- [ ] All 6 required env vars set in Netlify (production context)
- [ ] `NETLIFY=true bun run build` succeeds locally
- [ ] Latest commit deployed (check Netlify deploy log timestamp)
- [ ] `/api/health` returns `"ok": true`
- [ ] Homepage, one deep link, and 404 all render correctly
- [ ] Contact form submits and row appears in `contact_messages`
- [ ] `/admin/login` reachable; admin can sign in and reach `/admin/status`
- [ ] No console errors on homepage (browser devtools)
