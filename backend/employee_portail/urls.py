# backend/employee_portail/urls.py
from django.urls import path
from .views import (
    EmployeeDashboardView,
    EmployeeDocumentListView,
    EmployeePayslipListView,
    EmployeeLeaveRequestListCreateView,
    EmployeeDocumentRequestListCreateView
)

urlpatterns = [
    path('dashboard/', EmployeeDashboardView.as_view(), name='employee_dashboard'),
    path('documents/', EmployeeDocumentListView.as_view(), name='employee_documents'),
    path('payslips/', EmployeePayslipListView.as_view(), name='employee_payslips'),
    path('leave-requests/', EmployeeLeaveRequestListCreateView.as_view(), name='employee_leave_requests'),
    path('document-requests/', EmployeeDocumentRequestListCreateView.as_view(), name='employee_document_requests'),
]