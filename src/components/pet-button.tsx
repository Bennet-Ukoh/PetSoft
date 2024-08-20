"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";
import PetForm from "./pet-form";
import { useState } from "react";
import { flushSync } from "react-dom";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function PetButton({
  actionType,
  children,
  onClick,
  disabled,
}: PetButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (actionType === "checkout") {
    return (
      <Button disabled={disabled} onClick={onClick} variant="secondary">
        {children}
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button size="icon">
            <PlusIcon className="h-6 w-6" />
          </Button>
        ) : (
          <Button variant="secondary">{children}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {actionType === "add" ? "Add a new pet" : "Edit pet"}
          </DialogTitle>
        </DialogHeader>
        <PetForm
          actionType={actionType}
          onFormSubmission={() => {
            flushSync(() => {
              setIsOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
