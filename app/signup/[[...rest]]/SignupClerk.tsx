import { SignUp } from "@clerk/nextjs";
export default function SignupClerk() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <SignUp routing="path" path="/signup" signInUrl="/login" />
    </main>
  );
}
