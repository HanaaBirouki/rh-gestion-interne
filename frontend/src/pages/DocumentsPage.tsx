import {
  Download,
  FileText,
  FolderOpen,
} from "lucide-react";

import AppLayout from "../components/AppLayout";

type EmployeeDocument = {
  name: string;
  date: string;
  file: string;
};

export default function DocumentsPage() {
  const documents: EmployeeDocument[] = [
    {
      name: "Contrat de travail",
      date: "01/01/2026",
      file: "/documents/contrat.pdf",
    },
    {
      name: "Attestation de travail",
      date: "15/03/2026",
      file: "/documents/attestation.pdf",
    },
    {
      name: "Bulletin Janvier",
      date: "31/01/2026",
      file: "/documents/bulletin-janvier.pdf",
    },
    {
      name: "Bulletin Février",
      date: "28/02/2026",
      file: "/documents/bulletin-fevrier.pdf",
    },
  ];

  return (
    <AppLayout
      title="Documents officiels"
      subtitle="Consultez et téléchargez vos documents RH."
    >
      <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0F2557]">
              Mes documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Retrouvez tous vos documents administratifs.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-[#EEF4FF] to-[#DDE8FF] px-4 py-2 text-sm font-semibold text-[#1742A0]">
            <FolderOpen size={18} />

            {documents.length} documents
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FolderOpen
              size={42}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-[#0F2557]">
              Aucun document disponible
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Vos documents apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map((document) => (
              <div
                key={document.file}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-[#F6F9FF] hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1742A0]">
                    <FileText size={22} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#0F2557]">
                      {document.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Ajouté le {document.date}
                    </p>
                  </div>
                </div>

                <a
                  href={document.file}
                  download
                  target="_blank"
                  rel="noreferrer"
className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1742A0] to-[#2457D6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Download size={18} />
                  Télécharger
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}