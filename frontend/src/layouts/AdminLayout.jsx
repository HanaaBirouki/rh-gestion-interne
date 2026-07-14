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
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-sidebar flex flex-col text-sidebar-foreground shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center shrink-0 -rotate-3">
              <span className="text-sidebar-primary-foreground font-bold text-sm">W</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight leading-none">WAMA INVEST</h2>
              <p className="text-xs text-sidebar-foreground/60 mt-1">Gestion RH</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/40">© 2026 WAMA INVEST Group</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}