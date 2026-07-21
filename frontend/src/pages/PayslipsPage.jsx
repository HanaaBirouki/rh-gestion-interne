// frontend/src/pages/PayslipsPage.jsx
import React, { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  Download,
  FileText,
  ReceiptText,
  AlertCircle,
} from "lucide-react"

import { Button } from "../components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

import api from "../services/api"

const BACKEND_URL = "http://127.0.0.1:8000"

const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

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

const PayslipsPage = () => {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    fetchPayslips()
  }, [])

  const fetchPayslips = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/employee/payslips/")

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || []

      setPayslips(data)

      if (data.length > 0) {
        const mostRecentYear = Math.max(
          ...data.map((payslip) => Number(payslip.year))
        )

        setYearFilter(String(mostRecentYear))
      }
    } catch (error) {
      console.error("Erreur chargement bulletins :", error)

      setError(
        error.response?.data?.detail ||
          "Impossible de charger vos bulletins de paie."
      )

      setPayslips([])
    } finally {
      setLoading(false)
    }
  }

  const years = useMemo(() => {
    return [
      ...new Set(
        payslips
          .map((payslip) => Number(payslip.year))
          .filter(Boolean)
      ),
    ].sort((a, b) => b - a)
  }, [payslips])

  const filteredPayslips = useMemo(() => {
    if (yearFilter === "all") {
      return payslips
    }

    return payslips.filter(
      (payslip) => Number(payslip.year) === Number(yearFilter)
    )
  }, [payslips, yearFilter])

  const handleDownload = async (payslip) => {
    const fileUrl = getFileUrl(
      payslip.file_url || payslip.file
    )

    if (!fileUrl) {
      setError("Aucun fichier PDF n’est disponible pour ce bulletin.")
      return
    }

    try {
      setDownloadingId(payslip.id)
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

      const month =
        monthNames[Number(payslip.month) - 1] || payslip.month

      const link = window.document.createElement("a")

      link.href = downloadUrl
      link.download = `bulletin-${month}-${payslip.year}.pdf`

      window.document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Erreur téléchargement bulletin :", error)
      setError("Impossible de télécharger ce bulletin.")
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
            Bulletins de paie
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Consultez et téléchargez vos bulletins mensuels.
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
                  Historique des bulletins
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredPayslips.length} bulletin
                  {filteredPayslips.length > 1 ? "s" : ""} affiché
                  {filteredPayslips.length > 1 ? "s" : ""}
                </p>
              </div>

              <Select
                value={yearFilter}
                onValueChange={setYearFilter}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 sm:w-40">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    Toutes les années
                  </SelectItem>

                  {years.map((year) => (
                    <SelectItem
                      key={year}
                      value={String(year)}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                  <p className="mt-4 text-sm text-slate-500">
                    Chargement des bulletins...
                  </p>
                </div>
              </div>
            ) : filteredPayslips.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <ReceiptText
                    size={30}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Aucun bulletin trouvé
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Aucun bulletin de paie n’est disponible pour cette année.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayslips.map((payslip) => {
                  const month =
                    monthNames[Number(payslip.month) - 1] ||
                    "Mois inconnu"

                  const hasFile = Boolean(
                    payslip.file_url || payslip.file
                  )

                  return (
                    <div
                      key={payslip.id}
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
                            Bulletin {month} {payslip.year}
                          </h3>

                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <Calendar size={15} />
                            <span>
                              {month} {payslip.year}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        disabled={
                          !hasFile ||
                          downloadingId === payslip.id
                        }
                        onClick={() => handleDownload(payslip)}
                        className="h-10 rounded-xl bg-blue-600 px-4 hover:bg-blue-700 sm:shrink-0"
                      >
                        {downloadingId === payslip.id ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <Download size={17} className="mr-2" />
                            Télécharger PDF
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

export default PayslipsPage