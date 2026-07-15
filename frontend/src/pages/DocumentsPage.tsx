import Sidebar from "../components/Sidebar";
import { FileText, Download } from "lucide-react";

export default function DocumentsPage() {
 
 const documents = [
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
    <div className="flex min-h-screen bg-[#F8F5F0]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#3B3024]">
          Documents officiels
        </h1>

        <p className="text-gray-500 mt-2">
          Consultez et téléchargez vos documents RH.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-[#E8DED2] rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-[#8B5E3C]" />
                  <div>
                    <h3 className="font-semibold text-[#3B3024]">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Date : {doc.date}
                    </p>
                  </div>
                </div>

               <a
  href={doc.file}
  download
  target="_blank"
  rel="noreferrer"
  className="flex items-center gap-2 bg-[#8B5E3C] text-white px-4 py-2 rounded-xl hover:bg-[#6E472C]"
>
  <Download size={18} />
  Télécharger
</a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}