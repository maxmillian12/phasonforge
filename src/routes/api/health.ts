// Public health endpoint — GET /api/health
// Returns overall status + per-check details. Always returns HTTP 200 with a
// JSON body so monitoring tools and the admin status page can read the
// `ok` flag instead of dealing with mixed status codes.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { corsHeaders, jsonResponse, preflight, safeHandler } from "@/lib/api";

type CheckResult = {
  name: string;
  ok: boolean;
  latencyMs: number;
  detail?: string;
};

async function timed<T>(name: string, fn: () => Promise<T>): Promise<CheckResult> {
  const start = Date.now();
  try {
    await fn();
    return { name, ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    return {
      name,
      ok: false,
      latencyMs: Date.now() - start,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => preflight(request),

      GET: safeHandler(async ({ request }) => {
        const checks: CheckResult[] = [];

        // 1. Database — light count query against a known table.
        checks.push(
          await timed("database", async () => {
            const { error } = await supabaseAdmin
              .from("contact_messages")
              .select("id", { count: "exact", head: true });
            if (error) throw new Error(error.message);
          }),
        );

        // 2. Auth service — list a single user (admin scope).
        checks.push(
          await timed("auth", async () => {
            const { error } = await supabaseAdmin.auth.admin.listUsers({
              page: 1,
              perPage: 1,
            });
            if (error) throw new Error(error.message);
          }),
        );

        // 3. Storage — list buckets (works even if none exist).
        checks.push(
          await timed("storage", async () => {
            const { error } = await supabaseAdmin.storage.listBuckets();
            if (error) throw new Error(error.message);
          }),
        );

        const ok = checks.every((c) => c.ok);

        return jsonResponse(
          {
            ok,
            status: ok ? "healthy" : "degraded",
            timestamp: new Date().toISOString(),
            uptimeHint: "stateless",
            checks,
          },
          {
            request,
            headers: { "Cache-Control": "no-store" },
            // Keep status 200 even when degraded so simple uptime pings can
            // distinguish "service responded" from "service is down".
            status: 200,
          },
        );
      }),
    },
  },
});

// Re-export for tree-shaking friendliness — corsHeaders consumed only by safeHandler.
void corsHeaders;
