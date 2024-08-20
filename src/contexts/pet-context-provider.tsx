"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import { useOptimistic, useState } from "react";
import { createContext } from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type PetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (pet: PetEssentials) => Promise<void>;
  handleEditPet: (id: Pet["id"], newPetData: PetEssentials) => Promise<void>;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
};

export const PetContext = createContext<PetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  //state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: String(state.length + 1) }];
        case "edit":
          return state.map((pet) =>
            pet.id === payload.id ? { ...pet, ...payload.newPetData } : pet
          );
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derieved state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  //event handlers/actions
  const handleAddPet = async (newPet: PetEssentials) => {
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
    setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } });
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: Pet["id"]) => {
    setOptimisticPets({ action: "delete", payload: petId });
    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }

    setSelectedPetId(null);
  };
  const handleChangeSelectedPetId = (id: Pet["id"]) => {
    setSelectedPetId(id);
  };
  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        numberOfPets,
        selectedPetId,
        selectedPet,
        handleAddPet,
        handleCheckoutPet,
        handleEditPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
