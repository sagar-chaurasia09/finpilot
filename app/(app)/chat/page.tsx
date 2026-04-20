"use client";
import { useState } from "react";
import { CHAT_SUGGESTIONS } from "@/lib/constants";
import { isDemoMode } from "@/lib/demo";
import { Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const DEMO_REPLIES: Record<string, string> = {
  "What is the difference between ELSS and PPF?":
    "Great question! Both save tax under 80C but they're quite different:\n\n• **Lock-in:** ELSS is 3 years (shortest in 80C), PPF is 15 years\n• **Returns:** ELSS is market-linked (~12% historical CAGR), PPF is govt-backed (~7.1% fixed)\n• **Risk:** ELSS can dip short-term, PPF never loses money\n\nFor your moderate risk appetite and ₹50K-1L income, a split of ~₹1L in ELSS + ₹50K in PPF annually is reasonable. Want me to model this in the What-If simulator?",
  "How much should I save monthly if my goal is ₹10L in 3 years?":
    "For ₹10,00,000 in 3 years (36 months), assuming 12% annualized returns via SIPs in equity mutual funds:\n\n**Required SIP: ~₹23,000/month**\n\nThat said, for a 3-year goal, pure equity is risky. I'd suggest a hybrid approach:\n• 60% in a balanced advantage fund (~10% return): ₹18K × 36m\n• 40% in a short-duration debt fund (~7%): ₹9K × 36m\n\nTotal ~₹27K/month with lower risk. Want to open the goal tracker to simulate this?",
  default:
    "I can answer questions about FDs, SIPs, PPF, ELSS, NPS, 80C deductions, home loans, insurance, and budgeting — all tailored for Indians. Note: this is demo mode, so try one of the preset questions above for a richer answer!",
};

export default function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");

  async function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next);
    setInput("");
    setLoading(true);

    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 900));
      const reply = DEMO_REPLIES[q] ?? DEMO_REPLIES.default;
      setMsgs([...next, { role: "assistant", content: reply }]);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: next, lang }),
    });
    const { text: reply } = await res.json();
    setMsgs([...next, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Finance Chat</h1>
          <p className="mt-1 text-muted">Ask anything about Indian personal finance.</p>
        </div>
        <select className="input max-w-[120px]" value={lang} onChange={(e) => setLang(e.target.value as any)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {msgs.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted">Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {CHAT_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="chip hover:border-brand text-left">{s}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user" ? "bg-brand text-black" : "bg-surface border border-border"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-muted">Thinking…</div>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-4 flex items-center gap-2 border-t border-border pt-4">
        <input className="input flex-1" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about FDs, SIPs, PPF, loans…" />
        <button className="btn-primary" type="submit"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}
