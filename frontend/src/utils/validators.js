import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Schémas de validation Zod
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe doit contenir au moins 6 caractères"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    email: z.string().email("Email invalide"),
    firstName: z.string().min(2, "Prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Nom doit contenir au moins 2 caractères"),
    password: z.string().min(8, "Mot de passe doit contenir au moins 8 caractères"),
    passwordConfirm: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirm"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mot de passe doit contenir au moins 8 caractères"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirm"],
  });