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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Données fictives en attendant la vraie connexion à l'API
const fakeDocumentRequests = [
  {
    id: "fc10654d-f450-46d9-b189-c0e3ee00c8a0",
    user_name: "Ouissam Invest",
    type: "WORK_CONTRACT_CERT",
    status: "PENDING",
  },
  {
    id: "b2210654d-f450-46d9-b189-c0e3ee00c8b1",
    user_name: "Hanae Birouki",
    type: "SALARY_CERTIFICATE",
    status: "PENDING",
  },
]

const typeLabels = {
  WORK_CERTIFICATE: "Attestation de travail",
  SALARY_CERTIFICATE: "Attestation de salaire",
  WORK_CONTRACT_CERT: "Certificat de travail",
}

export default function DocumentRequests() {
  const [requests, setRequests] = useState(fakeDocumentRequests)
  const [files, setFiles] = useState({})

  const handleMarkReady = (id) => {
    const file = files[id]
    if (!file) {
      alert("Merci de sélectionner un fichier avant de marquer comme prêt.")
      return
    }
    // Pour l'instant, mise à jour locale (plus tard : vrai appel API PATCH avec le fichier)
    console.log("Document prêt, envoi à l'API :", { id, file: file.name })
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Demandes de documents en attente</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">Aucune demande en attente.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collaborateur</TableHead>
              <TableHead>Type de document</TableHead>
              <TableHead>Fichier généré</TableHead>
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
                  <Input
                    type="file"
                    accept=".pdf"
                    className="w-56"
                    onChange={(e) =>
                      setFiles((prev) => ({ ...prev, [r.id]: e.target.files[0] }))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleMarkReady(r.id)}>
                    Marquer comme prêt
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