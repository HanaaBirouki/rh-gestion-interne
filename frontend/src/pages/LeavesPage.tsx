import Sidebar from "../components/Sidebar";

export default function LeavesPage() {
  const leaves = [
    { type: "Annuel", start: "10/08/2026", end: "15/08/2026", days: 5, status: "Validée" },
    { type: "Maladie", start: "20/09/2026", end: "22/09/2026", days: 3, status: "En attente" },
    { type: "Exceptionnel", start: "12/05/2026", end: "13/05/2026", days: 2, status: "Refusée" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F5F0]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#3B3024]">Mes Congés</h1>
        <p className="text-gray-500 mt-2">Gérez vos demandes de congé.</p>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#3B3024] mb-6">
            Nouvelle demande
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select className="border rounded-xl p-3">
              <option>Congé annuel</option>
              <option>Congé maladie</option>
              <option>Congé exceptionnel</option>
            </select>

            <input type="number" placeholder="Nombre de jours ouvrés" className="border rounded-xl p-3" />

            <input type="date" className="border rounded-xl p-3" />
            <input type="date" className="border rounded-xl p-3" />

            <textarea
              placeholder="Motif"
              className="border rounded-xl p-3 md:col-span-2"
            />
          </div>

          <button className="mt-6 bg-[#8B5E3C] text-white px-6 py-3 rounded-xl hover:bg-[#6E472C]">
            Envoyer la demande
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#3B3024] mb-6">
            Historique des demandes
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-3">Type</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Jours</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">{leave.type}</td>
                  <td>{leave.start}</td>
                  <td>{leave.end}</td>
                  <td>{leave.days}</td>
                  <td>
                    <span className="px-3 py-1 rounded-full text-sm bg-[#E8DED2] text-[#8B5E3C]">
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}