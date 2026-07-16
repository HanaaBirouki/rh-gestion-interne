// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Camera, ImagePlus, LoaderCircle, Trash2 } from "lucide-react"

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
        setPhoto(data.avatar_url || null)
      } catch (error) {
        console.error("Erreur chargement profil:", error)
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

    try {
      const formData = new FormData()
      formData.append("avatar_url", file)
      await api.put("/auth/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setPhoto(localPreview)
      setPreviewPhoto(null)
      setMessage("Photo mise à jour avec succès.")
      setMessageType("success")
    } catch (error) {
      setMessage("Impossible d'enregistrer la photo.")
      setMessageType("error")
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (!photo && !previewPhoto) return
    if (!window.confirm("Voulez-vous supprimer votre photo ?")) return

    setDeletingPhoto(true)
    try {
      await api.put("/auth/profile/", { avatar_url: null })
      setPhoto(null)
      setPreviewPhoto(null)
      setMessage("Photo supprimée avec succès.")
      setMessageType("success")
    } catch (error) {
      setMessage("Impossible de supprimer la photo.")
      setMessageType("error")
    } finally {
      setDeletingPhoto(false)
    }
  }

  const displayedPhoto = previewPhoto || photo

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <LoaderCircle className="animate-spin text-primary-container" size={40} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Mon Profil</h1>
        <p className="text-on-surface-variant text-sm mb-6">
          Consultez et mettez à jour vos informations personnelles.
        </p>

        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 border border-outline-variant">
          {/* Photo */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-outline-variant bg-surface-container">
                {displayedPhoto ? (
                  <img src={displayedPhoto} alt="Photo de profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container">
                    <Camera size={40} className="text-on-surface-variant/50" />
                  </div>
                )}
              </div>
              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <LoaderCircle className="animate-spin text-white" size={30} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-on-surface">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-on-surface-variant text-sm">{user?.role || "Employé"}</p>
              <div className="flex wrap gap-3 mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="default"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto || deletingPhoto}
                >
                  <ImagePlus size={18} className="mr-2" />
                  {photo ? "Changer la photo" : "Ajouter une photo"}
                </Button>
                {displayedPhoto && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeletePhoto}
                    disabled={uploadingPhoto || deletingPhoto}
                  >
                    <Trash2 size={18} className="mr-2" />
                    Supprimer
                  </Button>
                )}
              </div>
              <p className="text-xs text-on-surface-variant/60 mt-2">
                Formats acceptés : JPG, PNG, WEBP. Max 5 Mo.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Prénom</Label>
              <Input id="first_name" {...register("first_name")} className="mt-1" />
              {errors.first_name && <p className="text-sm text-error mt-1">{errors.first_name.message}</p>}
            </div>

            <div>
              <Label htmlFor="last_name">Nom</Label>
              <Input id="last_name" {...register("last_name")} className="mt-1" />
              {errors.last_name && <p className="text-sm text-error mt-1">{errors.last_name.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} className="mt-1" />
              {errors.email && <p className="text-sm text-error mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" {...register("phone")} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" {...register("address")} className="mt-1" />
            </div>

            <div className="md:col-span-2 flex items-center gap-4 mt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
              {message && (
                <p className={`text-sm ${messageType === "success" ? "text-green-600" : "text-error"}`}>
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage