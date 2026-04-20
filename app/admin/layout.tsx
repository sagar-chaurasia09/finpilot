import Link from "next/link";
import { cookies } from "next/headers";
import { Users, FileText, Gift, Activity, Flag, ScrollText, BarChart3 } from "lucide-react";
import AdminLogoutButton from "@/components/AdminLogoutButton";

const nav = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/referrals", label: "Referrals", icon: Gift },
  { href: "/admin/ai-usage", label: "AI Usage", icon: Activity },
  { href: "/admin/features", label: "Feature Flags", icon: Flag },
  { href: "/admin/logs", label: "Audit Log", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin session cookie carries "email:timestamp.sig"
  const raw = cookies().get("finpilot_admin")?.value ?? "";
  const value = raw.includes(".") ? raw.slice(0, raw.lastIndexOf(".")) : "";
  const adminEmail = value.split(":")[0] || "admin@demo.finpilot.app";

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-r border-border bg-surface px-3 py-6 flex flex-col">
        <div className="mb-6 px-2 text-xs font-semibold uppercase tracking-wider text-muted">Admin</div>
        <nav className="space-y-0.5 flex-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-bg hover:text-fg">
              <n.icon className="h-4 w-4" />{n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-border pt-4 px-2">
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent to-brand text-xs font-semibold text-black">
              A
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">Admin</div>
              <div className="truncate text-xs text-muted">{adminEmail}</div>
            </div>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
