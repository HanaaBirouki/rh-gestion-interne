import { useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  FileText,
  ReceiptText,
} from "lucide-react";

import AppLayout from "../components/AppLayout";

type Payslip = {
  month: string;
  year: string;
  date: string;
  file: string;
};

export default function PayslipsPage() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const payslips: Payslip[] = [
    {
      month: "Janvier",
      year: "2026",
      date: "31/01/2026",
      file: "/documents/bulletin-janvier.pdf",
    },
    {
      month: "Février",
      year: "2026",
      date: "28/02/2026",
      file: "/documents/bulletin-fevrier.pdf",
    },
    {
      month: "Mars",
      year: "2026",
      date: "31/03/2026",
      file: "/documents/bulletin-janvier.pdf",
    },
    {
      month: "Avril",
      year: "2026",
      date: "30/04/2026",
      file: "/documents/bulletin-fevrier.pdf",
    },
    {
      month: "Mai",
      year: "2026",
      date: "31/05/2026",
      file: "/documents/bulletin-janvier.pdf",
    },
    {
      month: "Juin",
      year: "2026",
      date: "30/06/2026",
      file: "/documents/bulletin-fevrier.pdf",
    },
  ];

  const availableYears = useMemo(() => {
    return Array.from(
      new Set(payslips.map((payslip) => payslip.year))
    ).sort((a, b) => Number(b) - Number(a));
  }, [payslips]);

  const filteredPayslips = useMemo(() => {
    return payslips.filter(
      (payslip) => payslip.year === selectedYear
    );
  }, [payslips, selectedYear]);

  return (
    <AppLayout
      title="Bulletins de paie"
      subtitle="Consultez et téléchargez vos bulletins mensuels."
    >
      <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,37,87,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0F2557]">
              Historique des bulletins
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Retrouvez vos bulletins de paie par année.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#EEF4FF] to-[#DDE8FF] px-4 py-2 text-sm font-semibold text-[#1742A0]">
              <ReceiptText size={18} />

              {filteredPayslips.length} bulletins
            </div>

            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(event.target.value)
                }
                className="h-11 min-w-[130px] appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-[#0F2557] outline-none transition focus:border-[#2F67F6] focus:ring-4 focus:ring-[#2F67F6]/10"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredPayslips.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ReceiptText
              size={44}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-semibold text-[#0F2557]">
              Aucun bulletin disponible
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Aucun bulletin n’est disponible pour l’année sélectionnée.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPayslips.map((payslip) => (
              <div
                key={`${payslip.month}-${payslip.year}`}
                className="flex flex-col gap-4 px-6 py-5 transition-all duration-300 hover:bg-[#F6F9FF] hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E7EEFF] text-[#1742A0]">
                    <FileText size={24} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#0F2557]">
                      Bulletin {payslip.month} {payslip.year}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Disponible depuis le {payslip.date}
                    </p>
                  </div>
                </div>

                <a
                  href={payslip.file}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1742A0] to-[#2457D6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Download size={18} />
                  Télécharger PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}