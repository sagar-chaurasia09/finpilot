"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center text-muted">Loading…</main>}>
      <AdminLogin />
    </Suspense>
  );
}

function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("admin@demo.finpilot.app");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Sign-in failed" }));
      setErr(error || "Invalid credentials");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <form onSubmit={submit} className="card w-full max-w-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/20 text-accent">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold">Admin sign in</h1>
            <p className="text-xs text-muted">Restricted area</p>
          </div>
        </div>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs text-muted">Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs text-muted">Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="admin"
          />
        </label>

        {err && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            <AlertCircle className="h-4 w-4" /> {err}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="mt-5 rounded-xl border border-border bg-bg p-3 text-xs text-muted">
          <div className="mb-1 font-semibold text-fg">Demo credentials</div>
          <div>Email: <code className="text-brand">admin@demo.finpilot.app</code></div>
          <div>Password: <code className="text-brand">admin</code></div>
        </div>
      </form>
    </main>
  );
}
