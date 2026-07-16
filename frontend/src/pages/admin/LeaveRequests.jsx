// frontend/src/pages/admin/LeaveRequests.jsx
import React, { useState, useEffect } from "react"
import { CalendarCheck, CheckCircle, XCircle, Clock } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import PageHeader from "../../components/layout/PageHeader"
import api from "../../services/api"

const LeaveRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState({})

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/admin/leave-requests/")
        setRequests(response.data)
      } catch (error) {
        console.error("Erreur chargement demandes:", error)
        // Données fictives
        setRequests([
          { id: 1, user_name: "Hanae Birouki", type: "PAID", start_date: "2026-07-13", end_date: "2026-07-16", working_days: 3, reason: "Vacances en famille", status: "PENDING" },
          { id: 2, user_name: "Marwa Boubekri", type: "SICK", start_date: "2026-07-20", end_date: "2026-07-21", working_days: 2, reason: "Rendez-vous médical", status: "PENDING" },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const handleReview = async (id, status) => {
    try {
      await api.post(`/admin/leave-requests/${id}/review/`, {
        status,
        admin_comment: comments[id] || "",
      })
      setRequests(prev => prev.filter(r => r.id !== id))
    } catch (error) {
      console.error("Erreur traitement demande:", error)
    }
  }

  const typeLabels = {
    PAID: "Congé payé",
    RTT: "RTT",
    UNPAID: "Sans solde",
    SICK: "Maladie",
  }

  return (
    <>
      <PageHeader
        icon={CalendarCheck}
        title="Demandes de congés"
        subtitle="Validez ou refusez les demandes de congés des employés"
      />

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 text-center">
            <Clock className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
            <p className="text-on-surface-variant">Aucune demande de congé en attente.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collaborateur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Jours</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.user_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{typeLabels[r.type] || r.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {r.start_date} → {r.end_date}
                    </TableCell>
                    <TableCell>{r.working_days}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.reason}</TableCell>
                    <TableCell>
                      <Textarea
                        placeholder="Commentaire (optionnel)"
                        className="w-40"
                        value={comments[r.id] || ""}
                        onChange={(e) =>
                          setComments((prev) => ({ ...prev, [r.id]: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleReview(r.id, "APPROVED")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReview(r.id, "REJECTED")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Refuser
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  )
}

export default LeaveRequests