# backend/accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # ==========================================
    # CHOIX POUR LES RÔLES
    # ==========================================
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        EMPLOYE = 'EMPLOYE', 'Employé'
        STAGIAIRE = 'STAGIAIRE', 'Stagiaire'
        FREELANCE = 'FREELANCE', 'Freelance'

    # ==========================================
    # CHOIX POUR LES TYPES DE CONTRAT
    # ==========================================
    class ContractType(models.TextChoices):
        CDI = 'CDI', 'CDI'
        CDD = 'CDD', 'CDD'
        STAGE = 'STAGE', 'Stage'
        FREELANCE = 'FREELANCE', 'Freelance'

    # ==========================================
    # CHAMPS OBLIGATOIRES
    # ==========================================
    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(unique=True, verbose_name="Email professionnel")
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.EMPLOYE)
    first_name = models.CharField(max_length=150, verbose_name="Prénom")
    last_name = models.CharField(max_length=150, verbose_name="Nom")

    # ==========================================
    # CHAMPS OPTIONNELS
    # ==========================================
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")
    address = models.TextField(blank=True, null=True, verbose_name="Adresse")
    avatar_url = models.URLField(blank=True, null=True, verbose_name="Photo")

    # ==========================================
    # CHAMPS PROFESSIONNELS
    # ==========================================
    contract_type = models.CharField(max_length=20, choices=ContractType.choices, default=ContractType.CDI)
    position = models.CharField(max_length=100, blank=True, null=True, verbose_name="Poste")
    department = models.CharField(max_length=100, blank=True, null=True, verbose_name="Département")
    hire_date = models.DateField(null=True, blank=True, verbose_name="Date d'embauche")
    end_date = models.DateField(null=True, blank=True, verbose_name="Date de fin")
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Salaire brut")
    annual_leave_days = models.IntegerField(default=18, verbose_name="Jours de congés annuels")

    # ==========================================
    # CHAMPS DE STATUT
    # ==========================================
    is_active = models.BooleanField(default=True, verbose_name="Compte actif")
    is_active_employee = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ==========================================
    # CONFIGURATION DJANGO
    # ==========================================
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-created_at']

    # ==========================================
    # MÉTHODES
    # ==========================================
    def __str__(self):
        return f"{self.email} - {self.role}"

    def can_login(self):
        """Vérifie si l'utilisateur peut se connecter"""
        return self.role in ['ADMIN', 'EMPLOYE'] and self.is_active

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def is_admin(self):
        return self.role == 'ADMIN'

    @property
    def is_employee(self):
        return self.role == 'EMPLOYE'

    @property
    def is_stagiaire(self):
        return self.role == 'STAGIAIRE'

    @property
    def is_freelance(self):
        return self.role == 'FREELANCE'