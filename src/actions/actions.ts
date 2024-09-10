"use server";

import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { get } from "http";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import email from "next-auth/providers/email";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// --- User actions ---

export async function logIn(prevState: unknown, formData: unknown) {
  //check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { message: "Invalid credentials" };
        }
        default: {
          return { message: " Error Failed to sign in" };
        }
      }
    }
    throw error; // nextjs redirects throw error, so we need to rethrow it
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  //check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }

  //convert formData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries());

  //validation
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return { message: "Invalid form data" };
  }

  const { email, password } = validatedFormData.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { message: "Email already exists" };
      }
    }
    return { message: "Failed to create user" };
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// --- Pet actions ---

export async function addPet(pet: unknown) {
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return { message: "Invalid pet data" };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return { message: "Failed to add pet" };
  }
  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  //authentication check
  const session = await checkAuth();

  //validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPetId.success || !validatedPet.success) {
    return { message: "Invalid pet data" };
  }

  //authorization check (user can only edit their own pets)
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return { message: "Pet not found" };
  }
  if (pet.userId !== session.user.id) {
    return { message: "Unauthorized" };
  }

  //database mutation
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return { message: "Failed to edit pet" };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  //authentication check
  const session = await checkAuth();

  //validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return { message: "Invalid pet data" };
  }

  //authorization check (user can only delete their own pets)
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return { message: "Pet not found" };
  }
  if (pet.userId !== session.user.id) {
    return { message: "Unauthorized" };
  }

  //database mutation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return { message: "Failed to delete pet" };
  }
  revalidatePath("/app", "layout");
}

// ----payment actions ---

export async function createCheckoutSession() {
  //authentication check
  const session = await checkAuth();

  //create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1PwJh0GXb2L5RZYcPgLoG6U4",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
  });

  //redirect user
  redirect(checkoutSession.url);
}
