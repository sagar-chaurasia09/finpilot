"use client";
import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { isDemoMode, demoUser, demoReferrals } from "@/lib/demo";
import { useClerkUser } from "@/lib/use-clerk-user";

export default function Referrals() {
  const supabase = useSupabase();
  const user = useClerkUser();
  const [profile, setProfile] = useState<any>(isDemoMode ? demoUser : null);
  const [refs, setRefs] = useState<any[]>(isDemoMode ? demoReferrals : []);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://finpilot.app");

  useEffect(() => {
    setOrigin(window.location.origin);
    if (isDemoMode || !user) return;
    (async () => {
      const [{ data: me }, { data: r }] = await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).single(),
        supabase.from("referrals").select("*, referred:referred_id(name, email)").eq("referrer_id", user.id),
      ]);
      setProfile(me);
      setRefs(r ?? []);
    })();
  }, [supabase, user]);

  const link = profile ? `${origin}/refer/${profile.referral_code}` : "";
  const converted = refs.filter((r) => r.status === "converted").length;

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Refer friends, earn Pro</h1>
        <p className="mt-1 text-muted">30 days of FinPilot Pro per successful referral. They get 14 days on signup.</p>
      </div>

      <div className="card">
        <div className="text-sm text-muted">Your referral link</div>
        <div className="mt-2 flex items-center gap-2">
          <input className="input flex-1 font-mono text-xs" readOnly value={link} />
          <button onClick={copy} className="btn-primary">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a target="_blank" rel="noreferrer" className="chip hover:border-brand"
            href={`https://wa.me/?text=${encodeURIComponent(`Try FinPilot — smarter money for Indians. ${link}`)}`}>
            WhatsApp
          </a>
          <a target="_blank" rel="noreferrer" className="chip hover:border-brand"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just found FinPilot — AI for Indian personal finance. ${link}`)}`}>
            X / Twitter
          </a>
          <Link className="chip hover:border-brand" href="/referrals/leaderboard">Leaderboard →</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total invited" value={refs.length} />
        <Stat label="Converted" value={converted} />
        <Stat label="Credits (days)" value={profile?.credits ?? 0} />
      </div>

      <div className="card">
        <h2 className="mb-4 font-display text-lg font-semibold">Your referrals</h2>
        {refs.length === 0 ? (
          <p className="text-sm text-muted">No referrals yet. Share your link to get started.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr><th className="py-2">Name</th><th>Email</th><th>Status</th></tr>
            </thead>
            <tbody>
              {refs.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2.5">{r.referred?.name ?? "—"}</td>
                  <td className="text-muted">{r.referred?.email}</td>
                  <td><span className="chip text-brand">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
