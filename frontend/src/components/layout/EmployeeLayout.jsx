// frontend/src/components/layout/EmployeeLayout.jsx
import React from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  UserRound,
  CalendarDays,
  Files,
  ReceiptText,
  FileClock,
  LogOut,
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import logo from "../../assets/screen.png"

const navItems = [
  { to: "/employee/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/profile", label: "Profil", icon: UserRound },
  { to: "/employee/leaves", label: "Congés", icon: CalendarDays },
  { to: "/employee/documents", label: "Documents", icon: Files },
  { to: "/employee/payslips", label: "Bulletins", icon: ReceiptText },
  { to: "/employee/requests", label: "Demandes", icon: FileClock },
]

export default function EmployeeLayout() {
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
            <img src={logo} alt="WAMA RH" className="h-10 w-10 rounded-xl object-contain" />
            <div>
              <h2 className="text-lg font-bold tracking-tight leading-none text-primary">
                WAMA RH
              </h2>
              <p className="text-xs text-on-surface-variant/60 mt-1">Espace employé</p>
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
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  )
}