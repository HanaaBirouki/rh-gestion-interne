// frontend/src/pages/admin/UploadDocument.jsx
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import PageHeader from "../../components/layout/PageHeader"
import api from "../../services/api"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo

const documentSchema = z.object({
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
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "Le fichier ne doit pas dépasser 5 Mo"
    ),
})

const UploadDocument = () => {
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
    resolver: zodResolver(documentSchema),
  })

  const selectedFile = watch("file")

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await api.get("/auth/users/")
        const employees = response.data.filter(user => user.role !== "ADMIN")
        setCollaborators(employees)
      } catch (error) {
        console.error("Erreur chargement collaborateurs:", error)
        setCollaborators([
          { id: "1", first_name: "Hanae", last_name: "Birouki", email: "hanae@test.com" },
          { id: "2", first_name: "Marwa", last_name: "Boubekri", email: "marwa@test.com" },
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
      formData.append("name", data.name)
      formData.append("type", data.type)
      formData.append("file_url", data.file[0])

      // ✅ APPEL API RÉEL
      const response = await api.post("/admin/documents/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("✅ Document uploadé avec succès:", response.data)
      alert("✅ Document uploadé avec succès !")
      navigate("/admin/documents")
      
    } catch (error) {
      console.error("❌ Erreur upload:", error)
      setError(error.response?.data?.message || "Erreur lors de l'upload du document.")
      alert("❌ Erreur: " + (error.response?.data?.message || "Veuillez réessayer."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Uploader un document"
        subtitle="Importez les documents officiels des collaborateurs au format PDF"
      />

      <div className="p-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant max-w-2xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <Label>Collaborateur *</Label>
              <Select onValueChange={(val) => setValue("user", val)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Sélectionner un collaborateur" />
                </SelectTrigger>
                <SelectContent>
                  {collaborators.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.first_name} {c.last_name} ({c.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user && (
                <p className="text-sm text-error mt-1">{errors.user.message}</p>
              )}
            </div>

            {/* Nom du document */}
            <div>
              <Label htmlFor="name">Nom du document *</Label>
              <Input
                id="name"
                placeholder="Ex: Contrat CDI 2024 - Jean Dupont"
                {...register("name")}
                className="mt-1.5"
              />
              {errors.name && (
                <p className="text-sm text-error mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Type de document */}
            <div>
              <Label>Type de document *</Label>
              <Select onValueChange={(val) => setValue("type", val)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTRACT">Contrat</SelectItem>
                  <SelectItem value="ADDENDUM">Avenant</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-error mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Fichier PDF */}
            <div>
              <Label htmlFor="file">Fichier PDF *</Label>
              <div className="mt-1.5">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full border-2 border-dashed border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors p-6"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-on-surface-variant/50" />
                    <span className="text-sm text-on-surface-variant">
                      {selectedFile && selectedFile[0] ? (
                        <>📄 {selectedFile[0].name}</>
                      ) : (
                        "Cliquez pour sélectionner un fichier PDF"
                      )}
                    </span>
                    <span className="text-xs text-on-surface-variant/50">
                      PDF uniquement • Max 5 Mo
                    </span>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    {...register("file")}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.file && (
                <p className="text-sm text-error mt-1">{errors.file.message}</p>
              )}
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="p-3 bg-error-container/20 border border-error rounded-lg">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/documents")}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || loading} className="gap-2">
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Uploader le document
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

export default UploadDocument