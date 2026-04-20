"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { TrendingUp, IndianRupee, Sparkles, Target, PiggyBank } from "lucide-react";

/**
 * Floating 3D "card stack" scene for the hero.
 * Responds to mouse position for subtle parallax.
 */
export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function move(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    }
    function leave() { mx.set(0); my.set(0); }
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [mx, my]);

  const rx = useTransform(sy, [-1, 1], [8, -8]);
  const ry = useTransform(sx, [-1, 1], [-12, 12]);

  return (
    <div ref={ref} className="relative mx-auto h-[420px] w-full max-w-xl perspective-2000">
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* Center card — Portfolio */}
        <FloatCard
          className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2"
          depth={80}
          delay={0}
        >
          <div className="glass rounded-2xl p-5 glow-brand">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted">Total portfolio</div>
                <div className="mt-1 font-display text-2xl font-bold">
                  <IndianRupee className="mb-1 inline h-5 w-5" />
                  12,48,900
                </div>
              </div>
              <div className="rounded-lg bg-brand/20 px-2 py-1 text-xs font-medium text-brand">
                +8.42%
              </div>
            </div>
            <MiniChart />
            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              <TrendingUp className="h-3 w-3 text-brand" /> FD ladder yielding 7.85% avg
            </div>
          </div>
        </FloatCard>

        {/* Top-left — FD rate */}
        <FloatCard className="absolute left-0 top-4 w-48" depth={140} delay={0.15}>
          <div className="glass rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted">Top FD rate</div>
            <div className="mt-1 font-display text-xl font-bold gradient-text">8.75%</div>
            <div className="mt-1 text-xs text-muted">Unity SFB • 3Y</div>
          </div>
        </FloatCard>

        {/* Top-right — Goal */}
        <FloatCard className="absolute right-0 top-10 w-52" depth={120} delay={0.3}>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Target className="h-3 w-3 text-accent" /> Emergency fund
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="text-muted">₹2.04L / ₹3L</span>
              <span className="text-brand">68%</span>
            </div>
          </div>
        </FloatCard>

        {/* Bottom-left — SIP */}
        <FloatCard className="absolute bottom-6 left-4 w-44" depth={100} delay={0.45}>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted">
              <PiggyBank className="h-3 w-3 text-brand" /> SIP this month
            </div>
            <div className="mt-1 font-display text-lg font-bold">₹15,000</div>
            <div className="text-[10px] text-brand">Auto-debited ✓</div>
          </div>
        </FloatCard>

        {/* Bottom-right — AI insight */}
        <FloatCard className="absolute bottom-4 right-0 w-56" depth={160} delay={0.6}>
          <div className="glass rounded-xl p-4 glow-accent">
            <div className="flex items-center gap-2 text-xs text-accent">
              <Sparkles className="h-3 w-3" /> AI insight
            </div>
            <div className="mt-1 text-xs leading-relaxed text-muted">
              Shift ₹20k from savings to a 2Y FD — earn <span className="text-brand">₹3,120</span> more.
            </div>
          </div>
        </FloatCard>
      </motion.div>
    </div>
  );
}

function FloatCard({
  children, className = "", depth = 100, delay = 0,
}: { children: React.ReactNode; className?: string; depth?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform: `translateZ(${depth}px)`, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </motion.div>
  );
}

function MiniChart() {
  const points = [12, 18, 14, 22, 20, 28, 25, 34, 30, 38, 42, 48];
  const max = Math.max(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 40 - (p / max) * 36;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" className="mt-3 h-14 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${path} L 100 40 L 0 40 Z`}
        fill="url(#g)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#00d4aa"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
      />
    </svg>
  );
}
