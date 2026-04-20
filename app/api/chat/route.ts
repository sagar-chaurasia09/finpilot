import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { claude } from "@/lib/anthropic";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase/server";

const SYSTEM = (lang: "en" | "hi", profile: any) => `
You are FinPilot, a helpful Indian personal finance expert. You explain FDs, mutual funds, SIPs, PPF, ELSS, NPS, 80C, home loans, insurance, and budgeting in clear, practical terms.

Rules:
- Never give SEBI-registered advice. Always recommend consulting a certified advisor for large decisions.
- Use INR (₹) and Indian conventions (lakh/crore).
- Respond in ${lang === "hi" ? "Hindi (Devanagari)" : "English"}.
- Keep responses concise — 2-4 short paragraphs unless the user asks for depth.
${profile ? `\nUser profile: income ${profile.income_range}, risk ${profile.risk_appetite}.` : ""}
`.trim();

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rl = rateLimit(`chat:${userId}`, Number(process.env.AI_RATE_LIMIT_PER_MIN ?? 5));
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const { messages, lang } = await req.json();
  const sb = supabaseAdmin();
  const { data: profile } = await sb.from("users").select("income_range,risk_appetite").eq("id", userId).maybeSingle();

  const { text, usage } = await claude({
    system: SYSTEM(lang ?? "en", profile),
    messages,
    maxTokens: 700,
  });

  await sb.from("ai_calls").insert({
    user_id: userId, feature: "chat",
    tokens_in: usage.in, tokens_out: usage.out,
    cost_usd: (usage.in * 3 + usage.out * 15) / 1_000_000,
  });

  return NextResponse.json({ text });
}
