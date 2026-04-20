import Link from "next/link";
import {
  LayoutDashboard, TrendingUp, Wallet, MessagesSquare, Target, Gift, Settings,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { isDemoMode, demoUser } from "@/lib/demo";
import UserBadge from "@/components/UserBadge";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/fd-ladder", label: "FD Ladder", icon: TrendingUp },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/chat", label: "Chat", icon: MessagesSquare },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/referrals", label: "Referrals", icon: Gift },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-r border-border bg-surface px-4 py-6 md:min-h-screen">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand to-accent" />
          <span className="font-semibold">{APP_NAME}</span>
        </Link>
        <nav className="space-y-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-bg hover:text-fg">
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
          {isDemoMode && (
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-accent transition hover:bg-bg">
              🛡 Admin Panel
            </Link>
          )}
        </nav>
        <div className="mt-8 border-t border-border pt-4">
          <UserBadge fallback={demoUser} />
        </div>
      </aside>
      <main className="px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
