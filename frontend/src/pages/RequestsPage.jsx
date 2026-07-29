// frontend/src/pages/RequestsPage.jsx
import React, { useEffect, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  Send,
  XCircle,
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Badge } from "../components/ui/badge"

import api from "../services/api"

const BACKEND_URL = "http://127.0.0.1:8000"

const typeLabels = {
  WORK_CERTIFICATE: "Attestation de travail",
  SALARY_CERTIFICATE: "Attestation de salaire",
  WORK_CONTRACT_CERT: "Certificat de travail",
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

const formatDate = (date) => {
  if (!date) return "Date non disponible"

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

const RequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [docType, setDocType] = useState("WORK_CERTIFICATE")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get(
        "/employee/document-requests/"
      )

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || []

      setRequests(data)
    } catch (error) {
      console.error("Erreur chargement demandes :", error)

      setError(
        error.response?.data?.detail ||
          "Impossible de charger vos demandes."
      )

      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      await api.post("/employee/document-requests/", {
        type: docType,
      })

      setSuccess("Votre demande a été envoyée avec succès.")

      await fetchRequests()
    } catch (error) {
      console.error("Erreur envoi demande :", error)

      const apiError =
        error.response?.data?.type?.[0] ||
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Erreur lors de l’envoi de la demande."

      setError(apiError)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = async (requestItem) => {
    const fileUrl = getFileUrl(
      requestItem.file_url || requestItem.file
    )

    if (!fileUrl) {
      setError("Aucun fichier n’est disponible pour cette demande.")
      return
    }

    try {
      setDownloadingId(requestItem.id)
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

      const label =
        typeLabels[requestItem.type] || "document"

      const safeName = label
        .toLowerCase()
        .replaceAll(" ", "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

      const link = window.document.createElement("a")

      link.href = downloadUrl
      link.download = `${safeName}.pdf`

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "READY":
        return (
          <Badge className="border-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
            <CheckCircle2 size={14} className="mr-1" />
            Prêt
          </Badge>
        )

      case "REJECTED":
        return (
          <Badge className="border-0 bg-red-50 text-red-700 hover:bg-red-50">
            <XCircle size={14} className="mr-1" />
            Refusé
          </Badge>
        )

      default:
        return (
          <Badge className="border-0 bg-amber-50 text-amber-700 hover:bg-amber-50">
            <Clock3 size={14} className="mr-1" />
            En attente
          </Badge>
        )
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
            Demandes de documents
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Demandez vos documents administratifs et suivez leur
            traitement.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={20} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Nouvelle demande
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choisissez le document que vous souhaitez recevoir.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label
                htmlFor="document-type"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Type de document
              </Label>

              <Select
                value={docType}
                onValueChange={setDocType}
              >
                <SelectTrigger
                  id="document-type"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50"
                >
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="WORK_CERTIFICATE">
                    Attestation de travail
                  </SelectItem>

                  <SelectItem value="SALARY_CERTIFICATE">
                    Attestation de salaire
                  </SelectItem>

                  <SelectItem value="WORK_CONTRACT_CERT">
                    Certificat de travail
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="h-11 rounded-xl bg-blue-600 px-5 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send size={17} className="mr-2" />
                  Envoyer la demande
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900">
              Suivi des demandes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {requests.length} demande
              {requests.length > 1 ? "s" : ""} enregistrée
              {requests.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                  <p className="mt-4 text-sm text-slate-500">
                    Chargement des demandes...
                  </p>
                </div>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <FileCheck2
                    size={30}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Aucune demande
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Vous n’avez encore envoyé aucune demande de
                  document.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((requestItem) => {
                  const canDownload =
                    requestItem.status === "READY" &&
                    Boolean(
                      requestItem.file_url ||
                        requestItem.file
                    )

                  return (
                    <div
                      key={requestItem.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                          <FileCheck2
                            size={24}
                            className="text-blue-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {typeLabels[requestItem.type] ||
                              requestItem.type ||
                              "Document"}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-500">
                              Demandé le{" "}
                              {formatDate(
                                requestItem.created_at
                              )}
                            </span>

                            {getStatusBadge(
                              requestItem.status
                            )}
                          </div>

                          {requestItem.admin_comment && (
                            <p className="mt-2 text-sm text-slate-500">
                              Commentaire :{" "}
                              {requestItem.admin_comment}
                            </p>
                          )}
                        </div>
                      </div>

                      {canDownload && (
                        <Button
                          type="button"
                          onClick={() =>
                            handleDownload(requestItem)
                          }
                          disabled={
                            downloadingId === requestItem.id
                          }
                          className="h-10 rounded-xl bg-blue-600 px-4 hover:bg-blue-700 sm:shrink-0"
                        >
                          {downloadingId ===
                          requestItem.id ? (
                            <>
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Download
                                size={17}
                                className="mr-2"
                              />
                              Télécharger
                            </>
                          )}
                        </Button>
                      )}
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

export default RequestsPage