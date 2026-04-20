"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin-login");
    router.refresh();
  }
  return (
    <button onClick={logout}
      className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-red-500/40 hover:text-red-300">
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
