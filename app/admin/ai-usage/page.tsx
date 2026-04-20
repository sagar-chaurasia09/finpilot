import { isDemoMode } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

const demoLogs = [
  { id: "1", feature: "chat",     tokens_in: 842, tokens_out: 312, cost_usd: 0.00721, status: "ok",           created_at: "2026-04-19T14:32:00Z", users: { email: "raj@demo.finpilot.app" } },
  { id: "2", feature: "ladder",   tokens_in: 1204, tokens_out: 421, cost_usd: 0.00993, status: "ok",           created_at: "2026-04-19T14:18:00Z", users: { email: "priya@demo.finpilot.app" } },
  { id: "3", feature: "insights", tokens_in: 620, tokens_out: 195, cost_usd: 0.00479, status: "ok",           created_at: "2026-04-19T13:55:00Z", users: { email: "neha@demo.finpilot.app" } },
  { id: "4", feature: "chat",     tokens_in: 890, tokens_out: 340, cost_usd: 0.00777, status: "rate_limited", created_at: "2026-04-19T13:40:00Z", users: { email: "arjun@demo.finpilot.app" } },
  { id: "5", feature: "ladder",   tokens_in: 1150, tokens_out: 498, cost_usd: 0.01092, status: "ok",           created_at: "2026-04-19T13:22:00Z", users: { email: "aman@demo.finpilot.app" } },
  { id: "6", feature: "chat",     tokens_in: 760, tokens_out: 280, cost_usd: 0.00648, status: "ok",           created_at: "2026-04-19T12:58:00Z", users: { email: "raj@demo.finpilot.app" } },
];

export default async function AdminAiUsage() {
  let rows: any[] = [];
  if (isDemoMode) rows = demoLogs;
  else {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from("ai_calls")
      .select("*, users:user_id(name,email)")
      .order("created_at", { ascending: false })
      .limit(100);
    rows = data ?? [];
  }
  const totalCost = rows.reduce((s, r: any) => s + +r.cost_usd, 0);
  const rateLimited = rows.filter((r: any) => r.status === "rate_limited").length;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">AI Usage</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><div className="text-xs text-muted">Calls (recent)</div><div className="mt-2 text-3xl font-semibold">{rows.length}</div></div>
        <div className="card"><div className="text-xs text-muted">Cost (USD)</div><div className="mt-2 text-3xl font-semibold">${totalCost.toFixed(3)}</div></div>
        <div className="card"><div className="text-xs text-muted">Rate limited</div><div className="mt-2 text-3xl font-semibold text-red-400">{rateLimited}</div></div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="py-2">User</th><th>Feature</th><th>Tokens in/out</th><th>Cost</th><th>Status</th><th>At</th></tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-2.5">{r.users?.email ?? "—"}</td>
                <td><span className="chip">{r.feature}</span></td>
                <td className="text-muted">{r.tokens_in}/{r.tokens_out}</td>
                <td>${(+r.cost_usd).toFixed(4)}</td>
                <td>
                  <span className={`chip ${r.status === "rate_limited" ? "text-red-400" : "text-brand"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="text-xs text-muted">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
