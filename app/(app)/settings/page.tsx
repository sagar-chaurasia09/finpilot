import { isDemoMode, demoUser } from "@/lib/demo";
import SettingsClerk from "./SettingsClerk";

export default function Settings() {
  if (!isDemoMode) return <SettingsClerk />;
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <div className="card space-y-4 max-w-xl">
        <Row label="Name" value={demoUser.name} />
        <Row label="Email" value={demoUser.email} />
        <Row label="Income range" value={`₹${demoUser.income_range}`} />
        <Row label="Risk appetite" value={demoUser.risk_appetite} />
        <Row label="Language" value={demoUser.language === "en" ? "English" : "हिन्दी"} />
        <Row label="Referral code" value={demoUser.referral_code} mono />
        <Row label="Pro credits" value={`${demoUser.credits} days`} />
      </div>
      <div className="card max-w-xl">
        <h2 className="mb-2 font-display text-lg font-semibold">Danger zone</h2>
        <button className="btn-ghost border-red-500/40 text-red-400">Delete account</button>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={`text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
