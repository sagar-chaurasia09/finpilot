import { isDemoMode } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

const demoRows = [
  { id: "r1", status: "converted", reward_given: true,  flagged: false, referrer: { name: "Raj Sharma" },   referred: { name: "Priya Iyer" } },
  { id: "r2", status: "converted", reward_given: true,  flagged: false, referrer: { name: "Raj Sharma" },   referred: { name: "Aman Verma" } },
  { id: "r3", status: "pending",   reward_given: false, flagged: false, referrer: { name: "Neha Kapoor" },  referred: { name: "Vikram Singh" } },
  { id: "r4", status: "pending",   reward_given: false, flagged: true,  referrer: { name: "Arjun Mehta" },  referred: { name: "Test Account" } },
  { id: "r5", status: "voided",    reward_given: false, flagged: true,  referrer: { name: "Sneha Rao" },    referred: { name: "Duplicate IP" } },
];

export default async function AdminReferrals() {
  let rows: any[] = [];
  if (isDemoMode) rows = demoRows;
  else {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from("referrals")
      .select("*, referrer:referrer_id(name,email), referred:referred_id(name,email)")
      .order("created_at", { ascending: false });
    rows = data ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Referrals</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="py-2">Referrer</th><th>Referred</th><th>Status</th><th>Reward</th><th>Flagged</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-2.5">{r.referrer?.name}</td>
                <td>{r.referred?.name}</td>
                <td>
                  <span className={`chip ${r.status === "converted" ? "text-brand" : r.status === "voided" ? "text-red-400" : ""}`}>
                    {r.status}
                  </span>
                </td>
                <td>{r.reward_given ? "✓" : "—"}</td>
                <td>{r.flagged ? <span className="chip text-red-400">flagged</span> : "—"}</td>
                <td className="text-right space-x-1">
                  {r.flagged && <button className="chip hover:border-red-400">Void</button>}
                  <button className="chip hover:border-brand">Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
