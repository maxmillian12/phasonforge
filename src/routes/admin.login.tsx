import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Enter a username");
      return;
    }
    if (password !== "1122") {
      setError("Invalid password");
      return;
    }
    sessionStorage.setItem("phason_admin", username.trim());
    navigate({ to: "/admin" });
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
              Admin Login
            </h1>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Phason CMS Access
            </p>
          </div>
        </div>

        <label className="block mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink)]">
            Username
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-input px-3 py-2 focus:outline-none focus:border-[var(--primary)]"
          />
        </label>

        {error && (
          <div className="mb-4 text-sm text-destructive font-mono">{error}</div>
        )}

        <button type="submit" className="btn-primary w-full justify-center">
          Sign In
        </button>
      </form>
    </div>
  );
}
