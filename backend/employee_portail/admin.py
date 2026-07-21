# backend/employee_portail/admin.py
from django.contrib import admin
from .models import EmployeeProfile


@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'matricule', 'poste', 'departement', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'matricule')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('user', 'matricule', 'poste', 'departement', 
                      'telephone', 'adresse', 'photo')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )