import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <H1 className="text-center">Log In</H1>
      <AuthForm />
      <p className="mt-2  text-sm">
        No account yet?{" "}
        <Link className="text-zinc-500 font-medium" href="/signup">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
