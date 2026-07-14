from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, LeaveRequest, Document, Payslip, DocumentRequest

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'contract_type', 'is_active')
    list_filter = ('role', 'contract_type', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('email', 'username', 'first_name', 'last_name', 'phone', 'address', 'avatar_url')
        }),
        ('Informations professionnelles', {
            'fields': ('role', 'contract_type', 'position', 'department', 'hire_date', 
                      'end_date', 'salary', 'annual_leave_days')
        }),
        ('Statut', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        ('Permissions', {
            'fields': ('groups', 'user_permissions')
        }),
    )
    
    add_fieldsets = (
        ('Création d\'un compte', {
            'fields': ('email', 'username', 'first_name', 'last_name', 'role', 'password1', 'password2')
        }),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(LeaveRequest)
admin.site.register(Document)
admin.site.register(Payslip)
admin.site.register(DocumentRequest)