"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { INCOME_RANGES, RISK_LEVELS, LANGUAGES } from "@/lib/constants";

export default function Onboarding() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    income_range: "50k-1L",
    risk_appetite: "moderate",
    language: "en",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/me/onboarding", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Tell us about you</h1>
      <p className="mt-2 text-muted">So we can tailor recommendations to your situation.</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Monthly income">
          <select className="input" value={form.income_range}
            onChange={(e) => setForm({ ...form, income_range: e.target.value })}>
            {INCOME_RANGES.map((r) => <option key={r} value={r}>₹{r}</option>)}
          </select>
        </Field>
        <Field label="Risk appetite">
          <select className="input" value={form.risk_appetite}
            onChange={(e) => setForm({ ...form, risk_appetite: e.target.value })}>
            {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Language">
          <select className="input" value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}>
            {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </Field>
        <button className="btn-primary w-full" disabled={saving}>
          {saving ? "Saving…" : "Continue to dashboard"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}
