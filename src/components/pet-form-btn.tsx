import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function PetFormBtn({ actionType }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} className="self-end mt-5" type="submit">
      {actionType === "add" ? "Add a new pet" : "Edit pet"}
    </Button>
  );
}
