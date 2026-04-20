import { createClient } from "@supabase/supabase-js";
import { isDemoMode } from "@/lib/demo";

export async function supabaseServer() {
  if (isDemoMode) return supabaseAdmin();
  const { auth } = await import("@clerk/nextjs/server");
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" }).catch(() => null);
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      auth: { persistSession: false },
    }
  );
}

// Returns a live client when configured, otherwise a stub that resolves to empty arrays.
export function supabaseAdmin(): any {
  if (isDemoMode || !process.env.SUPABASE_SERVICE_ROLE_KEY) return stubClient();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function stubClient() {
  const chain: any = new Proxy(
    {
      then: (resolve: any) => resolve({ data: [], error: null, count: 0 }),
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
