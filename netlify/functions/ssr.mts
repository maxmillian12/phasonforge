// Netlify Function (v2) — wraps the built TanStack Start SSR bundle.
//
// The Vite build (NETLIFY=true) emits dist/server/server.js as a fully
// self-contained ESM module whose default export has `.fetch(request)`.
// We import it statically so esbuild bundles it into the function output.
import type { Context } from "@netlify/functions";
// @ts-expect-error - built artifact, only present after `vite build`
import ssrHandler from "../../dist/server/server.js";

type ServerEntry = {
  fetch: (request: Request, env?: unknown, ctx?: unknown) => Promise<Response> | Response;
};

const handler = ssrHandler as ServerEntry;

export default async (request: Request, _context: Context): Promise<Response> => {
  try {
    return await handler.fetch(request);
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
