import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { TrendingUp, Wallet, Target, Gift } from "lucide-react";

export default function Dashboard() {
  // TODO: fetch real data from Supabase using the authed user
  const stats = [
    { label: "Net Worth", value: 325000, icon: TrendingUp, href: "/fd-ladder" },
    { label: "This Month Spend", value: 42380, icon: Wallet, href: "/expenses" },
    { label: "Goals on Track", value: "3 / 4", icon: Target, href: "/goals", raw: true },
    { label: "Referral Credits", value: "44 days", icon: Gift, href: "/referrals", raw: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-muted">Here's a snapshot of your finances.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card transition hover:border-brand/40">
            <s.icon className="mb-4 h-5 w-5 text-brand" />
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold">
              {s.raw ? s.value : formatINR(s.value as number)}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-display text-lg font-semibold">Quick actions</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/fd-ladder" className="chip hover:border-brand">Build FD ladder</Link>
            <Link href="/expenses" className="chip hover:border-brand">Upload statement</Link>
            <Link href="/chat" className="chip hover:border-brand">Ask the chatbot</Link>
            <Link href="/goals" className="chip hover:border-brand">Run What-If</Link>
          </div>
        </div>
        <div className="card">
          <h2 className="mb-4 font-display text-lg font-semibold">This week</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>• Dining spend up 18% WoW — consider meal prep</li>
            <li>• Suryoday SFB FD rate jumped to 8.75%</li>
            <li>• ELSS tax-saving deadline: Mar 31</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
