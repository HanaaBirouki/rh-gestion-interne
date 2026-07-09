import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

const fakeCollaborators = [
  { id: 1, first_name: "Hanae", last_name: "Birouki", email: "hanae@test.com", role: "EMPLOYE", contract_type: "CDI", is_active_employee: true },
  { id: 2, first_name: "Marwa", last_name: "Boubekri", email: "marwa@test.com", role: "STAGIAIRE", contract_type: "STAGE", is_active_employee: true },
  { id: 3, first_name: "Ouissam", last_name: "Invest", email: "ouissam@test.com", role: "EMPLOYE", contract_type: "CDD", is_active_employee: false },
]

export default function Collaborators() {
  const [collaborators, setCollaborators] = useState(fakeCollaborators)
  const [roleFilter, setRoleFilter] = useState("ALL")

  const filtered = collaborators.filter((c) =>
    roleFilter === "ALL" ? true : c.role === roleFilter
  )

  const handleToggleActive = (id) => {
    setCollaborators((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_active_employee: !c.is_active_employee } : c
      )
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Liste des collaborateurs</h1>

      <div className="mb-4 w-48">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="EMPLOYE">Employé</SelectItem>
            <SelectItem value="STAGIAIRE">Stagiaire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Contrat</TableHead>
            <TableHead>Actif</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.first_name} {c.last_name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.role}</TableCell>
              <TableCell>{c.contract_type}</TableCell>
              <TableCell>
                <Switch
                  checked={c.is_active_employee}
                  onCheckedChange={() => handleToggleActive(c.id)}
                />
              </TableCell>
              <TableCell>
                <Link to={`/collaborators/${c.id}/edit`}>
                  <Button variant="outline" size="sm">Modifier</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}