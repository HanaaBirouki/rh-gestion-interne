// frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import {
  Users,
  UserPlus,
  Clock,
  User,
  Briefcase,
  FileCheck,
  PlusCircle,
  CalendarDays,
  FileText,
} from "lucide-react";

import api from "../services/api";

const AdminDashboard = ()=>{

const navigate = useNavigate();
  const [stats, setStats] = useState({
    nb_employes: 0,
    nb_stagiaires: 0,
    nb_freelances: 0,
    nb_demandes_attente: 0,
    nb_documents_attente: 0,
    nb_total_collaborateurs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard/");
        setStats(response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des statistiques :",
          error
        );

        // Données fictives en cas d'erreur

        setStats({
          nb_employes: 12,
          nb_stagiaires: 4,
          nb_freelances: 3,
          nb_demandes_attente: 5,
          nb_documents_attente: 2,
          nb_total_collaborateurs: 19,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Collaborateurs",
      value: stats.nb_total_collaborateurs,
      icon: Users,
      bg: "bg-blue-100",
      text: "text-blue-700",
    },

    {
      title: "Employés",
      value: stats.nb_employes,
      icon: User,
      bg: "bg-blue-200",
      text: "text-blue-800",
    },

    {
      title: "Stagiaires",
      value: stats.nb_stagiaires,
      icon: UserPlus,
      bg: "bg-sky-100",
      text: "text-sky-700",
    },

    {
      title: "Freelances",
      value: stats.nb_freelances,
      icon: Briefcase,
      bg: "bg-indigo-100",
      text: "text-indigo-700",
    },

    {
      title: "Congés",
      value: stats.nb_demandes_attente,
      icon: Clock,
      bg: "bg-cyan-100",
      text: "text-cyan-700",
    },

    {
      title: "Documents",
      value: stats.nb_documents_attente,
      icon: FileCheck,
      bg: "bg-slate-200",
      text: "text-slate-700",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-white to-blue-50">

      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800">
          Tableau de bord
        </h1>

        <p className="mt-2 text-slate-500 text-lg">
          Bienvenue dans votre espace administrateur RH.
        </p>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* STATISTIQUES */}

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.title}
                  className="
                  rounded-3xl
                  border-0
                  shadow-md
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  bg-white
                  "
                >
                  <CardContent className="p-6">

                    <div className="flex justify-between items-center">

                      <div>

                        <p className="text-slate-500 text-sm font-medium">
                          {stat.title}
                        </p>

                        <h2 className="text-4xl font-bold text-slate-800 mt-3">
                          {stat.value}
                        </h2>

                      </div>

                      <div
                        className={`
                        p-4
                        rounded-2xl
                        ${stat.bg}
                        `}
                      >
                        <Icon
                          className={`
                          w-7
                          h-7
                          ${stat.text}
                          `}
                        />
                      </div>

                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ACCES RAPIDE */}

<div className="mt-12">

<h2 className="text-2xl font-bold text-slate-800 mb-5">
Accès rapide
</h2>


<div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">


{/* AJOUTER */}


<Card

onClick={()=>navigate("/admin/collaborators/create")}

className="
rounded-2xl
shadow-md
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
cursor-pointer
bg-white
"
>

<CardContent className="p-5 flex items-center gap-4">

<PlusCircle className="text-blue-600"/>

<p className="font-medium">
Ajouter un collaborateur
</p>

</CardContent>

</Card>



{/* CONGES */}


<Card

onClick={()=>navigate("/admin/leave-requests")}

className="
rounded-2xl
shadow-md
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
cursor-pointer
bg-white
"
>

<CardContent className="p-5 flex items-center gap-4">

<CalendarDays className="text-blue-600"/>

<p className="font-medium">
Voir les congés
</p>

</CardContent>

</Card>



{/* DOCUMENTS */}


<Card

onClick={()=>navigate("/admin/documents")}

className="
rounded-2xl
shadow-md
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
cursor-pointer
bg-white
"
>

<CardContent className="p-5 flex items-center gap-4">

<FileText className="text-blue-600"/>

<p className="font-medium">
Gérer les documents
</p>

</CardContent>

</Card>




{/* COLLABORATEURS */}


<Card

onClick={()=>navigate("/admin/collaborators")}

className="
rounded-2xl
shadow-md
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
cursor-pointer
bg-white
"
>

<CardContent className="p-5 flex items-center gap-4">

<Users className="text-blue-600"/>

<p className="font-medium">
Voir les collaborateurs
</p>

</CardContent>

</Card>


</div>

</div>

          
        </>
      )}
    </div>
  );
};

export default AdminDashboard;