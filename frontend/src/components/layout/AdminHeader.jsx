// frontend/src/components/layout/AdminHeader.jsx
import React from "react"
import { Bell, HelpCircle, Search } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

const AdminHeader = () => {
  const { user } = useAuth()

  const getInitials = () => {
    if (!user) return "A"
    return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
  }

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
      <div className="relative w-full max-w-xl">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Rechercher dans WAMA ADMIN..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-[#F7F9FD] pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#2F67F6] focus:bg-white focus:ring-4 focus:ring-[#2F67F6]/10"
        />
      </div>

      <div className="ml-6 flex items-center gap-4">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#F1F5FF] hover:text-[#1742A0]"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#F1F5FF] hover:text-[#1742A0]"
        >
          <HelpCircle size={19} />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#0F2557]">
              {user?.first_name} {user?.last_name || "Administrateur"}
            </p>
            <p className="text-xs text-slate-500">Administrateur</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE7FF] text-sm font-bold text-[#1742A0]">
            {getInitials()}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader