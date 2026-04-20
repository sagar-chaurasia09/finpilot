import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { claude } from "@/lib/anthropic";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rl = rateLimit(`ladder:${userId}`, 5);
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const { amount, months } = await req.json();
  const sb = supabaseAdmin();
  const { data: rates } = await sb
    .from("fd_rates")
    .select("tenure_months, rate_general, banks(name,type)")
    .order("rate_general", { ascending: false })
    .limit(20);

  const system = `You are a fixed-deposit ladder strategist for India. Given an amount, horizon (months), and a list of available rates, design an FD ladder that balances yield, liquidity, and safety. Prefer splitting across 2-4 banks and tenures. Always note DICGC ₹5L insurance per bank. Output:
1. Recommended split (bank + tenure + amount + rate + expected maturity ₹)
2. Why this split
3. Brief explanation in Hindi (2 sentences)
Keep it under 250 words.`;

  const ratesText = (rates ?? []).map((r: any) =>
    `${r.banks.name} (${r.banks.type}): ${r.tenure_months}m @ ${r.rate_general}%`
  ).join("\n");

  const { text, usage } = await claude({
    system,
    messages: [{
      role: "user",
      content: `Amount: ₹${amount}\nHorizon: ${months} months\n\nAvailable rates:\n${ratesText}`,
    }],
    maxTokens: 800,
  });

  await sb.from("ai_calls").insert({
    user_id: userId, feature: "ladder",
    tokens_in: usage.in, tokens_out: usage.out,
    cost_usd: (usage.in * 3 + usage.out * 15) / 1_000_000,
  });

  return NextResponse.json({ text });
}
