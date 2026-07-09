import { NavLink, Outlet } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Wallet,
  CalendarCheck,
  FileCheck,
} from "lucide-react"

const navItems = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/collaborators", label: "Collaborateurs", icon: Users, end: true },
  { to: "/collaborators/create", label: "Nouveau collaborateur", icon: UserPlus, end: true },
  { to: "/documents/upload", label: "Documents", icon: FileText, end: true },
  { to: "/payslips/upload", label: "Bulletins de paie", icon: Wallet, end: true },
  { to: "/leave-requests", label: "Demandes de congés", icon: CalendarCheck, end: true },
  { to: "/document-requests", label: "Demandes de documents", icon: FileCheck, end: true },
]

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-[oklch(0.22_0.06_250)] flex flex-col text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-[oklch(0.75_0.11_210)] rounded-full" />
            <h2 className="text-xl font-bold tracking-wide">WAMA</h2>
          </div>
          <p className="text-xs text-white/50 mt-1 tracking-wider uppercase">
            Gestion RH Interne
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[oklch(0.75_0.11_210)] text-[oklch(0.2_0.04_250)]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40">WAMA INVEST © 2026</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}