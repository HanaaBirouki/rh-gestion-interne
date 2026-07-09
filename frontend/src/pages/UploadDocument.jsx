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

// Données fictives : liste des collaborateurs (viendra de l'API plus tard)
const fakeCollaborators = [
  { id: "a710bcec-c1e9-4511-a6a8-816a0e43985b", name: "Hanae Birouki" },
  { id: "f87be6d5-8d40-48a2-90ed-e86379a4b541", name: "Marwa Boubekri" },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo

const documentSchema = z.object({
  user: z.string().min(1, "Le collaborateur est obligatoire"),
  name: z.string().min(1, "Le nom du document est obligatoire"),
  type: z.enum(["CONTRACT", "ADDENDUM", "WORK_CERT"], {
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

export default function UploadDocument() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(documentSchema),
  })

  const onSubmit = async (data) => {
    // Pour l'instant, on affiche juste les données (pas encore connecté à l'API réelle)
    console.log("Document prêt à être envoyé :", {
      ...data,
      file: data.file[0].name,
    })
    alert("Document valide ! (voir la console pour les détails)")
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Uploader un document officiel</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Collaborateur</Label>
          <Select onValueChange={(val) => setValue("user", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un collaborateur" />
            </SelectTrigger>
            <SelectContent>
              {fakeCollaborators.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.user && (
            <p className="text-sm text-red-600 mt-1">{errors.user.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="name">Nom du document</Label>
          <Input id="name" placeholder="Ex : Contrat CDI 2026" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>Type de document</Label>
          <Select onValueChange={(val) => setValue("type", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CONTRACT">Contrat</SelectItem>
              <SelectItem value="ADDENDUM">Avenant</SelectItem>
              <SelectItem value="WORK_CERT">Attestation de travail</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="file">Fichier (PDF, 5 Mo max)</Label>
          <Input id="file" type="file" accept=".pdf" {...register("file")} />
          {errors.file && (
            <p className="text-sm text-red-600 mt-1">{errors.file.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi..." : "Uploader le document"}
        </Button>
      </form>
    </div>
  )
}