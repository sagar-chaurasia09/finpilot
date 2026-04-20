import { isDemoMode } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

const demoFlags = [
  { id: "1", key: "ai_ladder_generator",  enabled: true,  rollout_percentage: 100, updated_at: "2026-04-15T10:00:00Z" },
  { id: "2", key: "hindi_chatbot",        enabled: true,  rollout_percentage: 100, updated_at: "2026-04-12T10:00:00Z" },
  { id: "3", key: "pdf_statement_upload", enabled: true,  rollout_percentage: 50,  updated_at: "2026-04-18T10:00:00Z" },
  { id: "4", key: "referral_leaderboard", enabled: true,  rollout_percentage: 100, updated_at: "2026-04-10T10:00:00Z" },
  { id: "5", key: "what_if_simulator",    enabled: true,  rollout_percentage: 100, updated_at: "2026-04-08T10:00:00Z" },
  { id: "6", key: "fd_booking_redirect",  enabled: true,  rollout_percentage: 100, updated_at: "2026-04-05T10:00:00Z" },
  { id: "7", key: "goal_ai_coach",        enabled: false, rollout_percentage: 0,   updated_at: "2026-04-19T10:00:00Z" },
];

export default async function AdminFeatures() {
  let flags: any[] = [];
  if (isDemoMode) flags = demoFlags;
  else {
    const sb = supabaseAdmin();
    const { data } = await sb.from("feature_flags").select("*").order("key");
    flags = data ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Feature Flags</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="py-2">Key</th><th>Enabled</th><th>Rollout %</th><th>Updated</th></tr>
          </thead>
          <tbody>
            {flags.map((f) => (
              <tr key={f.id} className="border-t border-border">
                <td className="py-2.5 font-mono text-xs">{f.key}</td>
                <td>{f.enabled ? <span className="chip text-brand">on</span> : <span className="chip">off</span>}</td>
                <td>{f.rollout_percentage}%</td>
                <td className="text-xs text-muted">{new Date(f.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
