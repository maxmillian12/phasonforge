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

The site auto-deploys via Lovable on every change. To publish updates manually, click **Publish** in the Lovable editor.

For a custom domain, go to **Project → Settings → Domains** in Lovable.

---

## License

© Phason Engineering Works Limited. All rights reserved.
