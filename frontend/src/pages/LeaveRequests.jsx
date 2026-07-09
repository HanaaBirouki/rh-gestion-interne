import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Données fictives en attendant la vraie connexion à l'API
const fakeLeaveRequests = [
  {
    id: "8f548ce7-7ca5-4bbf-bfb4-2fe04dfbb57d",
    user_name: "Hanae Birouki",
    type: "PAID",
    start_date: "2026-07-13",
    end_date: "2026-07-16",
    working_days: 3,
    reason: "Vacances en famille",
    status: "PENDING",
  },
  {
    id: "a5db11a4-f64d-4bbc-b3d8-7bff8564c1c3",
    user_name: "Marwa Boubekri",
    type: "SICK",
    start_date: "2026-07-20",
    end_date: "2026-07-21",
    working_days: 2,
    reason: "Rendez-vous médical",
    status: "PENDING",
  },
]

const typeLabels = {
  PAID: "Congé payé",
  RTT: "RTT",
  UNPAID: "Sans solde",
  SICK: "Maladie",
}

export default function LeaveRequests() {
  const [requests, setRequests] = useState(fakeLeaveRequests)
  const [comments, setComments] = useState({})

  const handleReview = (id, status) => {
    // Pour l'instant, mise à jour locale (plus tard : vrai appel API PATCH)
    setRequests((prev) => prev.filter((r) => r.id !== id))
    console.log("Décision envoyée :", {
      id,
      status,
      admin_comment: comments[id] || "",
    })
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Demandes de congés en attente</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">Aucune demande en attente.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collaborateur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Commentaire admin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.user_name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{typeLabels[r.type]}</Badge>
                </TableCell>
                <TableCell>
                  {r.start_date} → {r.end_date}
                </TableCell>
                <TableCell>{r.working_days}</TableCell>
                <TableCell className="max-w-xs">{r.reason}</TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Commentaire (optionnel)"
                    className="w-48"
                    value={comments[r.id] || ""}
                    onChange={(e) =>
                      setComments((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                  />
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleReview(r.id, "APPROVED")}
                  >
                    Valider
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReview(r.id, "REJECTED")}
                  >
                    Refuser
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}