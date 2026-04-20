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
          colorPrimary: "#d4af37",
          colorBackground: "#121212",
          colorInputBackground: "#0a0a0a",
          colorText: "#f9fafb",
          colorTextSecondary: "#a1a1aa",
          borderRadius: "12px",
        },
      }}
    >
      {body}
    </ClerkProvider>
  );
}
