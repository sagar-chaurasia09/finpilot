import { isDemoMode } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

const demoRows = [
  { name: "Raj Sharma", total: 12 },
  { name: "Neha Kapoor", total: 9 },
  { name: "Arjun Mehta", total: 7 },
  { name: "Priya Iyer", total: 5 },
  { name: "Aman Verma", total: 4 },
];

export default async function Leaderboard() {
  let rows: { name: string; total: number }[] = [];
  if (isDemoMode) {
    rows = demoRows;
  } else {
    try {
      const sb = supabaseAdmin();
      const { data } = await sb.rpc("referral_leaderboard");
      rows = (data as any[]) ?? [];
    } catch {
      rows = [];
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-muted">Top referrers this month.</p>
      </div>
      <div className="card">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="py-2 w-12">#</th><th>Name</th><th className="text-right">Referrals</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={3} className="py-8 text-center text-muted">No data yet — be the first!</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-2.5 font-semibold">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</td>
                <td>{r.name}</td>
                <td className="text-right font-semibold text-brand">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
