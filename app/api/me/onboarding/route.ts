import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateReferralCode } from "@/lib/utils";

export async function POST(req: Request) {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const refCode = cookies().get("referral_code")?.value ?? null;
  const sb = supabaseAdmin();

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || email;
  const isAdminUser = email === process.env.ADMIN_EMAIL;

  // Upsert user. Generate referral_code on first insert.
  const { data: existing } = await sb.from("users").select("id, referral_code").eq("id", userId).maybeSingle();

  if (!existing) {
    await sb.from("users").insert({
      id: userId,
      email, name,
      income_range: body.income_range,
      risk_appetite: body.risk_appetite,
      language: body.language,
      role: isAdminUser ? "admin" : "user",
      referral_code: generateReferralCode(name),
      referred_by: refCode,
      credits: refCode ? 14 : 0,
    });

    // Create referral row + credit the referrer
    if (refCode) {
      const { data: referrer } = await sb.from("users").select("id").eq("referral_code", refCode).maybeSingle();
      if (referrer) {
        await sb.from("referrals").insert({
          referrer_id: referrer.id, referred_id: userId,
          status: "converted", reward_given: true,
        });
        await sb.rpc("increment_credits", { uid: referrer.id, days: 30 }).catch(() => {});
      }
    }
  } else {
    await sb.from("users").update({
      income_range: body.income_range,
      risk_appetite: body.risk_appetite,
      language: body.language,
    }).eq("id", userId);
  }

  return NextResponse.json({ ok: true });
}
