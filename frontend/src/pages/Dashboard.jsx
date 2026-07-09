import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Données fictives en attendant la vraie connexion à l'API
const fakeData = {
  nb_employes: 12,
  nb_stagiaires: 4,
  nb_freelances: 3,
  nb_demandes_attente: 5,
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Employés" value={fakeData.nb_employes} />
        <StatCard title="Stagiaires" value={fakeData.nb_stagiaires} />
        <StatCard title="Freelances" value={fakeData.nb_freelances} />
        <StatCard title="Demandes en attente" value={fakeData.nb_demandes_attente} />
      </div>
    </div>
  )
}