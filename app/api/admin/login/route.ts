import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@demo.finpilot.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "demo-admin-secret-change-me";

// Simple signed-cookie session so we don't need a DB for the demo.
function sign(value: string) {
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
  return `${value}.${sig}`;
}

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = sign(`${email}:${Date.now()}`);
  cookies().set("finpilot_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete("finpilot_admin");
  return NextResponse.json({ ok: true });
}
