import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[var(--ink)] px-4 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white p-8 border-l-4 border-[var(--primary)] shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 bg-[var(--primary)] flex items-center justify-center">
            <Lock className="h-6 w-6 text-[var(--ink)]" />
          </div>
          <div>
            <h1 className="font-display uppercase text-2xl font-extrabold text-[var(--ink)]">
              {mode === "signin" ? "Admin Login" : "Create Account"}
            </h1>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Phason CMS Access
            </p>
          </div>
        </div>

        {mode === "signup" && (
          <label className="block mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink)]">
              Display Name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full border border-input px-3 py-2 focus:outline-none focus:border-[var(--primary)]"
            />
          </label>
        )}

        <label className="block mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink)]">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-input px-3 py-2 focus:outline-none focus:border-[var(--primary)]"
            autoFocus
          />
        </label>

        <label className="block mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink)]">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-input px-3 py-2 focus:outline-none focus:border-[var(--primary)]"
          />
        </label>

        {error && (
          <div className="mb-4 text-sm text-destructive font-mono">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : mode === "signin"
            ? "Sign In"
            : "Create Account & Sign In"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
          }}
          className="mt-4 w-full text-sm font-mono text-muted-foreground hover:text-[var(--ink)]"
        >
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>

        <Link
          to="/"
          className="block mt-2 text-center text-xs font-mono text-muted-foreground hover:text-[var(--ink)]"
        >
          ← Back to website
        </Link>
      </form>
    </div>
  );
}
