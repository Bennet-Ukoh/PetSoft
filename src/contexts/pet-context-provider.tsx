"use client";

import { Pet } from "@/lib/types";
import { useState } from "react";
import { createContext } from "react";

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type PetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<PetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  //state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derieved state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  //event handlers/actions
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };
  return (
    <PetContext.Provider
      value={{
        pets,
        numberOfPets,
        selectedPetId,
        selectedPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
