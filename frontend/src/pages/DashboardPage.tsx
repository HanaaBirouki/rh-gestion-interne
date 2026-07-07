import Sidebar from "../components/Sidebar";
import { Calendar, CheckCircle, Clock, Plane, Bell, Search, UserCircle } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Congés alloués", value: 18, icon: <Calendar size={28} /> },
    { title: "Congés pris", value: 5, icon: <CheckCircle size={28} /> },
    { title: "En attente", value: 2, icon: <Clock size={28} /> },
    { title: "Restants", value: 11, icon: <Plane size={28} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F5F0]">
      <Sidebar />

      <main className="flex-1 p-10">
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
            <UserCircle size={45} className="text-[#8B5E3C]" />
            <div>
              <h3 className="font-semibold">Marwa Boubekri</h3>
              <p className="text-sm text-gray-500">Employée</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">{item.title}</p>
                  <h2 className="text-4xl font-bold text-[#8B5E3C] mt-3">
                    {item.value}
                  </h2>
                </div>
                <div className="text-[#8B5E3C]">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}