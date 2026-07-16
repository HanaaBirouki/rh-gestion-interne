import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Camera,
  ImagePlus,
  LoaderCircle,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const profileSchema = z.object({
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),

  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),

  email: z
    .string()
    .email("Adresse email invalide"),

  matricule: z
    .string()
    .min(2, "Le matricule est obligatoire"),

  poste: z
    .string()
    .min(2, "Le poste est obligatoire"),

  departement: z
    .string()
    .min(2, "Le département est obligatoire"),

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
  const departement = watch("departement");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get<EmployeeProfile[]>(
          "profiles/"
        );

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
            "Aucun profil trouvé. Remplissez le formulaire pour créer votre profil."
          );
          setMessageType("error");
        }
      } catch (error) {
        console.error("Erreur chargement profil :", error);

        setMessage("Impossible de charger le profil.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
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
    let currentProfileId = profileId;

    // Vérifier si un profil existe déjà dans Django
    if (currentProfileId === null) {
      const profilesResponse =
        await api.get<EmployeeProfile[]>("profiles/");

      if (profilesResponse.data.length > 0) {
        currentProfileId = profilesResponse.data[0].id;
        setProfileId(currentProfileId);
      }
    }

    // Modifier le profil existant
    if (currentProfileId !== null) {
      const response = await api.patch<EmployeeProfile>(
        `profiles/${currentProfileId}/`,
        data
      );

      setPhoto(response.data.photo);

      reset({
        nom: response.data.nom,
        prenom: response.data.prenom,
        email: response.data.email,
        matricule: response.data.matricule,
        poste: response.data.poste,
        departement: response.data.departement,
        telephone: response.data.telephone ?? "",
        adresse: response.data.adresse ?? "",
      });

      setMessage("Profil mis à jour avec succès.");
      setMessageType("success");
      return;
    }

    // Créer un profil uniquement s'il n'en existe vraiment aucun
    const response = await api.post<EmployeeProfile>(
      "profiles/",
      data
    );

    setProfileId(response.data.id);
    setPhoto(response.data.photo);
    setMessage("Profil créé avec succès.");
    setMessageType("success");
  } catch (error) {
    console.error("Erreur enregistrement du profil :", error);

    setMessage(
      "Impossible d’enregistrer le profil. Vérifiez les informations."
    );
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
      setMessage(
        "Choisissez une image au format JPG, PNG ou WEBP."
      );
      setMessageType("error");
      event.target.value = "";
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (selectedFile.size > maximumSize) {
      setMessage(
        "La taille de l’image ne doit pas dépasser 5 Mo."
      );
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

      URL.revokeObjectURL(localPreview);

      setMessage("Photo enregistrée avec succès.");
      setMessageType("success");
    } catch (error) {
      console.error("Erreur envoi photo :", error);

      setPreviewPhoto(null);
      URL.revokeObjectURL(localPreview);

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
      const response = await api.patch<EmployeeProfile>(
        `profiles/${profileId}/`,
        {
          photo: null,
        }
      );

      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto);
      }

      setPhoto(response.data.photo);
      setPreviewPhoto(null);

      setMessage("Photo supprimée avec succès.");
      setMessageType("success");
    } catch (error) {
      console.error("Erreur suppression photo :", error);

      setMessage("Impossible de supprimer la photo.");
      setMessageType("error");
    } finally {
      setDeletingPhoto(false);
    }
  };

  const displayedPhoto = previewPhoto || photo;

  const inputClassName =
    "h-12 min-w-0 w-full rounded-xl border border-[#DCE3F0] " +
    "bg-white px-4 text-sm text-[#0F2557] outline-none transition-all " +
    "duration-300 placeholder:text-slate-400 hover:border-[#B8C8E8] " +
    "hover:shadow-sm focus:border-[#2F67F6] focus:bg-white " +
    "focus:ring-4 focus:ring-[#2F67F6]/10";

  const labelClassName =
    "mb-2 block text-sm font-semibold text-[#0F2557]";

  if (loading) {
    return (
      <AppLayout
        title="Mon Profil"
        subtitle="Consultez et mettez à jour vos informations personnelles."
      >
        <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-[#1742A0]">
            <LoaderCircle
              size={24}
              className="animate-spin"
            />

            <span className="text-sm font-semibold">
              Chargement du profil...
            </span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Mon Profil"
      subtitle="Consultez et mettez à jour vos informations personnelles."
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,37,87,0.08)]">
        {/* En-tête du profil */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-[#F1F5FF] via-[#F7F9FF] to-white px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#E7EEFF] shadow-lg transition-all duration-300 hover:scale-105">
                {displayedPhoto ? (
                  <img
                    src={displayedPhoto}
                    alt="Photo du profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera
                    size={46}
                    className="text-[#2457D6]"
                  />
                )}
              </div>

              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#0F2557]/65 text-white">
                  <LoaderCircle
                    size={32}
                    className="animate-spin"
                  />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <UserRound
                  size={20}
                  className="text-[#2457D6]"
                />

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2457D6]">
                  Profil employé
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-bold text-[#0F2557]">
                {prenom || nom
                  ? `${prenom} ${nom}`.trim()
                  : "Profil employé"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {poste || "Employé"}

                {departement
                  ? ` · ${departement}`
                  : ""}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1742A0] to-[#2457D6] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadingPhoto ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <ImagePlus size={18} />
                  )}

                  {photo
                    ? "Changer la photo"
                    : "Ajouter une photo"}
                </button>

                {displayedPhoto && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={uploadingPhoto || deletingPhoto}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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

              <p className="mt-3 text-xs text-slate-400">
                Formats acceptés : JPG, PNG et WEBP. Taille maximale : 5 Mo.
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:p-8"
        >
          <div>
            <label className={labelClassName}>
              Prénom
            </label>

            <input
              {...register("prenom")}
              placeholder="Votre prénom"
              className={inputClassName}
            />

            {errors.prenom && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.prenom.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Nom
            </label>

            <input
              {...register("nom")}
              placeholder="Votre nom"
              className={inputClassName}
            />

            {errors.nom && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.nom.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Email
            </label>

            <input
              {...register("email")}
              type="email"
              placeholder="Votre adresse email"
              className={inputClassName}
            />

            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Matricule
            </label>

            <input
              {...register("matricule")}
              placeholder="Votre matricule"
              className={inputClassName}
            />

            {errors.matricule && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.matricule.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Poste
            </label>

            <input
              {...register("poste")}
              placeholder="Votre poste"
              className={inputClassName}
            />

            {errors.poste && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.poste.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Département
            </label>

            <input
              {...register("departement")}
              placeholder="Votre département"
              className={inputClassName}
            />

            {errors.departement && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.departement.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Téléphone
            </label>

            <input
              {...register("telephone")}
              type="tel"
              placeholder="Votre numéro de téléphone"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>
              Adresse
            </label>

            <input
              {...register("adresse")}
              placeholder="Votre adresse"
              className={inputClassName}
            />
          </div>

          <div className="border-t border-slate-200 pt-6 md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1742A0] to-[#2457D6] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {isSubmitting
                ? "Enregistrement..."
                : "Enregistrer les informations"}
            </button>

            {message && (
              <p
                className={`mt-4 rounded-xl border p-3 text-sm font-medium ${
                  messageType === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}