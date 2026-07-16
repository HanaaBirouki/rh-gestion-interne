// frontend/src/pages/RequestsPage.jsx
import React, { useState, useEffect } from "react"
import { FileCheck, Download, Clock, CheckCircle, XCircle } from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import api from "../services/api"

const RequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [docType, setDocType] = useState("WORK_CERTIFICATE")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/employee/document-requests/")
        setRequests(response.data)
      } catch (error) {
        console.error("Erreur chargement demandes:", error)
        // Données fictives
        setRequests([
          { id: 1, type: "WORK_CERTIFICATE", status: "PENDING", created_at: "2026-07-10" },
          { id: 2, type: "SALARY_CERTIFICATE", status: "READY", created_at: "2026-07-05", file_url: "/documents/attestation.pdf" },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const handleSubmit = async () => {
    try {
      await api.post("/employee/document-requests/", { type: docType })
      alert("Demande envoyée avec succès.")
      // Recharger la liste
      const response = await api.get("/employee/document-requests/")
      setRequests(response.data)
    } catch (error) {
      alert("Erreur lors de l'envoi de la demande.")
    }
  }

  const typeLabels = {
    WORK_CERTIFICATE: "Attestation de travail",
    SALARY_CERTIFICATE: "Attestation de salaire",
    WORK_CONTRACT_CERT: "Certificat de travail",
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "READY":
        return <Badge variant="success">Prêt</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Refusé</Badge>
      default:
        return <Badge variant="warning">En attente</Badge>
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-on-surface mb-2">Demandes de documents</h1>
      <p className="text-on-surface-variant text-sm mb-6">Demandez vos documents administratifs et suivez leur statut.</p>

      {/* Nouvelle demande */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 border border-outline-variant mb-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4">Nouvelle demande</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label>Type de document</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WORK_CERTIFICATE">Attestation de travail</SelectItem>
                <SelectItem value="SALARY_CERTIFICATE">Attestation de salaire</SelectItem>
                <SelectItem value="WORK_CONTRACT_CERT">Certificat de travail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleSubmit}>Envoyer la demande</Button>
          </div>
        </div>
      </div>

      {/* Suivi des demandes */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 border border-outline-variant">
        <h2 className="text-lg font-semibold text-on-surface mb-4">Suivi des demandes</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container"></div>
          </div>
        ) : requests.length === 0 ? (
          <p className="text-on-surface-variant text-sm py-8 text-center">Aucune demande de document.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between border border-outline-variant rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <FileCheck className="text-primary-container" size={24} />
                  <div>
                    <h3 className="font-semibold text-on-surface">{typeLabels[req.type] || req.type}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-on-surface-variant">Demandé le : {req.created_at}</span>
                      {getStatusBadge(req.status)}
                    </div>
                  </div>
                </div>
                {req.status === "READY" && req.file_url && (
                  <Button variant="default" size="sm" asChild>
                    <a href={req.file_url} download target="_blank" rel="noreferrer">
                      <Download size={16} className="mr-2" />
                      Télécharger
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RequestsPage