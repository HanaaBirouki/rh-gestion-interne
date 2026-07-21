# backend/admin_portail/apps.py
from django.apps import AppConfig


class AdminPortailConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'admin_portail'
    verbose_name = "Back-office Administrateur"