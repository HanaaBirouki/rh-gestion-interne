// frontend/src/pages/admin/CreateCollaborator.jsx
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { UserPlus, Loader2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import PageHeader from "../../components/layout/PageHeader"
import api from "../../services/api"

const collaboratorSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est obligatoire"),
  first_name: z.string().min(1, "Le prénom est obligatoire"),
  last_name: z.string().min(1, "Le nom est obligatoire"),
  role: z.enum(["EMPLOYE", "STAGIAIRE", "FREELANCE"], { required_error: "Le rôle est obligatoire" }),
  contract_type: z.enum(["CDI", "CDD", "STAGE", "FREELANCE"], { required_error: "Le type de contrat est obligatoire" }),
  position: z.string().min(1, "Le poste est obligatoire"),
  department: z.string().min(1, "Le département est obligatoire"),
  hire_date: z.string().min(1, "La date d'embauche est obligatoire"),
  phone: z.string().optional(),
})

const CreateCollaborator = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(collaboratorSchema),
  })

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/users/", data)
      navigate("/admin/collaborators")
    } catch (error) {
      console.error("Erreur création collaborateur:", error)
      alert("Erreur lors de la création du collaborateur.")
    }
  }

  return (
    <>
      <PageHeader
        icon={UserPlus}
        title="Créer un collaborateur"
        subtitle="Ajoutez un nouvel employé, stagiaire ou freelance à l'annuaire"
      />

      <div className="p-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant max-w-2xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Identité */}
            <div className="p-6 border-b border-outline-variant">
              <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wide mb-4">
                Identité
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email professionnel</Label>
                  <Input id="email" placeholder="prenom.nom@wamainvest.com" {...register("email")} className="mt-1.5" />
                  {errors.email && <p className="text-sm text-error mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input id="first_name" {...register("first_name")} className="mt-1.5" />
                  {errors.first_name && <p className="text-sm text-error mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="last_name">Nom</Label>
                  <Input id="last_name" {...register("last_name")} className="mt-1.5" />
                  {errors.last_name && <p className="text-sm text-error mt-1">{errors.last_name.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input id="phone" {...register("phone")} className="mt-1.5" />
                </div>
              </div>
            </div>

            {/* Poste & Contrat */}
            <div className="p-6 border-b border-outline-variant">
              <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wide mb-4">
                Poste & Contrat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Rôle</Label>
                  <Select onValueChange={(val) => setValue("role", val)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYE">Employé</SelectItem>
                      <SelectItem value="STAGIAIRE">Stagiaire</SelectItem>
                      <SelectItem value="FREELANCE">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-error mt-1">{errors.role.message}</p>}
                </div>
                <div>
                  <Label>Type de contrat</Label>
                  <Select onValueChange={(val) => setValue("contract_type", val)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Sélectionner un contrat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="STAGE">Stage</SelectItem>
                      <SelectItem value="FREELANCE">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.contract_type && <p className="text-sm text-error mt-1">{errors.contract_type.message}</p>}
                </div>
                <div>
                  <Label htmlFor="position">Poste</Label>
                  <Input id="position" placeholder="Ex : Développeur Fullstack" {...register("position")} className="mt-1.5" />
                  {errors.position && <p className="text-sm text-error mt-1">{errors.position.message}</p>}
                </div>
                <div>
                  <Label htmlFor="department">Département</Label>
                  <Input id="department" placeholder="Ex : IT" {...register("department")} className="mt-1.5" />
                  {errors.department && <p className="text-sm text-error mt-1">{errors.department.message}</p>}
                </div>
                <div>
                  <Label htmlFor="hire_date">Date d'embauche</Label>
                  <Input id="hire_date" type="date" {...register("hire_date")} className="mt-1.5" />
                  {errors.hire_date && <p className="text-sm text-error mt-1">{errors.hire_date.message}</p>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-surface-container-low flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/collaborators")}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Créer le collaborateur
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateCollaborator