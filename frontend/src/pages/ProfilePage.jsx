import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  AtSign,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import api from "../services/api"
import { useAuth } from "../hooks/useAuth"

const profileSchema = z.object({
  first_name: z.string().min(2, "Le prénom est obligatoire"),
  last_name: z.string().min(2, "Le nom est obligatoire"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

const ProfilePage = () => {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [photo, setPhoto] = useState(null)
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [deletingPhoto, setDeletingPhoto] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
    },
  })

  const firstName = watch("first_name")
  const lastName = watch("last_name")
  const email = watch("email")
  const phone = watch("phone")
  const address = watch("address")

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/auth/profile/")
        const data = response.data

        reset({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        })

        setPhoto(data.avatar || null)
      } catch (error) {
        console.error("Erreur chargement profil :", error)
        setMessage("Impossible de charger le profil.")
        setMessageType("error")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [reset])

  const onSubmit = async (data) => {
    setMessage("")
    setMessageType("")

    try {
      await api.put("/auth/profile/", data)
      setMessage("Profil mis à jour avec succès.")
      setMessageType("success")
    } catch (error) {
      console.error("Erreur mise à jour profil :", error)
      setMessage("Erreur lors de la mise à jour du profil.")
      setMessageType("error")
    }
  }

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      setMessage("Choisissez une image JPG, PNG ou WEBP.")
      setMessageType("error")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("L'image ne doit pas dépasser 5 Mo.")
      setMessageType("error")
      return
    }

    const localPreview = URL.createObjectURL(file)

    setPreviewPhoto(localPreview)
    setUploadingPhoto(true)
    setMessage("")
    setMessageType("")

    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await api.put("/auth/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setPhoto(response.data.avatar || localPreview)
      setPreviewPhoto(null)
      setMessage("Photo mise à jour avec succès.")
      setMessageType("success")
    } catch (error) {
      console.error("Erreur photo :", error)
      setPreviewPhoto(null)
      setMessage("Impossible d'enregistrer la photo.")
      setMessageType("error")
    } finally {
      setUploadingPhoto(false)
      event.target.value = ""
    }
  }

  const handleDeletePhoto = async () => {
    if (!photo && !previewPhoto) return

    if (!window.confirm("Voulez-vous supprimer votre photo ?")) {
      return
    }

    setDeletingPhoto(true)
    setMessage("")
    setMessageType("")

    try {
      await api.put("/auth/profile/", {
        avatar: null,
      })

      setPhoto(null)
      setPreviewPhoto(null)
      setMessage("Photo supprimée avec succès.")
      setMessageType("success")
    } catch (error) {
      console.error("Erreur suppression photo :", error)
      setMessage("Impossible de supprimer la photo.")
      setMessageType("error")
    } finally {
      setDeletingPhoto(false)
    }
  }

  const displayedPhoto = previewPhoto || photo

  const displayedName =
    `${firstName || user?.first_name || ""} ${
      lastName || user?.last_name || ""
    }`.trim() || "Employé"

  const initials =
    `${firstName?.[0] || user?.first_name?.[0] || ""}${
      lastName?.[0] || user?.last_name?.[0] || ""
    }`.toUpperCase() || "EM"

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            className="animate-spin text-[#2F67F6]"
            size={42}
          />

          <p className="text-sm text-slate-500">
            Chargement du profil...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] p-6 lg:p-8">
      {/* Titre */}
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2F67F6]">
            <Sparkles size={17} />
            Espace personnel
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#0F2557] lg:text-4xl">
            Mon Profil
          </h1>

          <p className="mt-2 text-sm text-slate-500 lg:text-base">
            Gérez vos informations et personnalisez votre espace employé.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={17} />
          Profil actif
        </div>
      </div>

      {/* Carte principale */}
      <section className="relative mb-7 overflow-hidden rounded-[32px] bg-[#102A63] px-6 py-7 text-white shadow-[0_20px_60px_rgba(15,37,87,0.22)] lg:px-9 lg:py-8">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#2F67F6]/35 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:text-left">
            <div className="relative">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[34px] border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm">
                {displayedPhoto ? (
                  <img
                    src={displayedPhoto}
                    alt="Photo de profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {initials}
                  </span>
                )}
              </div>

              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center rounded-[34px] bg-black/45">
                  <LoaderCircle
                    size={34}
                    className="animate-spin text-white"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-[#102A63] bg-white text-[#2F67F6] shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
                aria-label="Changer la photo"
              >
                <Camera size={21} />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
                Employé
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                {displayedName}
              </h2>

              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-100 sm:justify-start">
                <Mail size={16} />
                {email || user?.email || "Aucun email"}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto || deletingPhoto}
                  className="h-11 rounded-xl bg-white px-5 font-semibold text-[#1742A0] shadow-sm hover:bg-blue-50"
                >
                  <ImagePlus size={18} className="mr-2" />
                  {photo ? "Changer la photo" : "Ajouter une photo"}
                </Button>

                {displayedPhoto && (
                  <Button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={uploadingPhoto || deletingPhoto}
                    className="h-11 rounded-xl border border-white/20 bg-white/10 px-5 font-semibold text-white hover:bg-white/15"
                  >
                    {deletingPhoto ? (
                      <LoaderCircle
                        size={18}
                        className="mr-2 animate-spin"
                      />
                    ) : (
                      <Trash2 size={18} className="mr-2" />
                    )}
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-[620px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <BriefcaseBusiness size={19} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-blue-200">
                Rôle
              </p>
              <p className="mt-1 font-semibold">
                {user?.role || "Employé"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Phone size={19} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-blue-200">
                Téléphone
              </p>
              <p className="mt-1 truncate font-semibold">
                {phone || "Non renseigné"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <MapPin size={19} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-blue-200">
                Adresse
              </p>
              <p className="mt-1 truncate font-semibold">
                {address || "Non renseignée"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2F67F6]">
              <UserRound size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0F2557]">
                Informations personnelles
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Modifiez les champs ci-dessous puis enregistrez.
              </p>
            </div>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
            Dernière mise à jour manuelle
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label
                htmlFor="first_name"
                className="text-sm font-semibold text-[#0F2557]"
              >
                Prénom
              </Label>

              <div className="relative mt-2">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="first_name"
                  {...register("first_name")}
                  className="h-13 rounded-2xl border-slate-200 bg-slate-50/70 pl-11 transition focus:bg-white"
                />
              </div>

              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="last_name"
                className="text-sm font-semibold text-[#0F2557]"
              >
                Nom
              </Label>

              <div className="relative mt-2">
                <AtSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="last_name"
                  {...register("last_name")}
                  className="h-13 rounded-2xl border-slate-200 bg-slate-50/70 pl-11 transition focus:bg-white"
                />
              </div>

              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-[#0F2557]"
              >
                Email professionnel
              </Label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="h-13 rounded-2xl border-slate-200 bg-slate-50/70 pl-11 transition focus:bg-white"
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="phone"
                className="text-sm font-semibold text-[#0F2557]"
              >
                Téléphone
              </Label>

              <div className="relative mt-2">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Votre numéro de téléphone"
                  className="h-13 rounded-2xl border-slate-200 bg-slate-50/70 pl-11 transition focus:bg-white"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="address"
                className="text-sm font-semibold text-[#0F2557]"
              >
                Adresse
              </Label>

              <div className="relative mt-2">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Votre adresse"
                  className="h-13 rounded-2xl border-slate-200 bg-slate-50/70 pl-11 transition focus:bg-white"
                />
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-2xl bg-[#2F67F6] px-7 font-semibold text-white shadow-[0_10px_24px_rgba(47,103,246,0.24)] hover:bg-[#2457D6]"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="mr-2 animate-spin"
                  />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ProfilePage