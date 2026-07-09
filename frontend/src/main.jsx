import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Collaborators from './pages/Collaborators'
import CreateCollaborator from './pages/CreateCollaborator'
import EditCollaborator from './pages/EditCollaborator'
import UploadDocument from './pages/UploadDocument'
import UploadPayslip from './pages/UploadPayslip'
import LeaveRequests from './pages/LeaveRequests'
import DocumentRequests from './pages/DocumentRequests'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="collaborators" element={<Collaborators />} />
          <Route path="collaborators/create" element={<CreateCollaborator />} />
          <Route path="collaborators/:id/edit" element={<EditCollaborator />} />
          <Route path="documents/upload" element={<UploadDocument />} />
          <Route path="payslips/upload" element={<UploadPayslip />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="document-requests" element={<DocumentRequests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)