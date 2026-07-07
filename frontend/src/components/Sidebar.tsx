import {
  LayoutDashboard,
  User,
  Calendar,
  FileText,
  File,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#3B3024] text-white flex flex-col justify-between min-h-screen">
      <div>
        <div className="p-8">
          <h1 className="text-4xl font-bold text-[#E6B980]">RH Gestion</h1>
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-4">
          <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#8B5E3C]">
            <LayoutDashboard size={22} />
            Dashboard
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#8B5E3C]">
            <User size={22} />
            Profil
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#8B5E3C]">
            <Calendar size={22} />
            Congés
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#8B5E3C]">
            <FileText size={22} />
            Documents
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#8B5E3C]">
            <File size={22} />
            Bulletins
          </button>
        </nav>
      </div>

      <div className="p-6">
        <button className="w-full flex items-center justify-center gap-3 bg-[#8B5E3C] rounded-xl py-4">
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}