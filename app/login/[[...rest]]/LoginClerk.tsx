import { SignIn } from "@clerk/nextjs";
export default function LoginClerk() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <SignIn routing="path" path="/login" signUpUrl="/signup" />
    </main>
  );
}
