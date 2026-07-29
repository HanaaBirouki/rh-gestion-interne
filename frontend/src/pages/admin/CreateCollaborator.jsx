// frontend/src/pages/admin/CreateCollaborator.jsx

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { UserPlus, Loader2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

import PageHeader from "../../components/layout/PageHeader"
import api from "../../services/api"

const collaboratorSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .min(1, "L'email est obligatoire"),

  first_name: z
    .string()
    .min(1, "Le prénom est obligatoire"),

  last_name: z
    .string()
    .min(1, "Le nom est obligatoire"),

  role: z.enum(
    ["EMPLOYE", "STAGIAIRE", "FREELANCE"],
    {
      required_error: "Le rôle est obligatoire",
    }
  ),

  contract_type: z.enum(
    ["CDI", "CDD", "STAGE", "FREELANCE"],
    {
      required_error:
        "Le type de contrat est obligatoire",
    }
  ),

  position: z
    .string()
    .min(1, "Le poste est obligatoire"),

  department: z
    .string()
    .min(1, "Le département est obligatoire"),

  hire_date: z
    .string()
    .min(
      1,
      "La date d'embauche est obligatoire"
    ),

  phone: z.string().optional(),
})

const CreateCollaborator = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(
      collaboratorSchema
    ),
  })

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      await api.post(
        "/auth/users/",
        data
      )

      navigate(
        "/admin/collaborators"
      )

    } catch (error) {

      console.log(error)

      console.log(
        error.response
      )

      console.log(
        error.response?.data
      )

      alert(
        JSON.stringify(
          error.response?.data
        )
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <>
      <PageHeader
        icon={UserPlus}
        title="Créer un collaborateur"
        subtitle="Ajoutez un nouvel employé, stagiaire ou freelance."
      />

      <div className="p-8">
        <div className="w-full rounded-3xl bg-white shadow-md border border-slate-200 overflow-hidden">

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
          >

            {/* Informations personnelles */}

            <div className="p-8 border-b border-slate-200">

              <h2 className="text-xl font-bold text-[#0F2557] mb-8">
                Informations personnelles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                <div>
                  <Label>Prénom</Label>

                  <Input
                    placeholder="Ex : Hanaa"
                    {...register("first_name")}
                    className="mt-2 h-12 rounded-xl"
                  />

                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Nom</Label>

                  <Input
                    placeholder="Ex : Birouki"
                    {...register("last_name")}
                    className="mt-2 h-12 rounded-xl"
                  />

                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Téléphone</Label>

                  <Input
                    placeholder="+212600000000"
                    {...register("phone")}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>

                <div className="xl:col-span-3">
                  <Label>
                    Email professionnel
                  </Label>

                  <Input
                    placeholder="prenom.nom@wamainvest.com"
                    {...register("email")}
                    className="mt-2 h-12 rounded-xl"
                  />

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

              </div>
            </div>


            {/* Poste et Contrat */}

            <div className="p-8 border-b border-slate-200">

              <h2 className="text-xl font-bold text-[#0F2557] mb-8">
                Poste & Contrat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                <div>
                  <Label>Rôle</Label>

                  <Select
                    onValueChange={(value) =>
                      setValue(
                        "role",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="mt-2 h-12 rounded-xl">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="EMPLOYE">
                        Employé
                      </SelectItem>

                      <SelectItem value="STAGIAIRE">
                        Stagiaire
                      </SelectItem>

                      <SelectItem value="FREELANCE">
                        Freelance
                      </SelectItem>

                    </SelectContent>
                  </Select>
                </div>


                <div>
                  <Label>
                    Type de contrat
                  </Label>

                  <Select
                    onValueChange={(value) =>
                      setValue(
                        "contract_type",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="mt-2 h-12 rounded-xl">
                      <SelectValue placeholder="Sélectionner un contrat" />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="CDI">
                        CDI
                      </SelectItem>

                      <SelectItem value="CDD">
                        CDD
                      </SelectItem>

                      <SelectItem value="STAGE">
                        Stage
                      </SelectItem>

                      <SelectItem value="FREELANCE">
                        Freelance
                      </SelectItem>

                    </SelectContent>
                  </Select>
                </div>


                <div>
                  <Label>Département</Label>

                  <Input
                    placeholder="IT"
                    {...register(
                      "department"
                    )}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>


                <div>
                  <Label>Poste</Label>

                  <Input
                    placeholder="Développeur Full Stack"
                    {...register(
                      "position"
                    )}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>


                <div>
                  <Label>
                    Date d'embauche
                  </Label>

                  <Input
                    type="date"
                    {...register(
                      "hire_date"
                    )}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>

              </div>
            </div>


            {/* Boutons */}

            <div className="p-8 bg-slate-50 flex justify-end gap-4">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    "/admin/collaborators"
                  )
                }
                className="h-12 px-8 rounded-xl"
              >
                Annuler
              </Button>


              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  loading
                }
                className="h-12 px-8 rounded-xl bg-[#2F67F6] hover:bg-[#1D4ED8] text-white gap-2"
              >

                {loading ? (
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