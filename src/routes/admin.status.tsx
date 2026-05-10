import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/status")({
  component: AdminStatus,
});

type ProbeState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "ok"; latencyMs: number; detail?: string }
  | { status: "fail"; latencyMs: number; detail: string };

type ProbeKey = "health" | "database" | "auth" | "storage" | "contact";

const PROBE_LABELS: Record<ProbeKey, { title: string; desc: string }> = {
  health: { title: "Health endpoint", desc: "GET /api/health responds 200" },
  database: { title: "Database", desc: "Reads from contact_messages table" },
  auth: { title: "Authentication", desc: "Auth admin API reachable" },
  storage: { title: "Media storage", desc: "Storage buckets list" },
  contact: { title: "Contact form API", desc: "POST /api/contact accepts submissions" },
};

const PROBE_ORDER: ProbeKey[] = ["health", "database", "auth", "storage", "contact"];

function AdminStatus() {
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

  useEffect(() => {
    const u = sessionStorage.getItem("phason_admin");
    if (!u) navigate({ to: "/admin/login" });
    else setUser(u);
  }, [navigate]);

  const setProbe = (key: ProbeKey, state: ProbeState) =>
    setProbes((prev) => ({ ...prev, [key]: state }));

  const runChecks = useCallback(async () => {
    setRunning(true);
    PROBE_ORDER.forEach((k) => setProbe(k, { status: "running" }));

    // 1. /api/health (also exposes per-service checks)
    const healthStart = Date.now();
    try {
      const res = await fetch("/api/health", { method: "GET" });
      const latency = Date.now() - healthStart;
      const body = (await res.json().catch(() => null)) as
        | { ok: boolean; checks: { name: string; ok: boolean; detail?: string }[] }
        | null;

      if (!res.ok || !body) {
        setProbe("health", { status: "fail", latencyMs: latency, detail: `HTTP ${res.status}` });
        ["database", "auth", "storage"].forEach((k) =>
          setProbe(k as ProbeKey, {
            status: "fail",
            latencyMs: 0,
            detail: "health endpoint failed",
          }),
        );
      } else {
        setProbe("health", {
          status: body.ok ? "ok" : "fail",
          latencyMs: latency,
          detail: body.ok ? undefined : "one or more checks failed",
        });
        for (const c of body.checks) {
          if (PROBE_ORDER.includes(c.name as ProbeKey)) {
            setProbe(c.name as ProbeKey, {
              status: c.ok ? "ok" : "fail",
              latencyMs: 0,
              detail: c.detail,
            });
          }
        }
      }
    } catch (e) {
      const detail = e instanceof Error ? e.message : "network error";
      setProbe("health", { status: "fail", latencyMs: Date.now() - healthStart, detail });
      ["database", "auth", "storage"].forEach((k) =>
        setProbe(k as ProbeKey, { status: "fail", latencyMs: 0, detail }),
      );
    }

    // 2. /api/contact — send a benign payload that triggers the honeypot
    //    (website field non-empty) so we don't pollute real submissions.
    const contactStart = Date.now();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Status probe",
          email: "probe@example.com",
          subject: "probe",
          message: "Automated status check — please ignore.",
          website: "https://probe.invalid", // honeypot triggers 200 with no insert
        }),
      });
      const latency = Date.now() - contactStart;
      if (res.ok) {
        setProbe("contact", { status: "ok", latencyMs: latency });
      } else {
        setProbe("contact", {
          status: "fail",
          latencyMs: latency,
          detail: `HTTP ${res.status}`,
        });
      }
    } catch (e) {
      setProbe("contact", {
        status: "fail",
        latencyMs: Date.now() - contactStart,
        detail: e instanceof Error ? e.message : "network error",
      });
    }

    setLastRun(new Date());
    setRunning(false);
  }, []);

  useEffect(() => {
    if (user) void runChecks();
  }, [user, runChecks]);

  if (!user) return null;

  const allOk = PROBE_ORDER.every((k) => probes[k].status === "ok");
  const anyFail = PROBE_ORDER.some((k) => probes[k].status === "fail");

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
              System <span className="text-[var(--primary)]">Status</span>
            </h1>
            <p className="text-sm font-mono text-white/60 mt-1">
              {lastRun
                ? `Last checked ${lastRun.toLocaleTimeString()}`
                : "Running first check…"}
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
            {running ? "Checking…" : "Re-run checks"}
          </button>
        </div>
      </div>

      <div className="container-x py-10 space-y-6">
        <div
          className={`p-6 border-l-4 bg-white ${
            allOk
              ? "border-[var(--primary)]"
              : anyFail
                ? "border-destructive"
                : "border-muted-foreground"
          }`}
        >
          <div className="font-display uppercase text-2xl font-extrabold text-[var(--ink)]">
            {allOk
              ? "All systems operational"
              : anyFail
                ? "Some checks failed"
                : "Running checks…"}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Forms, authentication, database and media storage are probed below.
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
                    {probe.status === "fail" && (
                      <div className="text-xs text-destructive mt-1 break-all">
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
                      : ""}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          Endpoint:{" "}
          <a href="/api/health" className="underline hover:text-[var(--ink)]">
            /api/health
          </a>{" "}
          · Returns JSON for external uptime monitors.
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
  if (state.status === "running")
    return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />;
  return <div className="h-5 w-5 rounded-full bg-muted shrink-0" />;
}
