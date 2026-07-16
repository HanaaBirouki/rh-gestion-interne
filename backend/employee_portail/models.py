# backend/employee_portail/models.py
from django.db import models
from django.conf import settings
import uuid


# ==========================================
# MODÈLE: PROFIL EMPLOYÉ
# ==========================================

class EmployeeProfile(models.Model):
    """Profil étendu pour les employés"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='employee_profile'
    )
    
    # Champs supplémentaires pour l'employé
    matricule = models.CharField(max_length=50, unique=True, blank=True, null=True)
    poste = models.CharField(max_length=100, blank=True, null=True)
    departement = models.CharField(max_length=100, blank=True, null=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to="employee_portail/photos/", blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil employé"
        verbose_name_plural = "Profils employés"

    def __str__(self):
        return f"Profil de {self.user.get_full_name()}"