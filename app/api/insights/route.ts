import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { claude } from "@/lib/anthropic";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rl = rateLimit(`insights:${userId}`, 3);
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const sb = supabaseAdmin();
  const [{ data: profile }, { data: tx }] = await Promise.all([
    sb.from("users").select("income_range,risk_appetite").eq("id", userId).maybeSingle(),
    sb.from("transactions").select("amount,category,merchant,date,type").eq("user_id", userId).limit(60),
  ]);

  const summary = ((tx as any[]) ?? [])
    .filter((t: any) => t.type === "debit")
    .reduce<Record<string, number>>((a: Record<string, number>, t: any) => {
      a[t.category ?? "other"] = (a[t.category ?? "other"] ?? 0) + Math.abs(+t.amount);
      return a;
    }, {});

  const { text, usage } = await claude({
    system: `You are a personal finance coach for India. Give a short, actionable insight (3-4 sentences) based on the user's profile and last month's spending. Point out one thing to improve and one win.`,
    messages: [{
      role: "user",
      content: `Profile: ${JSON.stringify(profile)}\nSpend by category (₹): ${JSON.stringify(summary)}`,
    }],
    maxTokens: 400,
  });

  await sb.from("ai_calls").insert({
    user_id: userId, feature: "insights",
    tokens_in: usage.in, tokens_out: usage.out,
    cost_usd: (usage.in * 3 + usage.out * 15) / 1_000_000,
  });

  return NextResponse.json({ text });
}
