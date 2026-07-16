// frontend/src/utils/validators.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

// ==========================================
// FONCTION CN - Pour les classes CSS
// ==========================================
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// ==========================================
// SCHÉMAS DE VALIDATION ZOD
// ==========================================

// Login
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe doit contenir au moins 6 caractères"),
  remember: z.boolean().optional(),
})

// Inscription
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
  })

// Mot de passe oublié
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
})

// Réinitialisation du mot de passe
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mot de passe doit contenir au moins 8 caractères"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirm"],
  })

// Profil utilisateur
export const profileSchema = z.object({
  first_name: z.string().min(2, "Le prénom est obligatoire"),
  last_name: z.string().min(2, "Le nom est obligatoire"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

// Collaborateur (Admin)
export const collaboratorSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est obligatoire"),
  first_name: z.string().min(1, "Le prénom est obligatoire"),
  last_name: z.string().min(1, "Le nom est obligatoire"),
  role: z.enum(["ADMIN", "EMPLOYE", "STAGIAIRE", "FREELANCE"], {
    required_error: "Le rôle est obligatoire",
  }),
  contract_type: z.enum(["CDI", "CDD", "STAGE", "FREELANCE"], {
    required_error: "Le type de contrat est obligatoire",
  }),
  position: z.string().min(1, "Le poste est obligatoire"),
  department: z.string().min(1, "Le département est obligatoire"),
  hire_date: z.string().min(1, "La date d'embauche est obligatoire"),
  phone: z.string().optional(),
})

// Demande de congé
export const leaveRequestSchema = z.object({
  type: z.string().min(1, "Le type de congé est obligatoire"),
  start_date: z.string().min(1, "La date de début est obligatoire"),
  end_date: z.string().min(1, "La date de fin est obligatoire"),
  reason: z.string().min(1, "Le motif est obligatoire"),
})

// Demande de document
export const documentRequestSchema = z.object({
  type: z.string().min(1, "Le type de document est obligatoire"),
})

// Document upload
export const documentUploadSchema = z.object({
  user: z.string().min(1, "Le collaborateur est obligatoire"),
  name: z.string().min(1, "Le nom du document est obligatoire"),
  type: z.enum(["CONTRACT", "ADDENDUM", "OTHER"], {
    required_error: "Le type de document est obligatoire",
  }),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Un fichier est obligatoire")
    .refine(
      (files) => files[0]?.type === "application/pdf",
      "Seuls les fichiers PDF sont autorisés"
    )
    .refine(
      (files) => files[0]?.size <= 5 * 1024 * 1024,
      "Le fichier ne doit pas dépasser 5 Mo"
    ),
})

// Payslip upload
export const payslipUploadSchema = z.object({
  user: z.string().min(1, "Le collaborateur est obligatoire"),
  month: z
    .string()
    .min(1, "Le mois est obligatoire")
    .refine((val) => Number(val) >= 1 && Number(val) <= 12, "Le mois doit être entre 1 et 12"),
  year: z
    .string()
    .min(1, "L'année est obligatoire")
    .refine((val) => Number(val) >= 2000 && Number(val) <= 2100, "Année invalide"),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Un fichier est obligatoire")
    .refine(
      (files) => files[0]?.type === "application/pdf",
      "Seuls les fichiers PDF sont autorisés"
    )
    .refine(
      (files) => files[0]?.size <= 5 * 1024 * 1024,
      "Le fichier ne doit pas dépasser 5 Mo"
    ),
})