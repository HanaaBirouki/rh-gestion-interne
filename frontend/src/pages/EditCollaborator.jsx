import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const collaboratorSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est obligatoire"),
  first_name: z.string().min(1, "Le prénom est obligatoire"),
  last_name: z.string().min(1, "Le nom est obligatoire"),
  role: z.enum(["EMPLOYE", "STAGIAIRE"], {
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

// Donnée fictive représentant un collaborateur existant (en attendant la vraie API)
const fakeExistingCollaborator = {
  id: "a710bcec-c1e9-4511-a6a8-816a0e43985b",
  email: "hanaabirouki@gmail.com",
  first_name: "hanae",
  last_name: "birouki",
  role: "EMPLOYE",
  contract_type: "CDI",
  position: "Développeuse",
  department: "IT",
  hire_date: "2025-01-15",
  phone: "0656040158",
}

export default function EditCollaborator() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(collaboratorSchema),
  })

  // Pré-remplit le formulaire dès que les données existantes sont disponibles
  useEffect(() => {
    reset(fakeExistingCollaborator)
  }, [reset])

  const onSubmit = async (data) => {
    console.log("Données modifiées, prêtes à envoyer à l'API :", data)
    alert("Modification valide ! (voir la console pour les données)")
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Modifier le profil</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email professionnel</Label>
          <Input id="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="first_name">Prénom</Label>
          <Input id="first_name" {...register("first_name")} />
          {errors.first_name && (
            <p className="text-sm text-red-600 mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="last_name">Nom</Label>
          <Input id="last_name" {...register("last_name")} />
          {errors.last_name && (
            <p className="text-sm text-red-600 mt-1">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <Label>Rôle</Label>
          <Select
            defaultValue={fakeExistingCollaborator.role}
            onValueChange={(val) => setValue("role", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EMPLOYE">Employé</SelectItem>
              <SelectItem value="STAGIAIRE">Stagiaire / Freelance</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
          )}
        </div>

        <div>
          <Label>Type de contrat</Label>
          <Select
            defaultValue={fakeExistingCollaborator.contract_type}
            onValueChange={(val) => setValue("contract_type", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un contrat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CDI">CDI</SelectItem>
              <SelectItem value="CDD">CDD</SelectItem>
              <SelectItem value="STAGE">Stage</SelectItem>
              <SelectItem value="FREELANCE">Freelance</SelectItem>
            </SelectContent>
          </Select>
          {errors.contract_type && (
            <p className="text-sm text-red-600 mt-1">{errors.contract_type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="position">Poste</Label>
          <Input id="position" {...register("position")} />
          {errors.position && (
            <p className="text-sm text-red-600 mt-1">{errors.position.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="department">Département</Label>
          <Input id="department" {...register("department")} />
          {errors.department && (
            <p className="text-sm text-red-600 mt-1">{errors.department.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="hire_date">Date d'embauche</Label>
          <Input id="hire_date" type="date" {...register("hire_date")} />
          {errors.hire_date && (
            <p className="text-sm text-red-600 mt-1">{errors.hire_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Téléphone (optionnel)</Label>
          <Input id="phone" {...register("phone")} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </form>
    </div>
  )
}