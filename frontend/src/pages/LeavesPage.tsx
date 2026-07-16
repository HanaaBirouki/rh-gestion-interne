import { useEffect, useMemo, useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Send,
  XCircle,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const leaveSchema = z
  .object({
    type_conge: z.string().min(1, "Choisissez un type de congé"),
    date_debut: z.string().min(1, "Choisissez la date de début"),
    date_fin: z.string().min(1, "Choisissez la date de fin"),
    motif: z
      .string()
      .min(3, "Le motif doit contenir au moins 3 caractères"),
  })
  .refine(
    (data) => {
      if (!data.date_debut || !data.date_fin) {
        return true;
      }

      return new Date(data.date_fin) >= new Date(data.date_debut);
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["date_fin"],
    }
  );

type LeaveFormData = z.infer<typeof leaveSchema>;

type EmployeeProfile = {
  id: number;
  nom: string;
  prenom: string;
};

type LeaveStatus = "pending" | "approved" | "rejected";

type LeaveRequest = {
  id: number;
  employee: number;
  employee_name?: string;
  type_conge: string;
  date_debut: string;
  date_fin: string;
  nombre_jours: number;
  motif: string;
  statut: LeaveStatus;
  created_at: string;
};

function calculateBusinessDays(
  startDate: string,
  endDate: string
): number {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return 0;
  }

  let total = 0;
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const day = currentDate.getDay();

    if (day !== 0 && day !== 6) {
      total += 1;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return total;
}

function formatDate(date: string): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("fr-FR").format(
    new Date(`${date}T00:00:00`)
  );
}

function getStatusLabel(status: LeaveStatus): string {
  if (status === "approved") {
    return "Validée";
  }

  if (status === "rejected") {
    return "Refusée";
  }

  return "En attente";
}

