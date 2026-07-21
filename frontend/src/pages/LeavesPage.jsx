import React, { useEffect, useMemo, useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  XCircle,
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import api from "../services/api"

const typeLabels = {
  PAID: "Congé payé",
  RTT: "RTT",
  UNPAID: "Sans solde",
  SICK: "Maladie",
}

const LeavesPage = () => {
  const [leaveType, setLeaveType] = useState("PAID")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchLeaves = async () => {
    try {
      setLoading(true)
      const response = await api.get("/employee/leave-requests/")
      setLeaves(response.data)
    } catch (error) {
      console.error("Erreur chargement congés :", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [])

  const calculateWorkingDays = () => {
    if (!startDate || !endDate) return 0

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < start) return 0

    let days = 0
    const current = new Date(start)

    while (current <= end) {
      const day = current.getDay()

      if (day !== 0 && day !== 6) {
        days += 1
      }

      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const workingDays = calculateWorkingDays()

  const statistics = useMemo(() => {
    const approved = leaves.filter(
      (leave) => leave.status === "APPROVED"
    ).length

    const pending = leaves.filter(
      (leave) => leave.status === "PENDING"
    ).length

    const rejected = leaves.filter(
      (leave) => leave.status === "REJECTED"
    ).length

    return {
      total: leaves.length,
      approved,
      pending,
      rejected,
    }
  }, [leaves])

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      alert("Veuillez remplir tous les champs.")
      return
    }

    if (workingDays === 0) {
      alert("Veuillez vérifier les dates.")
      return
    }

    try {
      setSubmitting(true)

      await api.post("/employee/leave-requests/", {
        type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
      })

      alert("Demande de congé envoyée avec succès.")

      setLeaveType("PAID")
      setStartDate("")
      setEndDate("")
      setReason("")

      await fetchLeaves()
    } catch (error) {
      console.error("Erreur envoi demande congé :", error)
      alert("Erreur lors de l'envoi de la demande de congé.")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
            Validée
          </Badge>
        )

      case "REJECTED":
        return (
          <Badge className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
            Refusée
          </Badge>
        )

      default:
        return (
          <Badge className="border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
            En attente
          </Badge>
        )
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] p-6 lg:p-8">
      {/* Titre */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F2557]">
          Mes Congés
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Créez une demande et consultez son état d’avancement.
        </p>
      </div>

      {/* Statistiques */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Demandes totales
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {statistics.total}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2F67F6]">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Validées
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {statistics.approved}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                En attente
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {statistics.pending}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Refusées
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2557]">
                {statistics.rejected}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Nouvelle demande */}
      <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2F67F6]">
              <FileText size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0F2557]">
                Nouvelle demande
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complétez les informations relatives à votre congé.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label className="text-sm font-semibold text-[#0F2557]">
                Type de congé
              </Label>

              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="mt-2 h-12 rounded-xl border-slate-200 bg-white">
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
              <Label className="text-sm font-semibold text-[#0F2557]">
                Nombre de jours ouvrés
              </Label>

              <Input
                type="number"
                value={workingDays}
                readOnly
                className="mt-2 h-12 rounded-xl border-slate-200 bg-blue-50/60 text-center font-semibold text-[#0F2557]"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-[#0F2557]">
                Date de début
              </Label>

              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-2 h-12 rounded-xl border-slate-200"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-[#0F2557]">
                Date de fin
              </Label>

              <Input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="mt-2 h-12 rounded-xl border-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-sm font-semibold text-[#0F2557]">
                Motif
              </Label>

              <Textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Expliquez brièvement le motif de votre demande"
                className="mt-2 min-h-[120px] rounded-xl border-slate-200"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 h-12 rounded-xl bg-[#2457D6] px-6 font-semibold text-white shadow-sm hover:bg-[#1742A0]"
          >
            <Send size={18} className="mr-2" />

            {submitting ? "Envoi en cours..." : "Envoyer la demande"}
          </Button>
        </div>
      </section>

      {/* Historique */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-[#0F2557]">
            Historique des demandes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Retrouvez toutes vos demandes de congé.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-[#2F67F6]" />
          </div>
        ) : leaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <CalendarDays size={28} />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-600">
              Aucune demande de congé.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Vos prochaines demandes apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Début
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fin
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Jours
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Motif
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#0F2557]">
                      {typeLabels[leave.type] || leave.type}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {leave.start_date}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {leave.end_date}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {leave.working_days}
                    </td>

                    <td className="max-w-[280px] px-6 py-4 text-sm text-slate-600">
                      <p className="truncate" title={leave.reason}>
                        {leave.reason}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(leave.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default LeavesPage