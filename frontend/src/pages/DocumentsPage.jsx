// frontend/src/pages/DocumentsPage.jsx
import React, { useEffect, useMemo, useState } from "react"
import {
  Download,
  FileText,
  Search,
  AlertCircle,
  FolderOpen,
} from "lucide-react"

import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import api from "../services/api"

const BACKEND_URL = "http://127.0.0.1:8000"

const typeLabels = {
  CONTRACT: "Contrat",
  ADDENDUM: "Avenant",
  WORK_CERT: "Attestation de travail",
  SALARY_CERT: "Attestation de salaire",
  INTERNAL_RULES: "Règlement intérieur",
  CNSS_CARD: "Carte CNSS",
  OTHER: "Autre",
}

const formatDate = (date) => {
  if (!date) return "Date non disponible"

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

const getFileUrl = (fileUrl) => {
  if (!fileUrl) return null

  if (
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://")
  ) {
    return fileUrl
  }

  return `${BACKEND_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/employee/documents/")

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || []

      setDocuments(data)
    } catch (error) {
      console.error("Erreur chargement documents :", error)

      setError(
        error.response?.data?.detail ||
          "Impossible de charger vos documents."
      )

      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) return documents

    return documents.filter((document) => {
      const name = document.name?.toLowerCase() || ""
      const type =
        typeLabels[document.type]?.toLowerCase() ||
        document.type?.toLowerCase() ||
        ""

      return name.includes(search) || type.includes(search)
    })
  }, [documents, searchTerm])

  const handleDownload = async (document) => {
    const fileUrl = getFileUrl(
      document.file_url || document.file
    )

    if (!fileUrl) {
      setError("Aucun fichier n’est disponible pour ce document.")
      return
    }

    try {
      setDownloadingId(document.id)
      setError("")

      const token = localStorage.getItem("access")

      const response = await fetch(fileUrl, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      })

      if (!response.ok) {
        throw new Error("Téléchargement impossible")
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      const extension =
        fileUrl.split(".").pop()?.split("?")[0] || "pdf"

      const link = window.document.createElement("a")

      link.href = downloadUrl
      link.download = `${document.name || "document"}.${extension}`

      window.document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Erreur téléchargement :", error)
      setError("Impossible de télécharger ce document.")
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Espace employé
          </p>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Documents officiels
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Consultez et téléchargez les documents transmis par
            l’administration.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Mes documents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {documents.length} document
                  {documents.length > 1 ? "s" : ""} disponible
                  {documents.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  type="search"
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                  <p className="mt-4 text-sm text-slate-500">
                    Chargement des documents...
                  </p>
                </div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <FolderOpen size={30} className="text-blue-600" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Aucun document trouvé
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  {searchTerm
                    ? "Aucun document ne correspond à votre recherche."
                    : "Aucun document n’a encore été ajouté à votre espace."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((document) => {
                  const hasFile = Boolean(
                    document.file_url || document.file
                  )

                  return (
                    <div
                      key={document.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                          <FileText
                            size={24}
                            className="text-blue-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {document.name || "Document sans nom"}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge className="border-0 bg-blue-50 text-blue-700 hover:bg-blue-50">
                              {typeLabels[document.type] ||
                                document.type ||
                                "Document"}
                            </Badge>

                            <span className="text-xs text-slate-500">
                              Ajouté le{" "}
                              {formatDate(document.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        disabled={
                          !hasFile ||
                          downloadingId === document.id
                        }
                        onClick={() => handleDownload(document)}
                        className="h-10 rounded-xl bg-blue-600 px-4 hover:bg-blue-700 sm:shrink-0"
                      >
                        {downloadingId === document.id ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <Download size={17} className="mr-2" />
                            Télécharger
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsPage