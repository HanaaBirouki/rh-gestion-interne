import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-4xl font-bold text-[#3B3024]">
          Dashboard Employé
        </h1>

        <p className="text-gray-500 mt-2">
          Bienvenue dans votre espace personnel RH.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Search className="text-[#8B5E3C]" />

        <Bell className="text-[#8B5E3C]" />

        <div className="flex items-center gap-3">
          <UserCircle
            size={45}
            className="text-[#8B5E3C]"
          />

          <div>
            <h3 className="font-semibold">
              Marwa Boubekri
            </h3>

            <p className="text-sm text-gray-500">
              Employée
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}