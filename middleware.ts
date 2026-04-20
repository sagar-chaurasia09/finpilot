import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const hasClerk =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_test_xxx");

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "demo-admin-secret-change-me";

const isPublic = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/about",
  "/refer/(.*)",
  "/api/webhooks/(.*)",
  "/admin-login(.*)",
  "/api/admin/login",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminLogin = createRouteMatcher(["/admin-login(.*)", "/api/admin/login"]);

// HMAC-SHA256 using Web Crypto (Edge-compatible)
async function hmac(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyAdminCookie(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = await hmac(value);
  // Constant-time compare
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

async function adminGuard(req: NextRequest): Promise<NextResponse | null> {
  if (!isAdminRoute(req) || isAdminLogin(req)) return null;
  const token = req.cookies.get("finpilot_admin")?.value;
  if (await verifyAdminCookie(token)) return null;
  const url = new URL("/admin-login", req.url);
  url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

const realAuth = clerkMiddleware(async (auth, req) => {
  const blocked = await adminGuard(req as unknown as NextRequest);
  if (blocked) return blocked;
  if (isPublic(req)) return;
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
});

export default hasClerk
  ? realAuth
  : async (req: NextRequest) => {
      const blocked = await adminGuard(req);
      return blocked ?? NextResponse.next();
    };

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
