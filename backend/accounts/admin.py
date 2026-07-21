# backend/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    model = User
    
    # Affichage dans la liste
    list_display = ('email', 'first_name', 'last_name', 'role', 'contract_type', 'is_active', 'is_active_employee')
    list_filter = ('role', 'contract_type', 'is_active', 'is_active_employee')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    # Champs dans la page de détail
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('email', 'username', 'first_name', 'last_name', 'phone', 'address', 'avatar_url')
        }),
        ('Informations professionnelles', {
            'fields': ('role', 'contract_type', 'position', 'department', 'hire_date', 
                      'end_date', 'salary', 'annual_leave_days')
        }),
        ('Statut', {
            'fields': ('is_active', 'is_active_employee', 'is_staff', 'is_superuser')
        }),
        ('Permissions', {
            'fields': ('groups', 'user_permissions')
        }),
    )
    
    # Champs pour la création d'un utilisateur
    add_fieldsets = (
        ('Création d\'un compte', {
            'fields': ('email', 'username', 'first_name', 'last_name', 'role', 'password1', 'password2')
        }),
    )


# Enregistrer seulement le modèle User dans accounts/admin.py
# Les autres modèles (LeaveRequest, Document, Payslip, DocumentRequest) 
# seront enregistrés dans admin_portail/admin.py
admin.site.register(User, CustomUserAdmin)