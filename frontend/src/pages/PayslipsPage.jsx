// frontend/src/pages/PayslipsPage.jsx
import React, { useState, useEffect } from "react"
import { FileText, Download, Calendar } from "lucide-react"

import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import api from "../services/api"

const PayslipsPage = () => {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const [yearFilter, setYearFilter] = useState("2026")

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const response = await api.get("/admin/payslips/")
        setPayslips(response.data)
      } catch (error) {
        console.error("Erreur chargement bulletins:", error)
        // Données fictives
        setPayslips([
          { id: 1, month: 1, year: 2026, file_url: "/payslips/janvier.pdf" },
          { id: 2, month: 2, year: 2026, file_url: "/payslips/fevrier.pdf" },
          { id: 3, month: 3, year: 2026, file_url: "/payslips/mars.pdf" },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchPayslips()
  }, [])

  const filteredPayslips = payslips.filter(p => p.year === parseInt(yearFilter))
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  const years = [...new Set(payslips.map(p => p.year))].sort((a, b) => b - a)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-on-surface mb-2">Bulletins de paie</h1>
      <p className="text-on-surface-variant text-sm mb-6">Consultez et téléchargez vos bulletins mensuels.</p>

      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 border border-outline-variant">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-on-surface">Historique des bulletins</h2>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container"></div>
          </div>
        ) : filteredPayslips.length === 0 ? (
          <p className="text-on-surface-variant text-sm py-8 text-center">Aucun bulletin trouvé pour cette année.</p>
        ) : (
          <div className="space-y-3">
            {filteredPayslips.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-outline-variant rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-primary-container" size={24} />
                  <div>
                    <h3 className="font-semibold text-on-surface">
                      Bulletin {monthNames[p.month - 1]} {p.year}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={14} className="text-on-surface-variant/50" />
                      <span className="text-xs text-on-surface-variant">{p.month}/{p.year}</span>
                    </div>
                  </div>
                </div>
                <Button variant="default" size="sm" asChild>
                  <a href={p.file_url} download target="_blank" rel="noreferrer">
                    <Download size={16} className="mr-2" />
                    Télécharger PDF
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

export default PayslipsPage