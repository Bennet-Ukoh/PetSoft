import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "add" | "edit";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button className="self-end mt-5" type="submit">
      {actionType === "add" ? "Add a new pet" : "Edit pet"}
    </Button>
  );
}
