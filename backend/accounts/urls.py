# backend/accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # ==========================================
    # AUTHENTIFICATION
    # ==========================================
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # ==========================================
    # GESTION DES UTILISATEURS (Admin seulement)
    # ==========================================
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/<int:pk>/activate/', views.UserActivationView.as_view(), name='user-activate'),
]