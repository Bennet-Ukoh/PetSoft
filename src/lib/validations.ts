import { z } from "zod";
import { DEFAULT_PET_IMAGE } from "./constants";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(10),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner Name is required" })
      .max(10),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "Invalid Image Url" }),
    ]),
    age: z.coerce.number().int().positive({ message: "Invalid Age" }).max(9999),
    notes: z.union([
      z.literal(""),
      z.string().trim().min(1, { message: "Notes is required" }).max(1000),
    ]),
  })
  .transform((data) => {
    return {
      ...data,
      imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
    };
  });

export type TPetForm = z.infer<typeof petFormSchema>;

export const authSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});
