// frontend/src/routes.jsx
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

// Auth components
import Login from "./components/auth/Login"
import ForgotPassword from "./components/auth/ForgotPassword"
import ResetPassword from "./components/auth/ResetPassword"

// Layouts
import ProtectedRoute from "./components/layout/ProtectedRoute"
import AdminLayout from "./components/layout/AdminLayout"
import EmployeeLayout from "./components/layout/EmployeeLayout"

// Employee pages
import EmployeeDashboard from "./pages/EmployeeDashboard"
import ProfilePage from "./pages/ProfilePage"
import LeavesPage from "./pages/LeavesPage"
import DocumentsPage from "./pages/DocumentsPage"
import PayslipsPage from "./pages/PayslipsPage"
import RequestsPage from "./pages/RequestsPage"

// Admin pages
import AdminDashboard from "./pages/AdminDashboard"
import Collaborators from "./pages/admin/Collaborators"
import CreateCollaborator from "./pages/admin/CreateCollaborator"
import LeaveRequests from "./pages/admin/LeaveRequests"
import DocumentRequests from "./pages/admin/DocumentRequests"

import { useAuth } from "./hooks/useAuth"

const ProfileLayout = () => {
  const { user } = useAuth()
  return user?.role === "ADMIN" ? <AdminLayout /> : <EmployeeLayout />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==========================================
          ROUTES PUBLIQUES
          ========================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uidb64/:token/" element={<ResetPassword />} />

      {/* ==========================================
          ROUTES EMPLOYÉ
          ========================================== */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYE"]}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="leaves" element={<LeavesPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="payslips" element={<PayslipsPage />} />
        <Route path="requests" element={<RequestsPage />} />
      </Route>

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYE", "ADMIN"]}>
            <ProfileLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfilePage />} />
      </Route>

      {/* ==========================================
          ROUTES ADMIN
          ========================================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="collaborators" element={<Collaborators />} />
        <Route path="collaborators/create" element={<CreateCollaborator />} />
        <Route path="leave-requests" element={<LeaveRequests />} />
        <Route path="document-requests" element={<DocumentRequests />} />
      </Route>

      {/* ==========================================
          REDIRECTION
          ========================================== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes