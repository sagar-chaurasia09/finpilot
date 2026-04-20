import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { isDemoMode } from "@/lib/demo";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-fg">
        {isDemoMode && (
          <div className="bg-accent/20 border-b border-accent/40 py-1.5 px-4 text-center text-xs text-accent">
            🚀 Demo mode — add Clerk + Supabase + Anthropic keys to .env.local for the real thing
          </div>
        )}
        {children}
      </body>
    </html>
  );

  if (isDemoMode) return body;

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00d4aa",
          colorBackground: "#111218",
          colorInputBackground: "#0a0b0f",
          colorText: "#e5e7eb",
          colorTextSecondary: "#6b7280",
          borderRadius: "12px",
        },
      }}
    >
      {body}
    </ClerkProvider>
  );
}
