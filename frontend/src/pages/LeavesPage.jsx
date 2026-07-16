// frontend/src/pages/LeavesPage.jsx
import React, { useState } from "react"
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"

const LeavesPage = () => {
  const [leaveType, setLeaveType] = useState("PAID")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      type: "PAID",
      start_date: "2026-07-16",
      end_date: "2026-07-22",
      working_days: 5,
      reason: "Vacances d'été",
      status: "PENDING",
    },
    {
      id: 2,
      type: "SICK",
      start_date: "2026-06-10",
      end_date: "2026-06-11",
      working_days: 2,
      reason: "Rendez-vous médical",
      status: "APPROVED",
    },
  ])

  const calculateWorkingDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) return 0
    let days = 0
    const current = new Date(start)
    while (current <= end) {
      const day = current.getDay()
      if (day !== 0 && day !== 6) days++
      current.setDate(current.getDate() + 1)
    }
    return days
  }

  const handleSubmit = () => {
    const workingDays = calculateWorkingDays()
    if (!startDate || !endDate || !reason) {
      alert("Veuillez remplir tous les champs.")
      return
    }
    if (workingDays === 0) {
      alert("Veuillez vérifier les dates.")
      return
    }
    setLeaves([
      {
        id: Date.now(),
        type: leaveType,
        start_date: startDate,
        end_date: endDate,
        working_days: workingDays,
        reason: reason,
        status: "PENDING",
      },
      ...leaves,
    ])
    setStartDate("")
    setEndDate("")
    setReason("")
    alert("Demande de congé envoyée avec succès.")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">Validée</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Refusée</Badge>
      default:
        return <Badge variant="warning">En attente</Badge>
    }
  }

  const typeLabels = {
    PAID: "Congé payé",
    RTT: "RTT",
    UNPAID: "Sans solde",
    SICK: "Maladie",
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-on-surface mb-2">Mes Congés</h1>
      <p className="text-on-surface-variant text-sm mb-6">Gérez vos demandes de congé.</p>

      {/* Nouvelle demande */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 border border-outline-variant mb-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4">Nouvelle demande</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Type de congé</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAID">Congé payé</SelectItem>
                <SelectItem value="RTT">RTT</SelectItem>
                <SelectItem value="UNPAID">Sans solde</SelectItem>
                <SelectItem value="SICK">Maladie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Nombre de jours</Label>
            <Input type="number" value={calculateWorkingDays()} readOnly className="mt-1 bg-surface-container" />
          </div>
          <div>
            <Label>Date de début</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Date de fin</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>Motif</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motif de la demande" className="mt-1" />
          </div>
        </div>
        <Button onClick={handleSubmit} className="mt-4">Envoyer la demande</Button>
      </div>

      {/* Historique */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 border border-outline-variant">
        <h2 className="text-lg font-semibold text-on-surface mb-4">Historique des demandes</h2>
        {leaves.length === 0 ? (
          <p className="text-on-surface-variant text-sm">Aucune demande de congé.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="p-3 text-sm text-on-surface-variant">Type</th>
                  <th className="p-3 text-sm text-on-surface-variant">Début</th>
                  <th className="p-3 text-sm text-on-surface-variant">Fin</th>
                  <th className="p-3 text-sm text-on-surface-variant">Jours</th>
                  <th className="p-3 text-sm text-on-surface-variant">Motif</th>
                  <th className="p-3 text-sm text-on-surface-variant">Statut</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id} className="border-b border-outline-variant/50">
                    <td className="p-3 text-sm">{typeLabels[leave.type] || leave.type}</td>
                    <td className="p-3 text-sm">{leave.start_date}</td>
                    <td className="p-3 text-sm">{leave.end_date}</td>
                    <td className="p-3 text-sm">{leave.working_days}</td>
                    <td className="p-3 text-sm">{leave.reason}</td>
                    <td className="p-3">{getStatusBadge(leave.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeavesPage