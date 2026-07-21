// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Users, UserPlus, FileText, Clock, User, Briefcase, FileCheck } from "lucide-react"

import api from "../services/api"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    nb_employes: 0,
    nb_stagiaires: 0,
    nb_freelances: 0,
    nb_demandes_attente: 0,
    nb_documents_attente: 0,
    nb_total_collaborateurs: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard/")
        setStats(response.data)
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
        // Données fictives en cas d'erreur
        setStats({
          nb_employes: 12,
          nb_stagiaires: 4,
          nb_freelances: 3,
          nb_demandes_attente: 5,
          nb_documents_attente: 3,
          nb_total_collaborateurs: 19,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: "Total collaborateurs", value: stats.nb_total_collaborateurs, icon: Users, color: "bg-blue-500" },
    { title: "Employés", value: stats.nb_employes, icon: User, color: "bg-green-500" },
    { title: "Stagiaires", value: stats.nb_stagiaires, icon: UserPlus, color: "bg-yellow-500" },
    { title: "Freelances", value: stats.nb_freelances, icon: Briefcase, color: "bg-purple-500" },
    { title: "Demandes de congés", value: stats.nb_demandes_attente, icon: Clock, color: "bg-orange-500" },
    { title: "Demandes de documents", value: stats.nb_documents_attente, icon: FileCheck, color: "bg-red-500" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Tableau de bord</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border border-outline-variant">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-on-surface-variant">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard