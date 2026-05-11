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
