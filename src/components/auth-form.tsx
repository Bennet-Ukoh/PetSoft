import { logIn, signUp } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
  type: "logIn" | "signUp";
};

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form action={type === "logIn" ? logIn : signUp}>
      <div className="space-y-1 mt-4">
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" id="email" required maxLength={100} />
      </div>
      <div className="space-y-1 mb-4 mt-2 ">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          required
          maxLength={100}
        />
      </div>
      <Button>{type == "logIn" ? "Log In" : "Sign Up"}</Button>
    </form>
  );
}
