// frontend/src/components/layout/AdminSidebar.jsx
import React from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  FileText,
  ReceiptText,
  CalendarDays,
  FileClock,
  LogOut,
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/screen.png"

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Collaborateurs", icon: Users, href: "/admin/collaborators" },
  { name: "Documents", icon: FileText, href: "/admin/documents" },
  { name: "Bulletins", icon: ReceiptText, href: "/admin/payslips" },
  { name: "Congés", icon: CalendarDays, href: "/admin/leave-requests" },
  { name: "Demandes", icon: FileClock, href: "/admin/document-requests" },
]

const AdminSidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-[#E3E8F2] bg-white">
      {/* Logo */}
      <div className="flex min-h-[120px] items-center border-b border-[#E3E8F2] px-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="WAMA ADMIN" className="h-16 w-16 rounded-xl object-contain" />
          <div>
            <p className="text-xl font-bold tracking-tight text-[#0F2B68]">WAMA ADMIN</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
              Back-office
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Administration
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#2457D6] text-white shadow-[0_8px_20px_rgba(36,87,214,0.18)]"
                      : "text-slate-600 hover:bg-[#F1F5FF] hover:text-[#1742A0]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-[#F5F7FC] text-slate-500 group-hover:bg-white group-hover:text-[#1742A0]"
                      }`}
                    >
                      <Icon size={19} strokeWidth={1.9} />
                    </span>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Déconnexion */}
        <div className="mt-6 border-t border-[#E3E8F2] pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <LogOut size={19} strokeWidth={1.9} />
            </span>
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#E3E8F2] p-4">
        <div className="rounded-2xl border border-[#E4EAF5] bg-[#F7F9FD] p-4">
          <p className="text-sm font-bold text-[#0F2B68]">WAMA ADMIN</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Gérez les collaborateurs, documents et demandes RH.
          </p>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar