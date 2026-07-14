from django.urls import path
from . import views

urlpatterns = [
    # Authentification
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Gestion des utilisateurs (Admin seulement)
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<uuid:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/<uuid:pk>/activate/', views.UserActivationView.as_view(), name='user-activate'),
    
    # Demandes de congés
    path('leave-requests/', views.LeaveRequestListView.as_view(), name='leave-request-list'),
    path('leave-requests/<uuid:pk>/', views.LeaveRequestDetailView.as_view(), name='leave-request-detail'),
    path('leave-requests/<uuid:pk>/action/', views.LeaveRequestActionView.as_view(), name='leave-request-action'),
    
    # Documents
    path('documents/', views.DocumentListView.as_view(), name='document-list'),
    path('documents/<uuid:pk>/', views.DocumentDetailView.as_view(), name='document-detail'),
    
    # Bulletins de paie
    path('payslips/', views.PayslipListView.as_view(), name='payslip-list'),
    path('payslips/<uuid:pk>/', views.PayslipDetailView.as_view(), name='payslip-detail'),
    
    # Demandes de documents
    path('document-requests/', views.DocumentRequestListView.as_view(), name='document-request-list'),
    path('document-requests/<uuid:pk>/', views.DocumentRequestDetailView.as_view(), name='document-request-detail'),
    path('document-requests/<uuid:pk>/action/', views.DocumentRequestActionView.as_view(), name='document-request-action'),
]