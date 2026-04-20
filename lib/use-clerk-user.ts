"use client";
import { isDemoMode } from "@/lib/demo";

export function useClerkUser(): { id: string } | null {
  if (isDemoMode) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useUser } = require("@clerk/nextjs");
  const { user } = useUser();
  return user ?? null;
}
