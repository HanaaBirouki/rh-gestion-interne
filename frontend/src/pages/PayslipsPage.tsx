import Sidebar from "../components/Sidebar";
import { FileText, Download } from "lucide-react";

export default function PayslipsPage() {
  const payslips = [
    { month: "Janvier", year: "2026", date: "31/01/2026" },
    { month: "Février", year: "2026", date: "28/02/2026" },
    { month: "Mars", year: "2026", date: "31/03/2026" },
    { month: "Avril", year: "2026", date: "30/04/2026" },
    { month: "Mai", year: "2026", date: "31/05/2026" },
    { month: "Juin", year: "2026", date: "30/06/2026" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F5F0]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#3B3024]">
          Bulletins de paie
        </h1>

        <p className="text-gray-500 mt-2">
          Consultez et téléchargez vos bulletins mensuels.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#3B3024]">
              Historique des bulletins
            </h2>

            <select className="border rounded-xl p-3">
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>

          <div className="space-y-4">
            {payslips.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-[#E8DED2] rounded-xl p-4 hover:shadow-md hover:-translate-y-1 transition"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-[#8B5E3C]" />

                  <div>
                    <h3 className="font-semibold text-[#3B3024]">
                      Bulletin {item.month} {item.year}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Date : {item.date}
                    </p>
                  </div>
                </div>

                <button className="flex items-center gap-2 bg-[#8B5E3C] text-white px-4 py-2 rounded-xl hover:bg-[#6E472C]">
                  <Download size={18} />
                  Télécharger PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}