"use client";
import { useEffect, useRef } from "react";

/**
 * Layered animated background:
 *  - Radial aurora blobs drifting slowly
 *  - Subtle grid overlay with radial mask
 *  - Mouse parallax on blobs
 */
export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      tx = x * 20; ty = y * 20;
    };
    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      el.style.setProperty("--px", cx.toFixed(2) + "px");
      el.style.setProperty("--py", cy.toFixed(2) + "px");
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--px" as any]: "0px", ["--py" as any]: "0px" }}
    >
      {/* Deep vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,170,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.08),transparent_55%)]" />

      {/* Aurora blobs */}
      <div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-50 animate-aurora"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(0,212,170,0.45), transparent 60%)",
          transform: "translate3d(calc(var(--px)*1.2), calc(var(--py)*1.2), 0)",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-40 animate-drift"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, rgba(139,92,246,0.45), transparent 60%)",
          transform: "translate3d(calc(var(--px)*-1), calc(var(--py)*-1), 0)",
        }}
      />
      <div
        className="absolute bottom-[-160px] left-1/4 h-[480px] w-[480px] rounded-full blur-3xl opacity-30 animate-pulse-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,170,0.35), transparent 65%)",
          transform: "translate3d(calc(var(--px)*0.6), calc(var(--py)*0.6), 0)",
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-60" />
    </div>
  );
}
