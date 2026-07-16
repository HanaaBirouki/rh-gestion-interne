// frontend/src/pages/DocumentsPage.jsx
import React, { useState, useEffect } from "react"
import { FileText, Download, Search } from "lucide-react"

import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import api from "../services/api"

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get("/employee/documents/")
        setDocuments(response.data)
      } catch (error) {
        console.error("Erreur chargement documents:", error)
        // Données fictives
        setDocuments([
          { id: 1, name: "Contrat de travail", type: "CONTRACT", created_at: "2026-01-01", file_url: "/documents/contrat.pdf" },
          { id: 2, name: "Attestation de travail", type: "WORK_CERT", created_at: "2026-03-15", file_url: "/documents/attestation.pdf" },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const typeLabels = {
    CONTRACT: "Contrat",
    ADDENDUM: "Avenant",
    WORK_CERT: "Attestation",
    OTHER: "Autre",
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-on-surface mb-2">Documents officiels</h1>
      <p className="text-on-surface-variant text-sm mb-6">Consultez et téléchargez vos documents RH.</p>

      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 border border-outline-variant">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
            <Input
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container"></div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <p className="text-on-surface-variant text-sm py-8 text-center">Aucun document trouvé.</p>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between border border-outline-variant rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-primary-container" size={24} />
                  <div>
                    <h3 className="font-semibold text-on-surface">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-on-surface-variant">{doc.created_at}</span>
                      <Badge variant="secondary" className="text-xs">{typeLabels[doc.type] || doc.type}</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="default" size="sm" asChild>
                  <a href={doc.file_url} download target="_blank" rel="noreferrer">
                    <Download size={16} className="mr-2" />
                    Télécharger
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentsPage