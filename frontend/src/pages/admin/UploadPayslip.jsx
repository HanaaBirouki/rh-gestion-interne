// frontend/src/pages/admin/UploadPayslip.jsx

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"

import {
  FileText,
  FileUp,
  Loader2,
} from "lucide-react"

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

const MAX_FILE_SIZE = 5 * 1024 * 1024

const payslipSchema = z.object({
  user: z.string().min(1, "Le collaborateur est obligatoire"),

  month: z.string().min(1, "Le mois est obligatoire"),

  year: z
    .string()
    .min(1, "L'année est obligatoire")
    .refine(
      (val) => Number(val) >= 2000 && Number(val) <= 2100,
      "Année invalide"
    ),

  file: z
    .instanceof(FileList)
    .refine(
      (files) => files.length === 1,
      "Le fichier est obligatoire"
    )
    .refine(
      (files) => files[0]?.type === "application/pdf",
      "Seuls les PDF sont autorisés"
    )
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "Le fichier ne doit pas dépasser 5 Mo"
    ),
})

const UploadPayslip = () => {
  const navigate = useNavigate()

  const [collaborators, setCollaborators] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(payslipSchema),
  })

  const selectedFile = watch("file")

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await api.get("/auth/users/")

        const employees = response.data.filter(
          (user) => user.role !== "ADMIN"
        )

        setCollaborators(employees)
      } catch (error) {
        console.error(error)

        setCollaborators([
          {
            id: "1",
            first_name: "Hanaa",
            last_name: "Birouki",
            email: "hanaa@test.com",
          },
          {
            id: "2",
            first_name: "Marwa",
            last_name: "Boubekri",
            email: "marwa@test.com",
          },
        ])
      }
    }

    fetchCollaborators()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()

      formData.append("user", data.user)
      formData.append("month", data.month)
      formData.append("year", data.year)
      formData.append("file_url", data.file[0])

      await api.post(
        "/admin/payslips/upload/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

      alert(
        "Le bulletin de paie a été uploadé avec succès."
      )

      navigate("/admin/payslips")
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.message ||
          "Erreur lors de l'upload."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Uploader un bulletin de paie"
        subtitle="Importez les bulletins de paie des employés au format PDF."
      />

      <div className="p-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-white shadow-md overflow-hidden border border-slate-200">

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* INFORMATIONS */}

            <div className="p-8 border-b border-slate-200">

              <h2 className="text-xl font-bold text-[#0F2557] mb-6">
                Informations du bulletin
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Collaborateur */}

                <div>
                  <Label>Collaborateur</Label>

                  <Select
                    onValueChange={(value) =>
                      setValue("user", value)
                    }
                  >
                    <SelectTrigger className="mt-2 h-12 rounded-xl">
                      <SelectValue placeholder="Sélectionner un collaborateur" />
                    </SelectTrigger>

                    <SelectContent>
                      {collaborators.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={String(c.id)}
                        >
                          {c.first_name}{" "}
                          {c.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.user && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.user.message}
                    </p>
                  )}
                </div>

                {/* MOIS */}

                <div>
                  <Label>Mois</Label>

                  <Select
                    onValueChange={(value) =>
                      setValue("month", value)
                    }
                  >
                    <SelectTrigger className="mt-2 h-12 rounded-xl">
                      <SelectValue placeholder="Sélectionner un mois" />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="1">
                        Janvier
                      </SelectItem>

                      <SelectItem value="2">
                        Février
                      </SelectItem>

                      <SelectItem value="3">
                        Mars
                      </SelectItem>

                      <SelectItem value="4">
                        Avril
                      </SelectItem>

                      <SelectItem value="5">
                        Mai
                      </SelectItem>

                      <SelectItem value="6">
                        Juin
                      </SelectItem>

                      <SelectItem value="7">
                        Juillet
                      </SelectItem>

                      <SelectItem value="8">
                        Août
                      </SelectItem>

                      <SelectItem value="9">
                        Septembre
                      </SelectItem>

                      <SelectItem value="10">
                        Octobre
                      </SelectItem>

                      <SelectItem value="11">
                        Novembre
                      </SelectItem>

                      <SelectItem value="12">
                        Décembre
                      </SelectItem>

                    </SelectContent>
                  </Select>

                  {errors.month && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.month.message}
                    </p>
                  )}
                </div>

                {/* ANNEE */}

                <div>
                  <Label>Année</Label>

                  <Input
                    type="number"
                    min="2000"
                    max="2100"
                    placeholder="2026"
                    {...register("year")}
                    className="mt-2 h-12 rounded-xl"
                  />

                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.year.message}
                    </p>
                  )}
                </div>

              </div>

            </div>

            {/* PDF */}

            <div className="p-8 border-b border-slate-200">

              <h2 className="text-xl font-bold text-[#0F2557] mb-6">
                Fichier PDF
              </h2>

              <label
                htmlFor="file"
                className="
                block
                border-2
                border-dashed
                border-slate-300
                rounded-2xl
                p-10
                text-center
                cursor-pointer
                hover:bg-slate-50
                transition
                "
              >

                <FileUp
                  className="
                  w-12
                  h-12
                  mx-auto
                  text-[#2F67F6]
                  mb-4
                  "
                />

                <p className="font-medium text-lg">

                  {selectedFile?.[0]
                    ? selectedFile[0].name
                    : "Cliquez pour sélectionner votre fichier PDF"}

                </p>

                <p className="text-slate-500 mt-2">
                  PDF uniquement • Taille maximale 5 Mo
                </p>

                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  {...register("file")}
                  className="hidden"
                />

              </label>

              {errors.file && (
                <p className="text-red-500 text-sm mt-3">
                  {errors.file.message}
                </p>
              )}

            </div>

            {/* MESSAGE D'ERREUR */}

            {error && (
              <div className="p-6">
                <p className="text-red-500">
                  {error}
                </p>
              </div>
            )}

            {/* BOUTONS */}

            <div
              className="
              p-8
              bg-slate-50
              flex
              justify-end
              gap-4
              "
            >

              <Button
                type="button"
                variant="outline"
                className="h-12 px-8 rounded-xl"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
              >
                Annuler
              </Button>

              <Button
    type="submit"
    disabled={loading || isSubmitting}
    className="
        h-12
        px-8
        rounded-xl
        bg-[#2F67F6]
        hover:bg-[#1D4ED8]
        text-white
        shadow-lg
        hover:shadow-xl
        transition-all
        duration-300
        gap-2
    "
>
    {loading || isSubmitting ? (
        <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Upload...
        </>
    ) : (
        <>
            <FileUp className="w-4 h-4" />
            Uploader le bulletin
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

export default UploadPayslip