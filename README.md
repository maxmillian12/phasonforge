# Phason Engineering Works Limited — Website

Production website for **Phason Engineering Works Limited**, a civil, electrical, and building contracting company based in Dar es Salaam, Tanzania.

🌐 **Live site:** https://phasonforge.lovable.app

---

## About the Company

Phason Engineering Works Limited delivers civil, electrical, mechanical, and building construction services across Tanzania, plus agricultural and industrial supplies.

**Core values:** Integrity & Honesty · Innovation · Quality & Excellence · Professionalism

**Services:**
- Road & highway construction
- Building construction (residential, commercial, institutional)
- Water infrastructure (boreholes, pipelines, culverts)
- Electrical & mechanical installations
- Land surveying & quantity surveying
- Agricultural and industrial supplies

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) v1 (React 19 + SSR)
- **Build tool:** Vite 7
- **Styling:** Tailwind CSS v4 + custom design tokens (`src/styles.css`)
- **UI primitives:** shadcn/ui (Radix)
- **Routing:** TanStack Router (file-based, in `src/routes/`)
- **Typography:** Barlow Condensed + Inter
- **Deployment:** Cloudflare Workers (via Lovable)

---

## Project Structure

```
src/
├── assets/              # Brand imagery (hero, projects, logo)
├── components/
│   ├── site/            # Navbar, Footer, PageHero, Counter, WhatsAppButton
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── content.ts       # Services, projects, personnel data
│   └── site.ts          # Site metadata
├── routes/              # File-based routes
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Homepage
│   ├── about.tsx
│   ├── services.index.tsx
│   ├── services.$slug.tsx
│   ├── projects.tsx
│   ├── agricultural-supplies.tsx
│   ├── blog.index.tsx
│   ├── blog.$slug.tsx
│   ├── contact.tsx
│   └── faq.tsx
└── styles.css           # Design tokens (Lime & Ink theme)
```

---

## Local Development

```sh
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```

The dev server runs at `http://localhost:5173`.

---

## Editing the Site

### Via Lovable (recommended)
Open the [Lovable project](https://lovable.dev) and prompt changes in chat. Edits sync automatically.

### Via your IDE
Clone the repo, edit locally, and push to GitHub. Changes sync back to Lovable.

### Via GitHub directly
Edit files in the GitHub UI and commit.

---

## Content Editing

Most editable content lives in **`src/lib/content.ts`** — services, projects, personnel, equipment, blog posts. Update arrays there and the site reflects changes immediately.

Site-wide metadata (company name, contact info, social links) lives in **`src/lib/site.ts`**.

---

## Design System

The site uses a custom **"Lime & Ink"** theme with semantic design tokens defined in `src/styles.css`. Always use tokens (e.g. `bg-primary`, `text-ink`) instead of raw colors.

---

## Deployment

### Option A — Lovable (default, zero config)

The site auto-deploys via Lovable on every change. To publish updates manually, click **Publish** in the Lovable editor. For a custom domain, go to **Project → Settings → Domains** in Lovable.

This runs on Cloudflare Workers via `@lovable.dev/vite-tanstack-config`.

### Option B — Netlify (GitHub-driven)

The repo is pre-configured for Netlify. Files involved:

- `netlify.toml` — build command, publish dir, SPA-fallback redirect, security headers, asset caching
- `netlify/functions/ssr.mts` — single SSR function that wraps TanStack Start's server entry; serves all unmatched routes (fixes 404-on-refresh)
- `.env.example` — every variable Netlify needs

#### One-time setup

1. **Push to GitHub** — connect the repo via Lovable (Plus → GitHub → Connect project) or push manually.
2. **Create a Netlify site** — "Import from Git" → pick the repo. Netlify auto-detects `netlify.toml`.
3. **Set env vars** in Site settings → Environment variables (copy from `.env.example`):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (build + runtime)
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (runtime, secret)
4. **Build adapter swap** (required for Netlify Functions to actually serve SSR):
   In `vite.config.ts`, the build currently targets Cloudflare Workers via the Lovable config. For Netlify Node SSR, replace the export with a plain TanStack Start + Vite config that targets Node (no `@cloudflare/vite-plugin`). Keep the Cloudflare config on a separate branch (e.g. `lovable`) so the in-editor preview keeps working — Netlify only builds the `main` branch.
5. **Deploy** — push to `main`. Netlify builds, uploads `dist/client` to the CDN, and deploys `netlify/functions/ssr.mts`.

#### What this gives you

- ✅ One-click deploy on every GitHub push
- ✅ Deep links and refreshes work (SPA fallback → SSR function)
- ✅ All routes SSR'd by the same function (no per-route config)
- ✅ Static assets long-cached at the edge
- ✅ Security headers (X-Frame-Options, nosniff, Referrer-Policy)
- ✅ Deploy previews on every PR
- ✅ Custom domain via Site settings → Domain management

#### Trade-offs

- Netlify Function cold starts (~300–800 ms after idle) vs Cloudflare's near-zero cold start
- The Lovable in-editor preview still uses Cloudflare; only the deployed Netlify site reflects Netlify behavior
- Lovable Cloud (Supabase) backend works identically on either host

---

## License

© Phason Engineering Works Limited. All rights reserved.
