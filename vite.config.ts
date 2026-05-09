// Vite config with automatic Netlify ↔ Lovable/Cloudflare branching.
//
// - On Netlify (process.env.NETLIFY === "true"): build a Node-target SSR bundle
//   using TanStack Start's vite plugin directly, with NO @cloudflare/vite-plugin.
//   The output is consumed by netlify/functions/ssr.mts.
//
// - Everywhere else (Lovable preview, local `bun run dev`, manual builds):
//   use @lovable.dev/vite-tanstack-config which bundles the Cloudflare adapter,
//   componentTagger, HMR gate, etc. — preserving the in-editor preview.
//
// No manual swap is needed: Netlify sets NETLIFY=true automatically during builds.
// (https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables)

import type { UserConfig } from "vite";

const isNetlify = process.env.NETLIFY === "true";

async function netlifyConfig(): Promise<UserConfig> {
  const { defineConfig } = await import("vite");
  const { tanstackStart } = await import("@tanstack/react-start/plugin/vite");
  const viteReact = (await import("@vitejs/plugin-react")).default;
  const tsConfigPaths = (await import("vite-tsconfig-paths")).default;
  const tailwindcss = (await import("@tailwindcss/vite")).default;

  return defineConfig({
    plugins: [
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart({
        // Same SSR error wrapper used in the Cloudflare build.
        server: { entry: "server" },
        // Node target — no Workers adapter.
        target: "node-server",
      }),
      viteReact(),
    ],
    resolve: {
      alias: { "@": "/src" },
      dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
    },
    build: {
      target: "node20",
    },
  });
}

async function lovableConfig(): Promise<UserConfig> {
  const { defineConfig } = await import("@lovable.dev/vite-tanstack-config");
  return defineConfig({
    tanstackStart: {
      server: { entry: "server" },
    },
  }) as unknown as UserConfig;
}

export default isNetlify ? netlifyConfig() : lovableConfig();
