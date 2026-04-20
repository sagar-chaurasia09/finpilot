"use client";
import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase/client";
import { formatINR } from "@/lib/utils";
import { isDemoMode, demoGoals } from "@/lib/demo";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function Goals() {
  const supabase = useSupabase();
  const [goals, setGoals] = useState<any[]>(isDemoMode ? demoGoals : []);
  const [cut, setCut] = useState(5000);
  const [sip, setSip] = useState(10000);
  const [years, setYears] = useState(10);

  useEffect(() => {
    if (isDemoMode) return;
    (async () => {
      const { data } = await supabase.from("goals").select("*").order("deadline");
      setGoals(data ?? []);
    })();
  }, [supabase]);

  const monthly = cut + sip;
  const data = Array.from({ length: years * 12 + 1 }, (_, m) => {
    const r = 0.12 / 12;
    const fv = monthly * ((Math.pow(1 + r, m) - 1) / r);
    return { month: m, value: Math.round(fv) };
  }).filter((_, i) => i % 6 === 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Goals</h1>
        <p className="mt-1 text-muted">Track progress and simulate outcomes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((+g.current_amount / +g.target_amount) * 100));
          return (
            <div key={g.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-semibold">{g.title}</div>
                  <div className="text-xs text-muted">by {g.deadline}</div>
                </div>
                <span className="chip">{g.category}</span>
              </div>
              <div className="mt-4 text-sm text-muted">
                {formatINR(+g.current_amount)} / {formatINR(+g.target_amount)}
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-border">
                <div className="h-2 rounded-full bg-gradient-to-r from-brand to-accent"
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1 text-right text-xs text-brand">{pct}%</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="mb-4 font-display text-lg font-semibold">What-If Simulator</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Slider label="Cut spending by ₹/mo" value={cut} min={0} max={30000} step={500} onChange={setCut} />
          <Slider label="Add SIP ₹/mo" value={sip} min={0} max={50000} step={1000} onChange={setSip} />
          <Slider label="Horizon (years)" value={years} min={1} max={30} step={1} onChange={setYears} />
        </div>
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickFormatter={(m) => `${Math.round(m / 12)}y`} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "#111218", border: "1px solid #1e2029" }} />
              <Line type="monotone" dataKey="value" stroke="#00d4aa" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-muted">
          At ₹{monthly.toLocaleString("en-IN")}/mo for {years}y @ 12% CAGR → <span className="text-fg font-semibold">{formatINR(data.at(-1)!.value)}</span>.
        </p>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }:
  { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="mb-2 flex justify-between text-xs text-muted">
        <span>{label}</span><span className="text-fg">{value.toLocaleString("en-IN")}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)} className="w-full accent-brand" />
    </label>
  );
}
