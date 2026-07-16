// frontend/src/components/layout/ProtectedRoute.jsx
import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (user?.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />
    }
    if (user?.role === "EMPLOYE") {
      return <Navigate to="/employee/dashboard" replace />
    }
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute