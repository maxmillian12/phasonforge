import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Loader2, MinusCircle } from "lucide-react";

export const Route = createFileRoute("/admin/deploy-verify")({
  component: DeployVerify,
});

type ProbeState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "ok"; latencyMs: number; detail?: string }
  | { status: "skip"; detail: string }
  | { status: "fail"; latencyMs: number; detail: string };

type ProbeKey =
  | "homepage"
  | "deepLink"
  | "staticAsset"
  | "spaFallback"
  | "ssrFunction"
  | "health"
  | "healthChecks"
  | "corsPreflight";

const PROBE_LABELS: Record<ProbeKey, { title: string; desc: string }> = {
  homepage: {
    title: "SSR — Homepage",
    desc: "GET / returns 200 HTML from the SSR handler",
  },
  deepLink: {
    title: "SSR — Deep link refresh",
    desc: "GET /services returns 200 HTML (no 404 on refresh)",
  },
  staticAsset: {
    title: "Static asset routing",
    desc: "/favicon.ico is served from CDN, not swallowed by SSR",
  },
  spaFallback: {
    title: "SPA fallback / 404",
    desc: "Unknown URL hits SSR and renders branded 404",
  },
  ssrFunction: {
    title: "Netlify function endpoint",
    desc: "/.netlify/functions/ssr is reachable directly",
  },
  health: {
    title: "Health endpoint",
    desc: "GET /api/health responds 200 with JSON",
  },
  healthChecks: {
    title: "Health sub-checks",
    desc: "database, auth, storage all report ok",
  },
  corsPreflight: {
    title: "CORS preflight",
    desc: "OPTIONS /api/contact returns Access-Control-Allow-* headers",
  },
};

const PROBE_ORDER: ProbeKey[] = [
  "homepage",
  "deepLink",
  "staticAsset",
  "spaFallback",
  "ssrFunction",
  "health",
  "healthChecks",
  "corsPreflight",
];

