// frontend/src/pages/EmployeeDashboard.jsx
import React from "react"
import { Calendar, CheckCircle, Clock, Plane, Bell, Search } from "lucide-react"
import { useAuth } from "../hooks/useAuth"


const EmployeeDashboard = () => {
  const { user, fullName } = useAuth()

  const stats = [
    { title: "Congés alloués", value: 18, icon: <Calendar size={28} />, color: "text-blue-500" },
    { title: "Congés pris", value: 5, icon: <CheckCircle size={28} />, color: "text-green-500" },
    { title: "En attente", value: 2, icon: <Clock size={28} />, color: "text-yellow-500" },
    { title: "Restants", value: 11, icon: <Plane size={28} />, color: "text-purple-500" },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface">
          Bienvenue, {fullName || "Employé"} 👋
        </h1>
        <p className="text-on-surface-variant mt-1">
          Voici votre espace personnel RH.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-surface-container-lowest rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-outline-variant"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-on-surface-variant">{item.title}</p>
                <h2 className="text-3xl font-bold text-on-surface mt-2">
                  {item.value}
                </h2>
              </div>
              <div className={`${item.color} opacity-70`}>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Activités récentes */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 border border-outline-variant">
        <h2 className="text-xl font-semibold text-on-surface mb-4">
          Activités récentes
        </h2>
        <p className="text-on-surface-variant text-sm">
          Aucune activité récente à afficher.
        </p>
      </div>
    </div>
  )
}

export default EmployeeDashboard