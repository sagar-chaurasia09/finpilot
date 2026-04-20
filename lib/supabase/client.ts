"use client";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { isDemoMode } from "@/lib/demo";

// A stub that swallows every chained call and resolves empty.
// Avoids pulling Clerk in demo mode.
function makeStub() {
  const chain: any = new Proxy(
    {
      then: (resolve: any) => resolve({ data: [], error: null }),
      select: () => chain,
      eq: () => chain,
      order: () => chain,
      limit: () => chain,
      insert: () => chain,
      update: () => chain,
      single: async () => ({ data: null, error: null }),
      maybeSingle: async () => ({ data: null, error: null }),
    },
    { get: (t: any, k) => (k in t ? t[k] : () => chain) }
  );
  return { from: () => chain, rpc: () => chain };
}

export function useSupabase() {
  return useMemo(() => {
    if (isDemoMode) return makeStub() as any;
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
  }, []);
}
