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

const fakeCollaborators = [
  { id: "a710bcec-c1e9-4511-a6a8-816a0e43985b", name: "Hanae Birouki" },
  { id: "f87be6d5-8d40-48a2-90ed-e86379a4b541", name: "Marwa Boubekri" },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024

const payslipSchema = z.object({
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
    .refine((files) => files[0]?.type === "application/pdf", "Seuls les fichiers PDF sont autorisés")
    .refine((files) => files[0]?.size <= MAX_FILE_SIZE, "Le fichier ne doit pas dépasser 5 Mo"),
})

export default function UploadPayslip() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(payslipSchema),
  })

  const onSubmit = async (data) => {
    console.log("Bulletin de paie prêt à être envoyé :", {
      ...data,
      file: data.file[0].name,
    })
    alert("Bulletin valide ! (voir la console pour les détails)")
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Uploader un bulletin de paie</h1>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="month">Mois (1-12)</Label>
            <Input id="month" type="number" min="1" max="12" {...register("month")} />
            {errors.month && (
              <p className="text-sm text-red-600 mt-1">{errors.month.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="year">Année</Label>
            <Input id="year" type="number" {...register("year")} />
            {errors.year && (
              <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="file">Fichier (PDF, 5 Mo max)</Label>
          <Input id="file" type="file" accept=".pdf" {...register("file")} />
          {errors.file && (
            <p className="text-sm text-red-600 mt-1">{errors.file.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi..." : "Uploader le bulletin"}
        </Button>
      </form>
    </div>
  )
}