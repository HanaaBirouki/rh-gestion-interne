from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['email', 'first_name', 'last_name', 'role', 'contract_type', 'is_active_employee']
    list_filter = ['role', 'contract_type', 'is_active_employee']

    fieldsets = UserAdmin.fieldsets + (
        ('Informations RH', {
            'fields': (
                'role', 'contract_type', 'phone', 'address', 'avatar_url',
                'position', 'department', 'hire_date', 'end_date',
                'salary', 'annual_leave_days', 'is_active_employee',
            )
        }),
    )


admin.site.register(User, CustomUserAdmin)