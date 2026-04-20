import { isDemoMode, demoFDRates } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

export default async function AdminContent() {
  let rates: any[] = [];
  if (isDemoMode) {
    rates = demoFDRates.map((r, i) => ({
      id: `d${i}`, tenure_months: r.tenure_months,
      rate_general: r.rate_general, rate_senior: r.rate_senior,
      banks: { name: r.bank },
    }));
  } else {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from("fd_rates")
      .select("id, tenure_months, rate_general, rate_senior, banks(name)")
      .order("rate_general", { ascending: false });
    rates = data ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">FD Rates</h1>
      <p className="text-sm text-muted">Inline editing — wire row inputs to PATCH /api/admin/rates.</p>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="py-2">Bank</th><th>Tenure</th><th className="text-right">General</th><th className="text-right">Senior</th><th></th></tr>
          </thead>
          <tbody>
            {rates.map((r: any) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-2.5">{r.banks?.name}</td>
                <td>{r.tenure_months}m</td>
                <td className="text-right">{r.rate_general}%</td>
                <td className="text-right">{r.rate_senior}%</td>
                <td className="text-right"><button className="chip hover:border-brand">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
