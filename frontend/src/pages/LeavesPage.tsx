import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function LeavesPage() {
  const [typeConge, setTypeConge] = useState("Congé annuel");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [motif, setMotif] = useState("");

  const [leaves, setLeaves] = useState([
    {
      type: "Congé annuel",
      debut: "2026-07-16",
      fin: "2026-07-22",
      jours: 5,
      motif: "Vacances",
      statut: "En attente",
    },
  ]);

  const calculerJours = () => {
    if (!dateDebut || !dateFin) return 0;

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (fin < debut) return 0;

    let jours = 0;
    const current = new Date(debut);

    while (current <= fin) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) jours++;
      current.setDate(current.getDate() + 1);
    }

    return jours;
  };

  const envoyerDemande = () => {
    const jours = calculerJours();

    if (!dateDebut || !dateFin || !motif) {
      alert("Remplissez tous les champs");
      return;
    }

    if (jours === 0) {
      alert("Vérifiez les dates");
      return;
    }

    setLeaves([
      {
        type: typeConge,
        debut: dateDebut,
        fin: dateFin,
        jours: jours,
        motif: motif,
        statut: "En attente",
      },
      ...leaves,
    ]);

    alert("Demande de congé envoyée avec succès");

    setDateDebut("");
    setDateFin("");
    setMotif("");
  };

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
            <select
              value={typeConge}
              onChange={(e) => setTypeConge(e.target.value)}
              className="border rounded-xl p-3"
            >
              <option>Congé annuel</option>
              <option>Congé maladie</option>
              <option>Congé exceptionnel</option>
              <option>Congé maternité</option>
            </select>

            <input
              type="number"
              value={calculerJours()}
              readOnly
              className="border rounded-xl p-3 bg-gray-100"
              placeholder="Nombre de jours"
            />

            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="border rounded-xl p-3"
            />

            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="border rounded-xl p-3"
            />

            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Motif de la demande"
              className="border rounded-xl p-3 md:col-span-2"
            />
          </div>

          <button
            onClick={envoyerDemande}
            className="mt-6 bg-[#8B5E3C] text-white px-6 py-3 rounded-xl hover:bg-[#6E472C]"
          >
            Envoyer la demande
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#3B3024] mb-6">
            Historique des demandes
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="p-3">Type</th>
                <th className="p-3">Début</th>
                <th className="p-3">Fin</th>
                <th className="p-3">Jours</th>
                <th className="p-3">Motif</th>
                <th className="p-3">Statut</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{leave.type}</td>
                  <td className="p-3">{leave.debut}</td>
                  <td className="p-3">{leave.fin}</td>
                  <td className="p-3">{leave.jours}</td>
                  <td className="p-3">{leave.motif}</td>
                  <td className="p-3">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      {leave.statut}
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