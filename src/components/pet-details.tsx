"use client";

import { usePetContext } from "@/lib/hooks";
import { Pet } from "@prisma/client";
import Image from "next/image";
import PetButton from "./pet-button";

type Props = {
  pet: Pet;
};

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  const pet = selectedPet;

  return (
    <section className="flex flex-col h-full w-full">
      {!pet ? (
        <div className="flex justify-center items-center h-full">
          <EmptyView />
        </div>
      ) : (
        <>
          <TopBar pet={pet} />
          <OtherInfor pet={pet} />
          <Notes pet={pet} />
        </>
      )}
    </section>
  );
}

function TopBar({ pet }: Props) {
  const { handleCheckoutPet } = usePetContext();

  return (
    <div className="flex items-center bg-white md:px-8 py-5 border-b border-light">
      <Image
        src={pet.imageUrl}
        alt="Selected Pet Image"
        height={75}
        width={75}
        className="rounded-full object-cover w-[75px] h-[75px]"
      />
      <h2 className="md:text-3xl text-xl font-semibold md:leading-7 md:ml-5 ml-2 mr-4">
        {pet.name}
      </h2>
      <div className="md:ml-auto md:space-x-2 ml-2 space-y-2">
        <PetButton actionType="edit">Edit</PetButton>
        <PetButton
          onClick={async () => {
            await handleCheckoutPet(pet.id);
          }}
          actionType="checkout"
        >
          Checkout
        </PetButton>
      </div>
    </div>
  );
}

function OtherInfor({ pet }: Props) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{pet?.ownerName}</p>
      </div>
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{pet?.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: Props) {
  return (
    <section className=" flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light">
      {pet?.notes}
    </section>
  );
}

function EmptyView() {
  return <p className="text-2xl font-medium">No pet selected!</p>;
}
