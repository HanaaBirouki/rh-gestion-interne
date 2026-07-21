// frontend/src/components/layout/Navbar.jsx
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../ui/button"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b border-outline-variant px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">domain</span>
            <span className="text-xl font-semibold text-primary">WAMA INVEST</span>
          </Link>
          <div className="hidden md:flex gap-4 ml-8">
            <Link
              to="/dashboard"
              className="text-on-surface-variant hover:text-on-surface text-base transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-on-surface-variant hover:text-on-surface text-base transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-on-surface-variant text-sm">
            {user?.first_name} {user?.last_name}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar