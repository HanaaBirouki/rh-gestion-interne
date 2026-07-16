# backend/admin_portail/admin.py
from django.contrib import admin
from .models import LeaveRequest, Document, Payslip, DocumentRequest


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'start_date', 'end_date', 'working_days', 'status', 'created_at')
    list_filter = ('type', 'status', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'reason')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Informations', {
            'fields': ('user', 'type', 'start_date', 'end_date', 'working_days', 'reason')
        }),
        ('Statut', {
            'fields': ('status', 'admin_comment')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'type', 'created_at')
    list_filter = ('type', 'created_at')
    search_fields = ('name', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Informations', {
            'fields': ('user', 'name', 'type', 'file_url')
        }),
        ('Dates', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Payslip)
class PayslipAdmin(admin.ModelAdmin):
    list_display = ('user', 'month', 'year', 'created_at')
    list_filter = ('year', 'month', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at',)
    ordering = ('-year', '-month')
    
    fieldsets = (
        ('Informations', {
            'fields': ('user', 'month', 'year', 'file_url')
        }),
        ('Dates', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(DocumentRequest)
class DocumentRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'status', 'created_at')
    list_filter = ('type', 'status', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'admin_comment')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Informations', {
            'fields': ('user', 'type', 'status', 'file_url')
        }),
        ('Commentaire', {
            'fields': ('admin_comment',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )