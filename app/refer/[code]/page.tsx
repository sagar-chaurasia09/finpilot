import Link from "next/link";
import { cookies } from "next/headers";
import { isDemoMode } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/server";

export default async function ReferLanding({ params }: { params: { code: string } }) {
  let referrerName: string | null = null;

  if (isDemoMode) {
    referrerName = params.code === "RAJ-F8K2" ? "Raj Sharma" : "A friend";
  } else {
    const sb = supabaseAdmin();
    const { data } = await sb.from("users").select("name").eq("referral_code", params.code).maybeSingle();
    referrerName = data?.name ?? null;
  }

  cookies().set("referral_code", params.code, { maxAge: 60 * 60 * 24 * 30, path: "/" });

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 h-12 w-12 rounded-xl bg-gradient-to-br from-brand to-accent" />
        <h1 className="font-display text-4xl font-bold">
          {referrerName ?? "A friend"} invited you to <span className="gradient-text">FinPilot</span>
        </h1>
        <p className="mt-4 text-muted">
          Sign up with this link and you'll get <b className="text-brand">14 days of Pro</b> free.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/signup?ref=${params.code}`} className="btn-primary text-base">Claim my 14 days</Link>
          <Link href="/" className="btn-ghost">Learn more</Link>
        </div>
      </div>
    </main>
  );
}