function getStatusStyle(status: LeaveStatus): string {
  if (status === "approved") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function LeavesPage() {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  const [loading, setLoading] = useState(true);
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
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),

    defaultValues: {
      type_conge: "Congé annuel",
      date_debut: "",
      date_fin: "",
      motif: "",
    },
  });

  const dateDebut = watch("date_debut");
  const dateFin = watch("date_fin");

  const businessDays = useMemo(
    () => calculateBusinessDays(dateDebut, dateFin),
    [dateDebut, dateFin]
  );

  const approvedDays = useMemo(
    () =>
      leaves
        .filter((leave) => leave.statut === "approved")
        .reduce(
          (total, leave) => total + leave.nombre_jours,
          0
        ),
    [leaves]
  );

  const pendingCount = useMemo(
    () =>
      leaves.filter((leave) => leave.statut === "pending")
        .length,
    [leaves]
  );

  const rejectedCount = useMemo(
    () =>
      leaves.filter((leave) => leave.statut === "rejected")
        .length,
    [leaves]
  );

  const loadData = async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const [profilesResponse, leavesResponse] =
        await Promise.all([
          api.get<EmployeeProfile[]>("profiles/"),
          api.get<LeaveRequest[]>("leaves/"),
        ]);

      if (profilesResponse.data.length === 0) {
        setEmployeeId(null);
        setMessage(
          "Aucun profil employé trouvé. Créez d’abord le profil."
        );
        setMessageType("error");
      } else {
        setEmployeeId(profilesResponse.data[0].id);
      }

      setLeaves(leavesResponse.data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Impossible de charger les demandes de congé."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const onSubmit = async (data: LeaveFormData) => {
    setMessage("");
    setMessageType("");

    if (employeeId === null) {
      setMessage(
        "Aucun profil employé n’est disponible."
      );
      setMessageType("error");
      return;
    }

    const numberOfDays = calculateBusinessDays(
      data.date_debut,
      data.date_fin
    );

    if (numberOfDays <= 0) {
      setMessage("Vérifiez les dates sélectionnées.");
      setMessageType("error");
      return;
    }

    try {
      const response = await api.post<LeaveRequest>(
        "leaves/",
        {
          employee: employeeId,
          type_conge: data.type_conge,
          date_debut: data.date_debut,
          date_fin: data.date_fin,
          nombre_jours: numberOfDays,
          motif: data.motif,
        }
      );

      setLeaves((currentLeaves) => [
        response.data,
        ...currentLeaves,
      ]);

      reset({
        type_conge: "Congé annuel",
        date_debut: "",
        date_fin: "",
        motif: "",
      });

      setMessage(
        "Demande de congé envoyée avec succès."
      );
      setMessageType("success");
    } catch (error) {
      console.error(error);

      setMessage(
        "Impossible d’envoyer la demande de congé."
      );
      setMessageType("error");
    }
  };

  const inputClassName =
    "h-12 w-full rounded-xl border border-slate-200 " +
    "bg-white px-4 text-sm text-slate-900 outline-none " +
    "transition placeholder:text-slate-400 " +
    "focus:border-[#2F67F6] " +
    "focus:ring-4 focus:ring-[#2F67F6]/10";

  const labelClassName =
    "mb-2 block text-sm font-semibold text-[#0F2557]";

  return (
    <AppLayout
      title="Mes Congés"
      subtitle="Créez une demande et consultez son état d’avancement."
    >
      {message && (
        <div
          className={`mb-6 rounded-xl border p-4 text-sm font-medium ${
            messageType === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Demandes totales
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {leaves.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2457D6]">
              <CalendarDays size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Jours validés
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {approvedDays}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                En attente
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {pendingCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Refusées
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {rejectedCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-[#0F2557]">
            Nouvelle demande
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complétez les informations de votre congé.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2"
        >
          <div>
            <label className={labelClassName}>
              Type de congé
            </label>

            <select
              {...register("type_conge")}
              className={inputClassName}
            >
              <option value="Congé annuel">
                Congé annuel
              </option>

              <option value="Congé maladie">
                Congé maladie
              </option>

              <option value="Congé exceptionnel">
                Congé exceptionnel
              </option>

              <option value="Congé maternité">
                Congé maternité
              </option>
            </select>

            {errors.type_conge && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.type_conge.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Nombre de jours ouvrés
            </label>

            <input
              type="number"
              value={businessDays}
              readOnly
              className={`${inputClassName} cursor-not-allowed bg-slate-50 font-semibold text-[#1742A0]`}
            />
          </div>

          <div>
            <label className={labelClassName}>
              Date de début
            </label>

            <input
              type="date"
              {...register("date_debut")}
              className={inputClassName}
            />

            {errors.date_debut && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.date_debut.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Date de fin
            </label>

            <input
              type="date"
              {...register("date_fin")}
              className={inputClassName}
            />

            {errors.date_fin && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.date_fin.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>
              Motif
            </label>

            <textarea
              {...register("motif")}
              rows={4}
              placeholder="Expliquez brièvement le motif de votre demande..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2F67F6] focus:ring-4 focus:ring-[#2F67F6]/10"
            />

            {errors.motif && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.motif.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting || employeeId === null}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1742A0] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10347F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Send size={18} />
              )}

              {isSubmitting
                ? "Envoi en cours..."
                : "Envoyer la demande"}
            </button>
          </div>
        </form>
      </div>

      {/* Historique */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-[#0F2557]">
            Historique des demandes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Consultez le statut de vos demandes de congé.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="flex items-center gap-3 text-[#1742A0]">
              <LoaderCircle className="animate-spin" />

              <span className="text-sm font-semibold">
                Chargement des demandes...
              </span>
            </div>
          </div>
        ) : leaves.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CalendarDays
              size={38}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-[#0F2557]">
              Aucune demande de congé
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Vos prochaines demandes apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#F7F9FD]">
                <tr className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Début</th>
                  <th className="px-6 py-4">Fin</th>
                  <th className="px-6 py-4">Jours</th>
                  <th className="px-6 py-4">Motif</th>
                  <th className="px-6 py-4">Statut</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="transition hover:bg-[#F9FBFF]"
                  >
                    <td className="px-6 py-4 font-semibold text-[#0F2557]">
                      {leave.type_conge}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(leave.date_debut)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(leave.date_fin)}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {leave.nombre_jours}
                    </td>

                    <td className="max-w-[220px] truncate px-6 py-4 text-sm text-slate-600">
                      {leave.motif}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                          leave.statut
                        )}`}
                      >
                        {getStatusLabel(leave.statut)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}