import { isDemoMode } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

const demoUsers = [
  { id: "u1", name: "Raj Sharma",    email: "raj@demo.finpilot.app",    income_range: "50k-1L",  role: "user",  credits: 44,  referral_code: "RAJ-F8K2" },
  { id: "u2", name: "Priya Iyer",    email: "priya@demo.finpilot.app",  income_range: "1L-2L",   role: "user",  credits: 44,  referral_code: "PRI-M3L9" },
  { id: "u3", name: "Aman Verma",    email: "aman@demo.finpilot.app",   income_range: "30k-50k", role: "user",  credits: 14,  referral_code: "AMN-K7P1" },
  { id: "u4", name: "Neha Kapoor",   email: "neha@demo.finpilot.app",   income_range: "2L+",     role: "user",  credits: 90,  referral_code: "NEH-X2R5" },
  { id: "u5", name: "Arjun Mehta",   email: "arjun@demo.finpilot.app",  income_range: "1L-2L",   role: "user",  credits: 60,  referral_code: "ARJ-P9Q3" },
  { id: "u6", name: "FinPilot Admin", email: "admin@demo.finpilot.app", income_range: "2L+",     role: "admin", credits: 999, referral_code: "ADM-0001" },
];

export default async function AdminUsers() {
  let users: any[] = [];
  if (isDemoMode) users = demoUsers;
  else {
    const sb = supabaseAdmin();
    const { data } = await sb.from("users").select("*").order("created_at", { ascending: false }).limit(100);
    users = data ?? [];
  }
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="py-2">Name</th><th>Email</th><th>Income</th><th>Role</th><th>Credits</th><th>Referral</th></tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t border-border">
                <td className="py-2.5">{u.name}</td>
                <td className="text-muted">{u.email}</td>
                <td>{u.income_range}</td>
                <td><span className={`chip ${u.role === "admin" ? "text-accent" : ""}`}>{u.role}</span></td>
                <td>{u.credits}</td>
                <td className="font-mono text-xs">{u.referral_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
