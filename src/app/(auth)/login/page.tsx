import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <H1 className="text-center">Log In</H1>
      <AuthForm type="logIn" />
      <p className="mt-2 text-zinc-500  text-sm">
        No account yet?{" "}
        <Link className=" font-medium" href="/signup">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
