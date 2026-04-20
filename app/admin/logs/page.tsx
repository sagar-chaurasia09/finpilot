import { isDemoMode } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

const demoLogs = [
  { id: "1", created_at: "2026-04-19T14:20:00Z", action: "void_referral",   target_id: "r4",  admin: { email: "admin@demo.finpilot.app" } },
  { id: "2", created_at: "2026-04-19T13:02:00Z", action: "edit_fd_rate",    target_id: "fd_unity_36m", admin: { email: "admin@demo.finpilot.app" } },
  { id: "3", created_at: "2026-04-19T11:48:00Z", action: "grant_credits",   target_id: "u2",  admin: { email: "admin@demo.finpilot.app" } },
  { id: "4", created_at: "2026-04-18T18:15:00Z", action: "toggle_feature",  target_id: "goal_ai_coach", admin: { email: "admin@demo.finpilot.app" } },
  { id: "5", created_at: "2026-04-18T09:30:00Z", action: "suspend_account", target_id: "u_spam_01", admin: { email: "admin@demo.finpilot.app" } },
  { id: "6", created_at: "2026-04-17T15:44:00Z", action: "promote_admin",   target_id: "u6",  admin: { email: "admin@demo.finpilot.app" } },
];

export default async function AdminLogs() {
  let logs: any[] = [];
  if (isDemoMode) logs = demoLogs;
  else {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from("admin_logs")
      .select("*, admin:admin_id(name,email)")
      .order("created_at", { ascending: false })
      .limit(200);
    logs = data ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Audit Log</h1>
      <p className="text-sm text-muted">Immutable record of every admin action.</p>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="py-2">When</th><th>Admin</th><th>Action</th><th>Target</th></tr>
          </thead>
          <tbody>
            {logs.map((l: any) => (
              <tr key={l.id} className="border-t border-border">
                <td className="py-2.5 text-xs text-muted">{new Date(l.created_at).toLocaleString()}</td>
                <td>{l.admin?.email}</td>
                <td><span className="chip">{l.action}</span></td>
                <td className="font-mono text-xs text-muted">{l.target_id ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
