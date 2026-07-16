# backend/admin_portail/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # ==========================================
    # DASHBOARD ADMIN
    # ==========================================
    path('dashboard/', views.AdminDashboardView.as_view(), name='admin_dashboard'),
    
    # ==========================================
    # GESTION DES COLLABORATEURS
    # ==========================================
    path('collaborators/', views.CollaboratorListView.as_view(), name='collaborator_list'),
    path('collaborators/create/', views.CollaboratorCreateView.as_view(), name='collaborator_create'),
    path('collaborators/<uuid:pk>/', views.CollaboratorDetailView.as_view(), name='collaborator_detail'),
    path('collaborators/<uuid:pk>/toggle-active/', views.CollaboratorToggleActiveView.as_view(), name='collaborator_toggle_active'),
    
    # ==========================================
    # GESTION DES DOCUMENTS
    # ==========================================
    path('documents/upload/', views.DocumentUploadView.as_view(), name='document_upload'),
    path('documents/', views.DocumentListView.as_view(), name='document_list'),
    path('documents/<uuid:pk>/', views.DocumentDetailView.as_view(), name='document_detail'),
    path('documents/<uuid:pk>/delete/', views.DocumentDeleteView.as_view(), name='document_delete'),
    
    # ==========================================
    # GESTION DES BULLETINS DE PAIE
    # ==========================================
    path('payslips/upload/', views.PayslipUploadView.as_view(), name='payslip_upload'),
    path('payslips/', views.PayslipListView.as_view(), name='payslip_list'),
    path('payslips/<uuid:pk>/', views.PayslipDetailView.as_view(), name='payslip_detail'),
    path('payslips/<uuid:pk>/delete/', views.PayslipDeleteView.as_view(), name='payslip_delete'),
    
    # ==========================================
    # GESTION DES DEMANDES DE CONGÉS
    # ==========================================
    path('leave-requests/', views.LeaveRequestListView.as_view(), name='leave_request_list'),
    path('leave-requests/<uuid:pk>/', views.LeaveRequestDetailView.as_view(), name='leave_request_detail'),
    path('leave-requests/<uuid:pk>/review/', views.LeaveRequestReviewView.as_view(), name='leave_request_review'),
    
    # ==========================================
    # GESTION DES DEMANDES DE DOCUMENTS
    # ==========================================
    path('document-requests/', views.DocumentRequestListView.as_view(), name='document_request_list'),
    path('document-requests/<uuid:pk>/', views.DocumentRequestDetailView.as_view(), name='document_request_detail'),
    path('document-requests/<uuid:pk>/process/', views.DocumentRequestProcessView.as_view(), name='document_request_process'),
]