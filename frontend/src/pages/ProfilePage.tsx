import Sidebar from "../components/Sidebar";
import { Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#F8F5F0]">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-[#3B3024]">
          Mon Profil
        </h1>

        <p className="text-gray-500 mt-2">
          Consultez et mettez à jour vos informations personnelles.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8 max-w-4xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-28 h-28 rounded-full bg-[#E8DED2] flex items-center justify-center text-[#8B5E3C]">
              <Camera size={36} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#3B3024]">
                Marwa Boubekri
              </h2>
              <p className="text-gray-500">Employée RH</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="border rounded-xl p-3 bg-gray-100" value="Marwa" readOnly />
            <input className="border rounded-xl p-3 bg-gray-100" value="Boubekri" readOnly />
            <input className="border rounded-xl p-3 bg-gray-100" value="marwa@entreprise.com" readOnly />
            <input className="border rounded-xl p-3 bg-gray-100" value="EMP-2026-001" readOnly />

            <input className="border rounded-xl p-3" placeholder="Téléphone" />
            <input className="border rounded-xl p-3" placeholder="Adresse" />
          </div>

          <button className="mt-8 bg-[#8B5E3C] text-white px-6 py-3 rounded-xl hover:bg-[#6E472C]">
            Enregistrer
          </button>
        </div>
      </main>
    </div>
  );
}