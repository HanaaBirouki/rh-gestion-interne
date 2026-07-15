import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FileCheck, Download } from "lucide-react";

export default function RequestsPage() {
  const [document, setDocument] = useState("Attestation de travail");
  const [date, setDate] = useState("");

  const [requests, setRequests] = useState([
    {
      document: "Attestation de travail",
      date: "10/07/2026",
      status: "En attente",
      file: "/documents/attestation.pdf",
    },
    {
      document: "Attestation de salaire",
      date: "05/07/2026",
      status: "Prêt",
      file: "/documents/attestation.pdf",
    },
    {
      document: "Certificat de travail",
      date: "01/07/2026",
      status: "Refusé",
      file: "/documents/attestation.pdf",
    },
  ]);

  const sendRequest = () => {
    if (date === "") {
      alert("Choisissez une date");
      return;
    }

    setRequests([
      {
        document,
        date,
        status: "En attente",
        file: "/documents/attestation.pdf",
      },
      ...requests,
    ]);

    alert("Demande envoyée avec succès");
    setDate("");
  };

  const getStatusStyle = (status: string) => {
    if (status === "Prêt") return "bg-green-100 text-green-700";
    if (status === "Refusé") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="flex min-h-screen bg-[#F8F5F0]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#3B3024]">
          Demandes de documents
        </h1>

        <p className="text-gray-500 mt-2">
          Demandez vos documents administratifs et suivez leur statut.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#3B3024] mb-6">
            Nouvelle demande
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="border rounded-xl p-3"
            >
              <option>Attestation de travail</option>
              <option>Attestation de salaire</option>
              <option>Certificat de travail</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-xl p-3"
            />
          </div>

          <button
            onClick={sendRequest}
            className="mt-6 bg-[#8B5E3C] text-white px-6 py-3 rounded-xl hover:bg-[#6E472C]"
          >
            Envoyer la demande
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#3B3024] mb-6">
            Suivi des demandes
          </h2>

          <div className="space-y-4">
            {requests.map((request, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-[#E8DED2] rounded-xl p-4 hover:shadow-md hover:-translate-y-1 transition"
              >
                <div className="flex items-center gap-4">
                  <FileCheck className="text-[#8B5E3C]" />

                  <div>
                    <h3 className="font-semibold text-[#3B3024]">
                      {request.document}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Demandé le : {request.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                  {request.status === "Prêt" && (
                    <a
                      href={request.file}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-[#8B5E3C] text-white px-4 py-2 rounded-xl hover:bg-[#6E472C]"
                    >
                      <Download size={18} />
                      Télécharger
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}