function DeployVerify() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);
  const [probes, setProbes] = useState<Record<ProbeKey, ProbeState>>(() =>
    Object.fromEntries(PROBE_ORDER.map((k) => [k, { status: "idle" }])) as Record<
      ProbeKey,
      ProbeState
    >,
  );
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [host, setHost] = useState("");

  useEffect(() => {
    const u = sessionStorage.getItem("phason_admin");
    if (!u) navigate({ to: "/admin/login" });
    else setUser(u);
    if (typeof window !== "undefined") setHost(window.location.host);
  }, [navigate]);

  const setProbe = (key: ProbeKey, state: ProbeState) =>
    setProbes((prev) => ({ ...prev, [key]: state }));

  const probeFetch = useCallback(
    async (
      key: ProbeKey,
      input: string,
      init: RequestInit,
      verify: (res: Response) => Promise<string | null> | string | null,
    ) => {
      setProbe(key, { status: "running" });
      const start = Date.now();
      try {
        const res = await fetch(input, init);
        const latency = Date.now() - start;
        const failReason = await verify(res);
        if (failReason) {
          setProbe(key, { status: "fail", latencyMs: latency, detail: failReason });
        } else {
          setProbe(key, { status: "ok", latencyMs: latency });
        }
      } catch (e) {
        setProbe(key, {
          status: "fail",
          latencyMs: Date.now() - start,
          detail: e instanceof Error ? e.message : "network error",
        });
      }
    },
    [],
  );

  const runChecks = useCallback(async () => {
    setRunning(true);
    PROBE_ORDER.forEach((k) => setProbe(k, { status: "running" }));

    const isNetlify = /\.netlify\.app$/.test(window.location.host);

    // 1. SSR — homepage
    await probeFetch("homepage", "/", { method: "GET", cache: "no-store" }, (res) => {
      if (!res.ok) return `HTTP ${res.status}`;
      const ct = res.headers.get("content-type") ?? "";
      if (!ct.includes("text/html")) return `unexpected content-type: ${ct}`;
      return null;
    });

    // 2. SSR — deep link (refreshing on a non-root route must work)
    await probeFetch(
      "deepLink",
      "/services",
      { method: "GET", cache: "no-store" },
      (res) => {
        if (!res.ok) return `HTTP ${res.status} — deep-link refresh broken`;
        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("text/html")) return `unexpected content-type: ${ct}`;
        return null;
      },
    );

    // 3. Static asset routing — favicon must come from CDN, not the SSR HTML page
    await probeFetch(
      "staticAsset",
      "/favicon.ico",
      { method: "GET", cache: "no-store" },
      (res) => {
        if (!res.ok) return `HTTP ${res.status}`;
        const ct = res.headers.get("content-type") ?? "";
        if (ct.includes("text/html")) {
          return "favicon returned text/html — SSR is swallowing static assets";
        }
        return null;
      },
    );

    // 4. SPA fallback — unknown URL should hit SSR and render branded 404
    await probeFetch(
      "spaFallback",
      `/__deploy_verify_${Date.now()}`,
      { method: "GET", cache: "no-store" },
      async (res) => {
        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("text/html")) {
          return `expected HTML 404, got ${ct || "(no content-type)"}`;
        }
        const text = await res.text();
        if (text.includes('"unhandled":true') || text.startsWith("{")) {
          return "raw error JSON leaked — SSR error handler not catching";
        }
        return null;
      },
    );

    // 5. Netlify function path — only meaningful on a Netlify host
    if (isNetlify) {
      await probeFetch(
        "ssrFunction",
        "/.netlify/functions/ssr",
        { method: "GET", cache: "no-store" },
        (res) => {
          if (res.status === 404) return "function not found — check netlify.toml functions dir";
          return null;
        },
      );
    } else {
      setProbe("ssrFunction", {
        status: "skip",
        detail: "non-Netlify host — function path not applicable",
      });
    }

    // 6. /api/health (and its sub-checks)
    setProbe("health", { status: "running" });
    setProbe("healthChecks", { status: "running" });
    const healthStart = Date.now();
    try {
      const res = await fetch("/api/health", { method: "GET", cache: "no-store" });
      const latency = Date.now() - healthStart;
      const body = (await res.json().catch(() => null)) as
        | { ok: boolean; checks: { name: string; ok: boolean; detail?: string }[] }
        | null;

      if (!res.ok || !body) {
        setProbe("health", { status: "fail", latencyMs: latency, detail: `HTTP ${res.status}` });
        setProbe("healthChecks", {
          status: "fail",
          latencyMs: 0,
          detail: "health endpoint failed",
        });
      } else {
        setProbe("health", { status: "ok", latencyMs: latency });
        const failed = body.checks.filter((c) => !c.ok);
        if (failed.length === 0) {
          setProbe("healthChecks", { status: "ok", latencyMs: 0 });
        } else {
          setProbe("healthChecks", {
            status: "fail",
            latencyMs: 0,
            detail: failed
              .map((f) => `${f.name}: ${f.detail ?? "failed"}`)
              .join(" · "),
          });
        }
      }
    } catch (e) {
      const detail = e instanceof Error ? e.message : "network error";
      setProbe("health", { status: "fail", latencyMs: Date.now() - healthStart, detail });
      setProbe("healthChecks", { status: "fail", latencyMs: 0, detail });
    }

    // 7. CORS preflight on a representative API endpoint
    await probeFetch(
      "corsPreflight",
      "/api/contact",
      {
        method: "OPTIONS",
        headers: {
          Origin: window.location.origin,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "content-type",
        },
      },
      (res) => {
        if (res.status >= 400) return `HTTP ${res.status}`;
        const allowOrigin = res.headers.get("access-control-allow-origin");
        const allowMethods = res.headers.get("access-control-allow-methods");
        if (!allowOrigin) return "missing Access-Control-Allow-Origin";
        if (!allowMethods || !allowMethods.toUpperCase().includes("POST")) {
          return "POST not in Access-Control-Allow-Methods";
        }
        return null;
      },
    );

    setLastRun(new Date());
    setRunning(false);
  }, [probeFetch]);

  useEffect(() => {
    if (user) void runChecks();
  }, [user, runChecks]);

  if (!user) return null;

  const fails = PROBE_ORDER.filter((k) => probes[k].status === "fail").length;
  const oks = PROBE_ORDER.filter((k) => probes[k].status === "ok").length;
  const skips = PROBE_ORDER.filter((k) => probes[k].status === "skip").length;
  const allDone = oks + fails + skips === PROBE_ORDER.length;
  const allPass = allDone && fails === 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-muted/30">
      <div className="bg-[var(--ink)] text-white">
        <div className="container-x flex items-center justify-between py-6 flex-wrap gap-4">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-[var(--primary)] mb-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back to dashboard
            </Link>
            <h1 className="font-display uppercase text-3xl font-extrabold">
              Deploy <span className="text-[var(--primary)]">Verification</span>
            </h1>
            <p className="text-sm font-mono text-white/60 mt-1">
              Host: <span className="text-[var(--primary)]">{host || "…"}</span>
              {lastRun ? ` · last run ${lastRun.toLocaleTimeString()}` : " · running…"}
            </p>
          </div>
          <button
            onClick={() => void runChecks()}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-[var(--primary)] hover:text-[var(--primary)] font-display uppercase text-sm tracking-wider transition-colors disabled:opacity-50"
          >
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {running ? "Verifying…" : "Re-run checks"}
          </button>
        </div>
      </div>

      <div className="container-x py-10 space-y-6">
        <div
          className={`p-6 border-l-4 bg-white ${
            allPass
              ? "border-[var(--primary)]"
              : fails > 0
                ? "border-destructive"
                : "border-muted-foreground"
          }`}
        >
          <div className="font-display uppercase text-2xl font-extrabold text-[var(--ink)]">
            {!allDone
              ? "Verifying deployment…"
              : allPass
                ? "Deployment looks healthy"
                : `${fails} check${fails === 1 ? "" : "s"} failed`}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {oks} pass · {fails} fail · {skips} skipped of {PROBE_ORDER.length} total
          </p>
        </div>

        <div className="grid gap-3">
          {PROBE_ORDER.map((key) => {
            const probe = probes[key];
            const meta = PROBE_LABELS[key];
            return (
              <div
                key={key}
                className="bg-white border border-border p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <StatusIcon state={probe} />
                  <div className="min-w-0">
                    <div className="font-display uppercase text-sm tracking-wider text-[var(--ink)]">
                      {meta.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{meta.desc}</div>
                    {(probe.status === "fail" || probe.status === "skip") && (
                      <div
                        className={`text-xs mt-1 break-all ${
                          probe.status === "fail"
                            ? "text-destructive"
                            : "text-muted-foreground italic"
                        }`}
                      >
                        {probe.detail}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {probe.status === "ok" || probe.status === "fail"
                    ? probe.latencyMs > 0
                      ? `${probe.latencyMs} ms`
                      : "—"
                    : probe.status === "running"
                      ? "…"
                      : probe.status === "skip"
                        ? "skipped"
                        : ""}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          See <code>DEPLOYMENT_CHECKLIST.md</code> for the full pre/post-deploy
          verification flow.
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ state }: { state: ProbeState }) {
  if (state.status === "ok")
    return <CheckCircle2 className="h-5 w-5 text-[var(--primary)] shrink-0" />;
  if (state.status === "fail")
    return <XCircle className="h-5 w-5 text-destructive shrink-0" />;
  if (state.status === "skip")
    return <MinusCircle className="h-5 w-5 text-muted-foreground shrink-0" />;
  if (state.status === "running")
    return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />;
  return <div className="h-5 w-5 rounded-full bg-muted shrink-0" />;
}
