"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, MessagesSquare, Target, Sparkles, ArrowRight, Shield, Zap } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import AnimatedBackground from "@/components/AnimatedBackground";
import HeroScene from "@/components/HeroScene";
import TiltCard from "@/components/TiltCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6"
      >
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-brand to-accent shadow-glow">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand to-accent opacity-60 blur-md transition group-hover:opacity-100" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">{APP_NAME}</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn-primary">
            Get started <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 pt-10 pb-24 md:grid-cols-2 md:items-center md:gap-4 md:pt-16">
        <div>
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted backdrop-blur"
          >
            <Sparkles className="h-3 w-3 text-brand" />
            Built for India · AI-powered · Hindi + English
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl"
          >
            Money moves that{" "}
            <span className="gradient-text">actually make sense</span>.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            FD ladders, expense tracking, goal planning, and a financial literacy chatbot —
            tailored for Indian millennials who earn, spend, and want to grow.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link href="/signup" className="btn-primary text-base">
              Get started — it's free <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <Link href="/dashboard?guest=1" className="btn-ghost text-base">
              Continue as guest →
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mt-10 flex items-center gap-6 text-xs text-muted"
          >
            <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-brand" /> Bank-grade security</div>
            <div className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-accent" /> Instant insights</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <HeroScene />
        </motion.div>
      </section>

      {/* Stats strip */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-14">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur md:grid-cols-4">
          {[
            { v: "17+", l: "Indian banks" },
            { v: "8.75%", l: "Top FD rate" },
            { v: "<2s", l: "AI insight time" },
            { v: "100%", l: "In demo mode" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
              custom={i}
              className="text-center"
            >
              <div className="font-display text-2xl font-bold gradient-text md:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-brand">What's inside</div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Everything you need, <span className="gradient-text">nothing you don't</span>.
          </h2>
        </motion.div>

        <div className="perspective-1000 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
              custom={i}
            >
              <TiltCard tilt={8} className="h-full">
                <div className="group relative h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all duration-500 hover:border-brand/40 hover:shadow-glow">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-accent/20 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/10 via-surface to-accent/10 p-10 text-center md:p-14"
        >
          <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative">
            <h3 className="font-display text-3xl font-bold md:text-4xl">
              Start with <span className="gradient-text">₹0</span>. See results in minutes.
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              No credit card. No setup. Full demo data loaded — explore every feature instantly.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup" className="btn-primary text-base">
                Create your account <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
              <Link href="/dashboard?guest=1" className="btn-ghost text-base">Try the demo →</Link>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-sm text-muted">
        Built for the Blostem hackathon · Powered by Claude
      </footer>
    </main>
  );
}

const features = [
  { icon: <TrendingUp className="h-5 w-5" />, title: "FD Ladder Builder", desc: "Compare 17+ banks. AI-optimized ladders matched to your timeline and liquidity needs." },
  { icon: <Wallet className="h-5 w-5" />, title: "AI Expense Tracker", desc: "Upload CSV/PDF statements. Auto-categorize. Get insights in your own language." },
  { icon: <MessagesSquare className="h-5 w-5" />, title: "Finance Chatbot", desc: "Ask anything — FDs, SIPs, PPF, 80C, loans — in English or Hindi." },
  { icon: <Target className="h-5 w-5" />, title: "Goals + What-If", desc: "Set goals, simulate spending cuts, see compounding work in your favor." },
];
