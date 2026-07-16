# backend/employee_portail/apps.py
from django.apps import AppConfig


class EmployeePortailConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'employee_portail'
    verbose_name = "Espace Personnel Employé"