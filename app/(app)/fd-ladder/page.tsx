"use client";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/utils";
import { useSupabase } from "@/lib/supabase/client";
import { isDemoMode, demoFDRates, demoLadderExplanation } from "@/lib/demo";

type Rate = { bank: string; type: string; tenure_months: number; rate_general: number; rate_senior: number };

export default function FDLadder() {
  const supabase = useSupabase();
  const [rates, setRates] = useState<Rate[]>(isDemoMode ? demoFDRates : []);
  const [amount, setAmount] = useState(100000);
  const [months, setMonths] = useState(24);
  const [ladder, setLadder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemoMode) return;
    (async () => {
      const { data } = await supabase
        .from("fd_rates")
        .select("tenure_months, rate_general, rate_senior, banks(name, type)")
        .order("rate_general", { ascending: false })
        .limit(30);
      setRates(
        (data ?? []).map((r: any) => ({
          bank: r.banks.name, type: r.banks.type,
          tenure_months: r.tenure_months,
          rate_general: r.rate_general, rate_senior: r.rate_senior,
        }))
      );
    })();
  }, [supabase]);

  async function generate() {
    setLoading(true);
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 800));
      setLadder(demoLadderExplanation);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/ladder", {
      method: "POST",
      body: JSON.stringify({ amount, months }),
    });
    const { text } = await res.json();
    setLadder(text);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">FD Ladder Builder</h1>
        <p className="mt-1 text-muted">Compare 15+ banks. Get an AI-optimized split.</p>
      </div>

      <div className="card">
        <h2 className="mb-4 font-display text-lg font-semibold">AI Ladder Generator</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-xs text-muted">Amount (₹)</span>
            <input className="input" type="number" value={amount}
              onChange={(e) => setAmount(+e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted">Horizon (months)</span>
            <input className="input" type="number" value={months}
              onChange={(e) => setMonths(+e.target.value)} />
          </label>
          <button className="btn-primary self-end" onClick={generate} disabled={loading}>
            {loading ? "Thinking…" : "Generate ladder"}
          </button>
        </div>
        {ladder && (
          <div className="mt-5 whitespace-pre-wrap rounded-xl border border-border bg-bg p-4 text-sm leading-relaxed">
            {ladder}
          </div>
        )}
      </div>

      <div className="card overflow-x-auto">
        <h2 className="mb-4 font-display text-lg font-semibold">Top rates</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr>
              <th className="py-2">Bank</th>
              <th>Type</th>
              <th>Tenure</th>
              <th className="text-right">General</th>
              <th className="text-right">Senior</th>
              <th className="text-right">₹1L in maturity</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-2.5">{r.bank}</td>
                <td><span className="chip">{r.type}</span></td>
                <td>{r.tenure_months}m</td>
                <td className="text-right font-medium text-brand">{r.rate_general}%</td>
                <td className="text-right">{r.rate_senior}%</td>
                <td className="text-right text-muted">
                  {formatINR(100000 * Math.pow(1 + r.rate_general / 400, (r.tenure_months / 12) * 4))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
