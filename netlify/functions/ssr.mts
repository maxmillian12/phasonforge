// Netlify Function (v2) — wraps TanStack Start's SSR handler for Node runtime.
//
// IMPORTANT: For this to actually be invoked on Netlify, the project must be
// built WITHOUT the Cloudflare Workers adapter so the SSR bundle targets Node.
// See README → "Deploy to Netlify" for the one-time vite.config.ts swap.
import type { Context } from "@netlify/functions";

type ServerEntry = {
  fetch: (request: Request, env?: unknown, ctx?: unknown) => Promise<Response> | Response;
};

let entryPromise: Promise<ServerEntry> | undefined;

async function getEntry(): Promise<ServerEntry> {
  if (!entryPromise) {
    // The TanStack Start build emits this virtual module as the SSR entry.
    entryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return entryPromise;
}

export default async (request: Request, _context: Context): Promise<Response> => {
  try {
    const entry = await getEntry();
    return await entry.fetch(request);
  } catch (error) {
    console.error("[ssr] unhandled error:", error);
    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Something went wrong</title>
       <body style="font-family:system-ui;padding:2rem">
         <h1>Something went wrong</h1>
         <p>Please refresh the page or return to the home page.</p>
         <a href="/">Go home</a>
       </body>`,
      { status: 500, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }
};

export const config = {
  path: "/*",
};
