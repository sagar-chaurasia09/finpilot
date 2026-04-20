import { isDemoMode } from "@/lib/demo";
import Link from "next/link";
import SignupClerk from "./SignupClerk";

export default function SignupPage() {
  if (!isDemoMode) return <SignupClerk />;
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="card max-w-md w-full text-center">
        <div className="mx-auto mb-4 h-10 w-10 rounded-xl bg-gradient-to-br from-brand to-accent" />
        <h1 className="font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-muted">
          Demo mode — add a Clerk publishable key to <code className="text-brand">.env.local</code> to enable sign-up.
        </p>
        <Link href="/dashboard" className="btn-primary mt-6 inline-block">Continue as guest →</Link>
      </div>
    </main>
  );
}
