import { isDemoMode } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

export default async function AdminOverview() {
  let users = 0, ai = 0, refs = 0;
  if (isDemoMode) {
    users = 2847; ai = 18432; refs = 412;
  } else {
    const sb = supabaseAdmin();
    const [u, a, r] = await Promise.all([
      sb.from("users").select("*", { count: "exact", head: true }),
      sb.from("ai_calls").select("*", { count: "exact", head: true }),
      sb.from("referrals").select("*", { count: "exact", head: true }).eq("status", "converted"),
    ]);
    users = u.count ?? 0; ai = a.count ?? 0; refs = r.count ?? 0;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Overview</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Total users" value={users.toLocaleString()} />
        <Stat label="AI calls (total)" value={ai.toLocaleString()} />
        <Stat label="Converted referrals" value={refs.toLocaleString()} />
        <Stat label="Signups today" value={isDemoMode ? "47" : "—"} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-display text-lg font-semibold">Feature usage</h2>
          <ul className="space-y-2 text-sm">
            <Bar label="FD Ladder" pct={isDemoMode ? 42 : 0} />
            <Bar label="Chat" pct={isDemoMode ? 31 : 0} />
            <Bar label="Expenses" pct={isDemoMode ? 18 : 0} />
            <Bar label="Goals" pct={isDemoMode ? 9  : 0} />
          </ul>
        </div>
        <div className="card">
          <h2 className="mb-3 font-display text-lg font-semibold">Top referrers (30d)</h2>
          <ol className="space-y-2 text-sm">
            <li className="flex justify-between"><span>🥇 Raj Sharma</span><span className="text-brand">12</span></li>
            <li className="flex justify-between"><span>🥈 Neha Kapoor</span><span className="text-brand">9</span></li>
            <li className="flex justify-between"><span>🥉 Arjun Mehta</span><span className="text-brand">7</span></li>
            <li className="flex justify-between"><span>4. Priya Iyer</span><span className="text-brand">5</span></li>
            <li className="flex justify-between"><span>5. Aman Verma</span><span className="text-brand">4</span></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <li>
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="text-muted">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-border">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-brand to-accent" style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}
