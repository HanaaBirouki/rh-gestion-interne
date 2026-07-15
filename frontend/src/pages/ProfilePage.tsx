import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import AppLayout from "../components/AppLayout";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  ImagePlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

const profileSchema = z.object({
  nom: z.string().min(2, "Le nom est obligatoire"),
  prenom: z.string().min(2, "Le prénom est obligatoire"),
  email: z.string().email("Adresse email invalide"),
  matricule: z.string().min(2, "Le matricule est obligatoire"),
  poste: z.string().min(2, "Le poste est obligatoire"),
  departement: z.string().min(2, "Le département est obligatoire"),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type EmployeeProfile = ProfileFormData & {
  id: number;
  photo: string | null;
};

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileId, setProfileId] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      matricule: "",
      poste: "",
      departement: "",
      telephone: "",
      adresse: "",
    },
  });

  const prenom = watch("prenom");
  const nom = watch("nom");
  const poste = watch("poste");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get<EmployeeProfile[]>("profiles/");

        if (response.data.length > 0) {
          const profile = response.data[0];

          setProfileId(profile.id);
          setPhoto(profile.photo);

          reset({
            nom: profile.nom,
            prenom: profile.prenom,
            email: profile.email,
            matricule: profile.matricule,
            poste: profile.poste,
            departement: profile.departement,
            telephone: profile.telephone ?? "",
            adresse: profile.adresse ?? "",
          });
        } else {
          setMessage(
            "Aucun profil trouvé. Remplissez le formulaire pour le créer."
          );
          setMessageType("error");
        }
      } catch (error) {
        console.error(error);
        setMessage("Impossible de charger le profil.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  useEffect(() => {
    return () => {
      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto);
      }
    };
  }, [previewPhoto]);

  const onSubmit = async (data: ProfileFormData) => {
    setMessage("");
    setMessageType("");

    try {
      if (profileId === null) {
        const response = await api.post<EmployeeProfile>(
          "profiles/",
          data
        );

        setProfileId(response.data.id);
        setPhoto(response.data.photo);

        setMessage("Profil créé avec succès.");
        setMessageType("success");
      } else {
        const response = await api.patch<EmployeeProfile>(
          `profiles/${profileId}/`,
          data
        );

        setPhoto(response.data.photo);

        setMessage("Profil mis à jour avec succès.");
        setMessageType("success");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur pendant l’enregistrement du profil.");
      setMessageType("error");
    }
  };

  const openPhotoSelector = () => {
    if (profileId === null) {
      setMessage(
        "Enregistrez d’abord le profil avant d’ajouter une photo."
      );
      setMessageType("error");
      return;
    }

    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile || profileId === null) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Choisissez une image JPG, PNG ou WEBP.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (selectedFile.size > maximumSize) {
      setMessage("La taille de l’image ne doit pas dépasser 5 Mo.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(selectedFile);

    setPreviewPhoto(localPreview);
    setUploadingPhoto(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await api.patch<EmployeeProfile>(
        `profiles/${profileId}/`,
        formData
      );

      setPhoto(response.data.photo);
      setPreviewPhoto(null);

      setMessage("Photo enregistrée avec succès.");
      setMessageType("success");
    } catch (error) {
      console.error(error);

      setPreviewPhoto(null);
      setMessage("Impossible d’enregistrer la photo.");
      setMessageType("error");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    if (profileId === null || (!photo && !previewPhoto)) {
      return;
    }

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer votre photo ?"
    );

    if (!confirmation) {
      return;
    }

    setDeletingPhoto(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();
      formData.append("photo", "");

      const response = await api.patch<EmployeeProfile>(
        `profiles/${profileId}/`,
        formData
      );

      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto);
      }

      setPhoto(response.data.photo);
      setPreviewPhoto(null);

      setMessage("Photo supprimée avec succès.");
      setMessageType("success");
    } catch (error) {
      console.error(error);
      setMessage("Impossible de supprimer la photo.");
      setMessageType("error");
    } finally {
      setDeletingPhoto(false);
    }
  };

  const displayedPhoto = previewPhoto || photo;

  const inputClassName =
    "w-full rounded-xl border border-[#D8CEC3] bg-white p-3 " +
    "outline-none transition focus:border-[#8B5E3C] " +
    "focus:ring-2 focus:ring-[#8B5E3C]/20";

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8F5F0]">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 text-[#3B3024]">
            <LoaderCircle className="animate-spin" />
            Chargement du profil...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F5F0]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#3B3024]">
          Mon Profil
        </h1>

        <p className="mt-2 text-gray-500">
          Consultez et mettez à jour vos informations personnelles.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#F3ECE4] bg-[#E8DED2]">
                {displayedPhoto ? (
                  <img
                    src={displayedPhoto}
                    alt="Photo du profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera
                    size={42}
                    className="text-[#8B5E3C]"
                  />
                )}
              </div>

              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white">
                  <LoaderCircle
                    size={30}
                    className="animate-spin"
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#3B3024]">
                {prenom || nom
                  ? `${prenom} ${nom}`.trim()
                  : "Profil employé"}
              </h2>

              <p className="mt-1 text-gray-500">
                {poste || "Employé"}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={openPhotoSelector}
                  disabled={uploadingPhoto || deletingPhoto}
                  className="flex items-center gap-2 rounded-xl bg-[#8B5E3C] px-4 py-2 text-white transition hover:bg-[#6E472C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ImagePlus size={18} />

                  {photo
                    ? "Changer la photo"
                    : "Ajouter une photo"}
                </button>

                {displayedPhoto && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={uploadingPhoto || deletingPhoto}
                    className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingPhoto ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={18} />
                    )}

                    Supprimer
                  </button>
                )}
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Formats acceptés : JPG, PNG et WEBP. Maximum 5 Mo.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-[#3B3024]">
                Prénom
              </label>

              <input
                {...register("prenom")}
                placeholder="Prénom"
                className={inputClassName}
              />

              {errors.prenom && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prenom.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3B3024]">
                Nom
              </label>

              <input
                {...register("nom")}
                placeholder="Nom"
                className={inputClassName}
              />

              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nom.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3B3024]">
                Email
              </label>

              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className={inputClassName}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3B3024]">
                Matricule
              </label>

              <input
                {...register("matricule")}
                placeholder="Matricule"
                className={inputClassName}
              />

              {errors.matricule && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.matricule.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3B3024]">
                Poste
              </label>

              <input
                {...register("poste")}
                placeholder="Poste"
                className={inputClassName}
              />

              {errors.poste && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.poste.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3B3024]">
                Département
              </label>

              <input
                {...register("departement")}
                placeholder="Département"
                className={inputClassName}
              />

              {errors.departement && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.departement.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3B3024]">
                Téléphone
              </label>

              <input
                {...register("telephone")}
                placeholder="Téléphone"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3B3024]">
                Adresse
              </label>

              <input
                {...register("adresse")}
                placeholder="Adresse"
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#8B5E3C] px-6 py-3 text-white transition hover:bg-[#6E472C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : "Enregistrer les informations"}
              </button>

              {message && (
                <p
                  className={`mt-4 rounded-xl p-3 text-sm font-medium ${
                    messageType === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}