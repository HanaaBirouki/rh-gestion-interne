from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='admin_dashboard'),
    path('collaborators/', views.CollaboratorListView.as_view(), name='collaborator_list'),
    path('collaborators/create/', views.CollaboratorCreateView.as_view(), name='collaborator_create'),
    path('collaborators/<uuid:id>/', views.CollaboratorDetailView.as_view(), name='collaborator_detail'),
    path('collaborators/<uuid:id>/toggle-active/', views.CollaboratorToggleActiveView.as_view(), name='collaborator_toggle_active'),
    path('documents/upload/', views.DocumentUploadView.as_view(), name='document_upload'),
    path('payslips/upload/', views.PayslipUploadView.as_view(), name='payslip_upload'),
    path('leave-requests/', views.LeaveRequestListView.as_view(), name='leave_request_list'),
    path('leave-requests/<uuid:id>/review/', views.LeaveRequestReviewView.as_view(), name='leave_request_review'),
    path('document-requests/', views.DocumentRequestListView.as_view(), name='document_request_list'),
    path('document-requests/<uuid:id>/process/', views.DocumentRequestProcessView.as_view(), name='document_request_process'),
]