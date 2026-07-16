import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Send,
  XCircle,
} from "lucide-react";

import AppLayout from "../components/AppLayout";

type RequestStatus = "En attente" | "Prêt" | "Refusé";

type DocumentRequest = {
  id: number;
  document: string;
  date: string;
  status: RequestStatus;
  file: string | null;
};

export default function RequestsPage() {
  const [document, setDocument] = useState("Attestation de travail");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const [requests, setRequests] = useState<DocumentRequest[]>([
    {
      id: 1,
      document: "Attestation de travail",
      date: "10/07/2026",
      status: "En attente",
      file: null,
    },
    {
      id: 2,
      document: "Attestation de salaire",
      date: "05/07/2026",
      status: "Prêt",
      file: "/documents/attestation.pdf",
    },
    {
      id: 3,
      document: "Certificat de travail",
      date: "01/07/2026",
      status: "Refusé",
      file: null,
    },
  ]);

  const pendingCount = useMemo(
    () =>
      requests.filter((request) => request.status === "En attente")
        .length,
    [requests]
  );

  const readyCount = useMemo(
    () =>
      requests.filter((request) => request.status === "Prêt").length,
    [requests]
  );

  const rejectedCount = useMemo(
    () =>
      requests.filter((request) => request.status === "Refusé").length,
    [requests]
  );

  const sendRequest = () => {
    setMessage("");

    if (!date) {
      setMessage("Choisissez une date pour envoyer la demande.");
      return;
    }

    const newRequest: DocumentRequest = {
      id: Date.now(),
      document,
      date,
      status: "En attente",
      file: null,
    };

    setRequests((currentRequests) => [
      newRequest,
      ...currentRequests,
    ]);

    setDate("");
    setMessage("Demande envoyée avec succès.");
  };

  const getStatusStyle = (status: RequestStatus) => {
    if (status === "Prêt") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "Refusé") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
  };

  const getStatusIcon = (status: RequestStatus) => {
    if (status === "Prêt") {
      return <CheckCircle2 size={15} />;
    }

    if (status === "Refusé") {
      return <XCircle size={15} />;
    }

    return <Clock3 size={15} />;
  };

  const inputClassName =
    "h-12 w-full rounded-xl border border-slate-200 " +
    "bg-[#FAFBFE] px-4 text-sm text-[#0F2557] outline-none " +
    "transition focus:border-[#2F67F6] focus:bg-white " +
    "focus:ring-4 focus:ring-[#2F67F6]/10";

  return (
    <AppLayout
      title="Demandes de documents"
      subtitle="Demandez vos documents administratifs et suivez leur statut."
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Prêtes
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {readyCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={22} />
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
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Nouvelle demande */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,37,87,0.08)]">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7EEFF] text-[#1742A0]">
              <FileText size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#0F2557]">
                Nouvelle demande
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choisissez le document administratif souhaité.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F2557]">
              Type de document
            </label>

            <select
              value={document}
              onChange={(event) => setDocument(event.target.value)}
              className={inputClassName}
            >
              <option value="Attestation de travail">
                Attestation de travail
              </option>

              <option value="Attestation de salaire">
                Attestation de salaire
              </option>

              <option value="Certificat de travail">
                Certificat de travail
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F2557]">
              Date souhaitée
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={sendRequest}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1742A0] to-[#2457D6] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Send size={18} />
              Envoyer la demande
            </button>

            {message && (
              <p
                className={`mt-4 rounded-xl border p-3 text-sm font-medium ${
                  message.includes("succès")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Suivi */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,37,87,0.08)]">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-[#0F2557]">
            Suivi des demandes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Consultez l’état de vos demandes administratives.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileCheck2
              size={44}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-[#0F2557]">
              Aucune demande
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Vos demandes apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-4 px-6 py-5 transition-all duration-300 hover:bg-[#F6F9FF] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E7EEFF] text-[#1742A0]">
                    <FileCheck2 size={24} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#0F2557]">
                      {request.document}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Demandé le {request.date}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                      request.status
                    )}`}
                  >
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>

                  {request.status === "Prêt" && request.file && (
                    <a
                      href={request.file}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1742A0] to-[#2457D6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <Download size={18} />
                      Télécharger
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}