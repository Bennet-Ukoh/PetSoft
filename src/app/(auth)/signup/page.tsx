import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <H1 className="text-center">Sign Up</H1>
      <AuthForm type="signUp" />
      <p className="mt-2  text-sm">
        Already have an account?{" "}
        <Link className="text-zinc-500 font-medium" href="/login">
          Log In
        </Link>
      </p>
    </main>
  );
}
