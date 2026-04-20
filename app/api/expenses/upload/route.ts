import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Papa from "papaparse";
import { claude } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase/server";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

type Row = { date: string; merchant: string; amount: number };

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });

  const rows: Row[] = parsed.data
    .map((r) => ({
      date: r.date || r.Date || r.DATE || "",
      merchant: r.merchant || r.Description || r.NARRATION || "Unknown",
      amount: parseFloat(r.amount || r.Amount || r.AMOUNT || r.Debit || r.DEBIT || "0"),
    }))
    .filter((r) => r.date && !isNaN(r.amount));

  // Categorize in one Claude call
  const { text: catText } = await claude({
    system: `Classify each transaction into ONE of: ${EXPENSE_CATEGORIES.join(", ")}. Reply with a JSON array of category strings in the same order as the input. No other text.`,
    messages: [{ role: "user", content: JSON.stringify(rows.map((r) => r.merchant)) }],
    maxTokens: 1500,
  });

  let categories: string[] = [];
  try { categories = JSON.parse(catText.match(/\[[\s\S]*\]/)?.[0] ?? "[]"); } catch {}

  const sb = supabaseAdmin();
  const toInsert = rows.map((r, i) => ({
    user_id: userId,
    date: r.date, merchant: r.merchant,
    amount: -Math.abs(r.amount),
    type: "debit", source: "csv",
    category: categories[i] ?? "other",
  }));
  if (toInsert.length) await sb.from("transactions").insert(toInsert);

  return NextResponse.json({ ok: true, inserted: toInsert.length });
}
