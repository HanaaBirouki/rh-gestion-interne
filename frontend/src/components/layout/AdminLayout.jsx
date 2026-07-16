// frontend/src/components/layout/AdminLayout.jsx
import React from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Wallet,
  CalendarCheck,
  FileCheck,
  LogOut,
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

const navItems = [
  { to: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/collaborators", label: "Collaborateurs", icon: Users },
  { to: "/admin/collaborators/create", label: "Nouveau collaborateur", icon: UserPlus },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/payslips", label: "Bulletins de paie", icon: Wallet },
  { to: "/admin/leave-requests", label: "Demandes de congés", icon: CalendarCheck },
  { to: "/admin/document-requests", label: "Demandes de documents", icon: FileCheck },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest flex flex-col text-on-surface shrink-0 border-r border-outline-variant">
        {/* Logo */}
        <div className="p-6 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center shrink-0 -rotate-3">
              <span className="text-on-primary-container font-bold text-sm">W</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight leading-none text-primary">
                WAMA INVEST
              </h2>
              <p className="text-xs text-on-surface-variant/60 mt-1">Gestion RH</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-container text-on-primary-container shadow-sm"
                    : "text-on-surface-variant/70 hover:bg-surface-container-low hover:text-on-surface"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error-container/20 transition-colors mt-4"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant">
          <p className="text-xs text-on-surface-variant/40">© 2026 WAMA INVEST Group</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6">
        <Outlet />
      </main>
    </div>
  )
}