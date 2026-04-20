"use client";
import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase/client";
import { formatINR } from "@/lib/utils";
import { isDemoMode, demoTransactions, demoInsight } from "@/lib/demo";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#00d4aa", "#8b5cf6", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#84cc16", "#06b6d4"];

function titleCase(s: string) {
  return (s || "other").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function PieTooltip({ active, payload, total }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const name = titleCase(p.name ?? p.payload?.name);
  const value = Number(p.value) || 0;
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="rounded-xl border border-border bg-[#111218]/95 px-3 py-2 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.payload?.fill || p.color }} />
        <span className="text-sm font-semibold text-fg">{name}</span>
      </div>
      <div className="mt-1 text-sm text-brand">{formatINR(value)}</div>
      <div className="text-xs text-muted">{pct}% of total</div>
    </div>
  );
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-[#111218]/95 px-3 py-2 shadow-lg backdrop-blur">
      <div className="text-sm font-semibold text-fg">{titleCase(label)}</div>
      <div className="mt-1 text-sm text-brand">{formatINR(Number(payload[0].value) || 0)}</div>
    </div>
  );
}

export default function Expenses() {
  const supabase = useSupabase();
  const [tx, setTx] = useState<any[]>(isDemoMode ? demoTransactions : []);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemoMode) return;
    (async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .limit(100);
      setTx(data ?? []);
    })();
  }, [supabase]);

  const byCategory = Object.entries(
    tx.filter((t) => t.type === "debit").reduce<Record<string, number>>((acc, t) => {
      acc[t.category ?? "other"] = (acc[t.category ?? "other"] ?? 0) + Math.abs(+t.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const totalSpend = byCategory.reduce((s, c) => s + c.value, 0);

  async function getInsight() {
    setLoading(true);
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 600));
      setInsight(demoInsight);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/insights", { method: "POST" });
    const { text } = await res.json();
    setInsight(text);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Expenses</h1>
        <p className="mt-1 text-muted">Upload a statement — we'll categorize the rest.</p>
      </div>

      <div className="card">
        <h2 className="mb-3 font-display text-lg font-semibold">AI Insights</h2>
        <p className="text-sm text-muted">Get a personalized monthly review based on your income and spending.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={getInsight} className="btn-primary" disabled={loading}>
            {loading ? "Analyzing…" : "Generate insight"}
          </button>
          <span className="text-xs text-muted">CSV/PDF upload also supported on /api/expenses/upload</span>
        </div>
        {insight && <p className="mt-4 rounded-xl border border-border bg-bg p-4 text-sm leading-relaxed">{insight}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-display text-lg font-semibold">By category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                stroke="#0a0b0f"
                strokeWidth={2}
                isAnimationActive
              >
                {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip total={totalSpend} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="mb-4 font-display text-lg font-semibold">Top categories</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCategory.sort((a, b) => b.value - a.value).slice(0, 6)}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickFormatter={titleCase} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="value" fill="#00d4aa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="mb-4 font-display text-lg font-semibold">Recent transactions</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="py-2">Date</th><th>Merchant</th><th>Category</th><th className="text-right">Amount</th></tr>
          </thead>
          <tbody>
            {tx.slice(0, 25).map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="py-2.5 text-muted">{t.date}</td>
                <td>{t.merchant}</td>
                <td><span className="chip">{t.category}</span></td>
                <td className={`text-right font-medium ${t.type === "credit" ? "text-brand" : ""}`}>
                  {formatINR(+t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
