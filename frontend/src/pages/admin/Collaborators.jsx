// frontend/src/pages/admin/Collaborators.jsx
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, Search, Filter } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import api from "../../services/api"
import PageHeader from "../../components/layout/PageHeader"

const Collaborators = () => {
  const [collaborators, setCollaborators] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await api.get("/auth/users/")
        setCollaborators(response.data)
      } catch (error) {
        console.error("Erreur chargement collaborateurs:", error)
        // Données fictives
        setCollaborators([
          { id: 1, first_name: "Hanae", last_name: "Birouki", email: "hanae@test.com", role: "EMPLOYE", contract_type: "CDI", is_active: true },
          { id: 2, first_name: "Marwa", last_name: "Boubekri", email: "marwa@test.com", role: "STAGIAIRE", contract_type: "STAGE", is_active: true },
          { id: 3, first_name: "Ouissam", last_name: "Invest", email: "ouissam@test.com", role: "EMPLOYE", contract_type: "CDD", is_active: false },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchCollaborators()
  }, [])

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.post(`/auth/users/${id}/activate/`, { is_active: !currentStatus })
      setCollaborators(prev =>
        prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c)
      )
    } catch (error) {
      console.error("Erreur activation/désactivation:", error)
    }
  }

  const filtered = collaborators.filter(c => {
    const matchSearch = `${c.first_name} ${c.last_name} ${c.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchRole = roleFilter === "ALL" ? true : c.role === roleFilter
    return matchSearch && matchRole
  })

  const roleLabels = {
    ADMIN: <Badge variant="default">Admin</Badge>,
    EMPLOYE: <Badge variant="secondary">Employé</Badge>,
    STAGIAIRE: <Badge variant="warning">Stagiaire</Badge>,
    FREELANCE: <Badge variant="outline">Freelance</Badge>,
  }

  return (
    <>
      <PageHeader
        icon={Users}
        title="Collaborateurs"
        subtitle="Gérez tous les collaborateurs de l'entreprise"
        action={
          <Link to="/admin/collaborators/create">
            <Button>
              <Users className="w-4 h-4 mr-2" />
              Nouveau collaborateur
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
            <Input
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-48">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les rôles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EMPLOYE">Employé</SelectItem>
                <SelectItem value="STAGIAIRE">Stagiaire</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container"></div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Contrat</TableHead>
                  <TableHead>Actif</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-on-surface-variant">
                      Aucun collaborateur trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        {c.first_name} {c.last_name}
                      </TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{roleLabels[c.role] || c.role}</TableCell>
                      <TableCell>{c.contract_type}</TableCell>
                      <TableCell>
                        <Switch
                          checked={c.is_active}
                          onCheckedChange={() => handleToggleActive(c.id, c.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/collaborators/${c.id}/edit`}>
                          <Button variant="outline" size="sm">Modifier</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  )
}

export default Collaborators