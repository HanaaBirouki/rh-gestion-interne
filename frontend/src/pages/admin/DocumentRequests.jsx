// frontend/src/pages/admin/DocumentRequests.jsx
import React, { useState, useEffect } from "react"
import { FileCheck, CheckCircle, XCircle, FileUp } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import PageHeader from "../../components/layout/PageHeader"
import api from "../../services/api"

const DocumentRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState({})

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/admin/document-requests/")
        setRequests(response.data)
      } catch (error) {
        console.error("Erreur chargement demandes:", error)
        // Données fictives
        setRequests([
          { id: 1, user_name: "Ouissam Invest", type: "WORK_CONTRACT_CERT", status: "PENDING" },
          { id: 2, user_name: "Hanae Birouki", type: "SALARY_CERTIFICATE", status: "PENDING" },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const handleMarkReady = async (id) => {
    const file = files[id]
    if (!file) {
      alert("Merci de sélectionner un fichier avant de marquer comme prêt.")
      return
    }
    try {
      const formData = new FormData()
      formData.append("file_url", file)
      formData.append("action", "READY")
      await api.patch(`/admin/document-requests/${id}/process/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setRequests(prev => prev.filter(r => r.id !== id))
    } catch (error) {
      console.error("Erreur traitement demande:", error)
    }
  }

  const typeLabels = {
    WORK_CERTIFICATE: "Attestation de travail",
    SALARY_CERTIFICATE: "Attestation de salaire",
    WORK_CONTRACT_CERT: "Certificat de travail",
  }

  return (
    <>
      <PageHeader
        icon={FileCheck}
        title="Demandes de documents"
        subtitle="Générez et mettez à disposition les documents demandés"
      />

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 text-center">
            <FileUp className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
            <p className="text-on-surface-variant">Aucune demande de document en attente.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collaborateur</TableHead>
                  <TableHead>Type de document</TableHead>
                  <TableHead>Fichier généré</TableHead>
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
                      <Input
                        type="file"
                        accept=".pdf"
                        className="w-56"
                        onChange={(e) =>
                          setFiles((prev) => ({ ...prev, [r.id]: e.target.files[0] }))
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleMarkReady(r.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Marquer comme prêt
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

export default DocumentRequests